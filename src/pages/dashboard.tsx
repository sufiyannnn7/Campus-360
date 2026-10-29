import { useState, useEffect } from "react"
import { useGetMe, useGetStudentDashboard, useGetAdminDashboard } from "@workspace/api-client-react"
import { useAuth } from "@/context/auth-context"
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA } from "@/data/landing-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Calendar, Medal, Trophy, Star, ChevronRight, Bell, Ticket, Users,
  CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Sparkles, Plus,
  FileText, Activity, Layers, ArrowUpRight, Check, UserCheck, Building2,
  Clock, X, Newspaper, Send
} from "lucide-react"
import { Link } from "wouter"
import { cn, formatDateTime, getEventCategoryColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { coordinatorService, RoleElevationRequest } from "@/api/services/coordinator.service"
import { clubsService } from "@/api/services/clubs.service"
import { EventMediaUploader } from "@/components/events/event-media-uploader"

export default function Dashboard() {
  const { user: authUser } = useAuth()
  const { data: user } = useGetMe()

  // Robust User Resolution from real authenticated session
  const currentUser = authUser || user || {
    id: 1,
    name: "Student Member",
    email: "student@nkocet.ac.in",
    role: "student",
    department: "Computer Science & Engineering"
  }

  // Active role strictly from user profile
  const currentRole = currentUser.role || "student"

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      {/* Verified Role Header (No arbitrary switcher) */}
      <div className="p-3 px-4 rounded-xl bg-card border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-muted-foreground">Current Session:</span>
          <span className="font-bold text-foreground">{currentUser.name}</span>
          <Badge variant="secondary" className="capitalize text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            {currentRole === "coordinator" ? "Club Coordinator" : currentRole}
          </Badge>
        </div>
        <div className="text-[11px] text-muted-foreground font-medium">
          {currentUser.department || "NKOCET Campus Member"}
        </div>
      </div>

      {currentRole === "student" && <StudentDashboardView user={currentUser} />}
      {currentRole === "faculty" && <FacultyDashboardView user={currentUser} />}
      {currentRole === "coordinator" && <CoordinatorDashboardView user={currentUser} />}
      {currentRole === "admin" && <AdminDashboardView user={currentUser} />}
    </div>
  )
}

function StudentDashboardView({ user }: { user: any }) {
  const { data: dashboard } = useGetStudentDashboard()

  const safeRegistrations = dashboard?.upcomingRegistrations || UPCOMING_EVENTS_DATA.slice(0, 3).map((evt, idx) => ({
    registration: { id: idx + 1, status: idx === 0 ? "confirmed" : "registered" },
    event: evt
  }))

  const safePoints = dashboard?.totalPoints || 480
  const safeRank = dashboard?.rank || 4

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, {(user?.name || "Student").split(" ")[0]}</h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
              Verified Student
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-medium">NKOCET Computer Science & Engineering • Academic Year 2026</p>
        </div>

        <div className="flex items-center gap-3 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 shadow-2xs">
          <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider">Campus Engagement</div>
            <div className="text-xl font-black text-foreground flex items-center gap-2">
              {safePoints} pts
              <Badge variant="outline" className="text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40">
                Rank #{safeRank}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Safeguard Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-sm text-amber-800 dark:text-amber-200">Schedule Conflict Safeguard Active</div>
          <p className="text-amber-800/80 dark:text-amber-300/80 font-medium">
            Campus 360 automatically validates event times against your enrolled lectures and labs to ensure zero deadline conflicts.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Left Column: Registered Events */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-extrabold">My Registered Events & Tickets</CardTitle>
                <CardDescription>Upcoming hackathons, pitch slams & inaugural expos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs font-bold">
                <Link href="/events">Browse Events <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {safeRegistrations.map(({ registration, event }: any) => (
                <div
                  key={registration.id}
                  className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    {event.bannerUrl && (
                      <img src={event.bannerUrl} className="h-14 w-20 rounded-lg object-cover border shrink-0" alt="" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-extrabold", getEventCategoryColor(event.category))}>
                          {event.category}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-bold capitalize bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          {registration.status || "Confirmed"}
                        </Badge>
                      </div>
                      <h4 className="font-extrabold text-base text-foreground">{event.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {event.date || formatDateTime(event.startDatetime)}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" asChild className="shrink-0 text-xs font-bold">
                    <Link href={`/events/${event.id}`}>View Pass & Ticket →</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/calendar" className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all text-center space-y-2 group shadow-2xs">
              <Calendar className="h-6 w-6 text-primary mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Interactive Calendar</div>
            </Link>
            <Link href="/map" className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all text-center space-y-2 group shadow-2xs">
              <MapPin className="h-6 w-6 text-teal-500 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Campus Map</div>
            </Link>
            <Link href="/certificates" className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all text-center space-y-2 group shadow-2xs">
              <Medal className="h-6 w-6 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">My Certificates</div>
            </Link>
            <Link href="/leaderboard" className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all text-center space-y-2 group shadow-2xs">
              <Trophy className="h-6 w-6 text-purple-500 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Leaderboard</div>
            </Link>
          </div>
        </div>

        {/* Right Column: Badges & Certificates */}
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-500" /> Badges & Achievement Passes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 flex items-center gap-3">
                <Star className="h-8 w-8 text-amber-500 shrink-0" />
                <div>
                  <div className="font-extrabold text-xs">Eureka Pitch Finalist 2026</div>
                  <div className="text-[11px] text-muted-foreground">E-Cell NKOCET Pitch Slam</div>
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-primary/10 border-primary/30 flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <div className="font-extrabold text-xs">Verified Student Badge</div>
                  <div className="text-[11px] text-muted-foreground">NKOCET Computer Science</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

function FacultyDashboardView({ user }: { user: any }) {
  const { toast } = useToast()
  const [proposals, setProposals] = useState([
    { id: 1, title: "Eureka Pitching Competition (Internal Round)", organizer: "E-Cell NKOCET", venue: "Seminar Hall", status: "Approved" },
    { id: 2, title: "CSESA National Code-A-Thon 2026", organizer: "CSESA", venue: "Central Computer Center", status: "Approved" },
    { id: 3, title: "Future Tech AI Expo & Inauguration", organizer: "Future Tech Club", venue: "Seminar Hall", status: "Pending Review" }
  ])

  // Faculty News Circular Modal
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [newsTitle, setNewsTitle] = useState("")
  const [newsCategory, setNewsCategory] = useState("Department Circular")
  const [newsSummary, setNewsSummary] = useState("")
  const [newsContent, setNewsContent] = useState("")
  const [newsImage, setNewsImage] = useState("")

  // Faculty Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [eventTitle, setEventTitle] = useState("")
  const [eventCategory, setEventCategory] = useState("Academic Seminar")
  const [eventVenue, setEventVenue] = useState("Main Auditorium")
  const [eventDate, setEventDate] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventImage, setEventImage] = useState("")

  const handleApprove = (id: number) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p))
    toast({ title: "Event Approved", description: "Event has been endorsed for official campus scheduling." })
  }

  const handleReject = (id: number) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "Changes Requested" } : p))
    toast({ title: "Proposal Returned", description: "Changes requested from student organizers." })
  }

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsTitle.trim() || !newsSummary.trim()) {
      toast({ title: "Validation Error", description: "Title and summary are required.", variant: "destructive" })
      return
    }

    try {
      await coordinatorService.saveClubNews(1, {
        title: newsTitle.trim(),
        summary: newsSummary.trim(),
        content: newsContent.trim() || newsSummary.trim(),
        category: newsCategory,
        imageUrl: newsImage.trim() || undefined,
        isImportant: true,
        isPublished: true,
      })

      setIsNewsModalOpen(false)
      setNewsTitle("")
      setNewsSummary("")
      setNewsContent("")
      setNewsImage("")
      toast({
        title: "Circular Published!",
        description: `"${newsTitle}" is now visible to all students on the campus news feed.`,
      })
    } catch (err: any) {
      toast({ title: "Publish Failed", description: err?.message, variant: "destructive" })
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim()) {
      toast({ title: "Validation Error", description: "Event title is required.", variant: "destructive" })
      return
    }

    try {
      await coordinatorService.saveClubEvent(1, {
        title: eventTitle.trim(),
        category: eventCategory,
        venue: eventVenue,
        description: eventDescription,
        imageUrl: eventImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
        startDatetime: eventDate ? new Date(eventDate).toISOString() : new Date(Date.now() + 86400000 * 2).toISOString(),
        capacity: 120,
        status: "upcoming",
      })

      setIsEventModalOpen(false)
      setEventTitle("")
      setEventDescription("")
      toast({
        title: "Faculty Workshop Scheduled!",
        description: `"${eventTitle}" has been added to the master timetable.`,
      })
    } catch (err: any) {
      toast({ title: "Schedule Failed", description: err?.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Faculty Academic & Event Console</h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
              Department Mentor
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Publish official departmental circulars, review club event proposals, and monitor student lab engagement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsNewsModalOpen(true)} variant="outline" className="font-bold text-xs h-10 gap-1.5 shadow-2xs">
            <Newspaper className="h-4 w-4 text-primary" /> Post Circular / Notice
          </Button>
          <Button onClick={() => setIsEventModalOpen(true)} className="font-bold text-xs h-10 gap-1.5 shadow-md">
            <Plus className="h-4 w-4" /> Propose Faculty Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Department Events</div>
          <div className="text-2xl font-black mt-1 text-primary">14</div>
        </Card>
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Pending Approvals</div>
          <div className="text-2xl font-black mt-1 text-amber-500">1</div>
        </Card>
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Avg Attendance</div>
          <div className="text-2xl font-black mt-1 text-emerald-500">88%</div>
        </Card>
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Certificates Issued</div>
          <div className="text-2xl font-black mt-1 text-purple-500">420</div>
        </Card>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-extrabold">Event Proposals Under Review</CardTitle>
          <CardDescription className="text-xs">Endorse or request modifications on student-run club initiatives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {proposals.map(p => (
            <div key={p.id} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card shadow-2xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-extrabold text-base text-foreground">{p.title}</h4>
                  <Badge variant={p.status === "Approved" ? "default" : "outline"} className={p.status === "Approved" ? "bg-emerald-600 text-white" : "text-amber-600 border-amber-400"}>
                    {p.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Organized by {p.organizer} • Venue: {p.venue}</p>
              </div>
              {p.status === "Pending Review" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleReject(p.id)} className="text-destructive hover:bg-destructive/10 text-xs h-8">
                    Request Changes
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8">
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve Event
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Faculty Post Circular Modal */}
      <Dialog open={isNewsModalOpen} onOpenChange={setIsNewsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Publish Department Circular / Notice</DialogTitle>
            <DialogDescription className="text-xs">
              This circular will appear under the campus news feed and student notices.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishNews} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Circular Title *</Label>
              <Input
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="e.g. Schedule for Mid-Term Lab Submissions & Oral Exams"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Category</Label>
              <select
                value={newsCategory}
                onChange={(e) => setNewsCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-input bg-background px-3 py-2 shadow-2xs"
              >
                <option value="Department Circular">Department Circular</option>
                <option value="Exam & Evaluation Notice">Exam & Evaluation Notice</option>
                <option value="Placement & Internship Notice">Placement & Internship Notice</option>
                <option value="Research & Symposium">Research & Symposium</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Summary / Highlights *</Label>
              <Input
                value={newsSummary}
                onChange={(e) => setNewsSummary(e.target.value)}
                placeholder="Brief one-line summary for students..."
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Banner Image URL (Optional)</Label>
              <Input
                value={newsImage}
                onChange={(e) => setNewsImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Full Notice Content</Label>
              <Textarea
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                placeholder="Detailed instructions, deadlines, guidelines..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNewsModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="font-bold text-xs gap-1.5">
                <Send className="h-3.5 w-3.5" /> Publish Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Faculty Propose Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Propose Faculty Workshop or Lecture</DialogTitle>
            <DialogDescription className="text-xs">
              Directly schedule an academic masterclass, seminar, or industrial talk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEvent} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Event Title *</Label>
              <Input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Masterclass: Generative AI in Production"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Category</Label>
                <Input
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Venue</Label>
                <Input
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Event Date & Time</Label>
              <Input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Banner Image URL</Label>
              <Input
                value={eventImage}
                onChange={(e) => setEventImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description & Syllabus</Label>
              <Textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Brief outline and prerequisites..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEventModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="font-bold text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Schedule Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CoordinatorDashboardView({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-background to-card p-6 rounded-2xl border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Club Coordinator Management System</h1>
            <Badge className="bg-primary text-primary-foreground text-xs font-bold">Active Lead</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Manage your assigned club's complete profile, recruitments, candidate pipeline, events, announcements, and team leadership.
          </p>
        </div>
        <Button asChild size="lg" className="font-extrabold text-xs h-11 gap-2 shadow-md shrink-0">
          <Link href="/coordinator/dashboard">
            <Layers className="h-4 w-4" /> Open Dedicated Coordinator Hub
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Coordinator Operations Center</CardTitle>
            <CardDescription className="text-xs">Quick shortcuts to your assigned club management modules</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-xs">
            <Link href="/coordinator/profile">
              <Button variant="outline" className="w-full justify-start font-bold text-xs h-12 gap-2.5">
                <Building2 className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <div>Club Profile & Pages</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Edit branding, mission & meetings</div>
                </div>
              </Button>
            </Link>

            <Link href="/coordinator/recruitment">
              <Button variant="outline" className="w-full justify-start font-bold text-xs h-12 gap-2.5">
                <Layers className="h-4 w-4 text-purple-500" />
                <div className="text-left">
                  <div>Recruitment Drives</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Open/pause drives & positions</div>
                </div>
              </Button>
            </Link>

            <Link href="/coordinator/applications">
              <Button variant="outline" className="w-full justify-start font-bold text-xs h-12 gap-2.5">
                <UserCheck className="h-4 w-4 text-emerald-500" />
                <div className="text-left">
                  <div>Applications Pipeline</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Review & shortlist applicants</div>
                </div>
              </Button>
            </Link>

            <Link href="/coordinator/events">
              <Button variant="outline" className="w-full justify-start font-bold text-xs h-12 gap-2.5">
                <Calendar className="h-4 w-4 text-teal-500" />
                <div className="text-left">
                  <div>Club Events</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Host workshops & track check-ins</div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Public Club Shortcuts</CardTitle>
            <CardDescription className="text-xs">Preview live public presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/coordinator/dashboard">
              <Button className="w-full justify-between font-bold text-xs h-10 mb-2">
                <span>Coordinator Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/clubs">
              <Button variant="outline" className="w-full justify-between font-bold text-xs h-10">
                <span>Browse All Campus Clubs</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboardView({ user }: { user: any }) {
  const { data: dashboard } = useGetAdminDashboard()
  const { toast } = useToast()
  const [roleRequests, setRoleRequests] = useState<RoleElevationRequest[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)

  // Admin Event Modal State
  const [isAdminEventOpen, setIsAdminEventOpen] = useState(false)
  const [adminEventTitle, setAdminEventTitle] = useState("")
  const [adminEventCategory, setAdminEventCategory] = useState("Institute Hackathon")
  const [adminEventVenue, setAdminEventVenue] = useState("Main Campus Auditorium")
  const [adminEventDate, setAdminEventDate] = useState("")
  const [adminEventCapacity, setAdminEventCapacity] = useState(250)
  const [adminEventImage, setAdminEventImage] = useState("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80")
  const [adminEventGallery, setAdminEventGallery] = useState<string[]>([])
  const [adminEventDesc, setAdminEventDesc] = useState("")

  // Admin Circular Modal State
  const [isAdminNewsOpen, setIsAdminNewsOpen] = useState(false)
  const [adminNewsTitle, setAdminNewsTitle] = useState("")
  const [adminNewsSummary, setAdminNewsSummary] = useState("")
  const [adminNewsContent, setAdminNewsContent] = useState("")
  const [adminNewsCategory, setAdminNewsCategory] = useState("Official Institute Circular")
  const [adminNewsImage, setAdminNewsImage] = useState("")

  // Admin Create Club Modal State
  const [isAdminClubOpen, setIsAdminClubOpen] = useState(false)
  const [adminClubName, setAdminClubName] = useState("")
  const [adminClubCategory, setAdminClubCategory] = useState("Technical")
  const [adminClubTagline, setAdminClubTagline] = useState("")
  const [adminClubDesc, setAdminClubDesc] = useState("")
  const [adminClubAdvisor, setAdminClubAdvisor] = useState("")
  const [isSubmittingClub, setIsSubmittingClub] = useState(false)

  const handleCreateAdminClub = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminClubName.trim()) {
      toast({ title: "Validation Error", description: "Club name is required.", variant: "destructive" })
      return
    }

    setIsSubmittingClub(true)
    try {
      await clubsService.createClub({
        name: adminClubName.trim(),
        category: adminClubCategory,
        tagline: adminClubTagline.trim() || `${adminClubName.trim()} at NKOCET`,
        description: adminClubDesc.trim() || "Active campus society driving student innovation and activities.",
        facultyAdvisor: adminClubAdvisor.trim() || undefined,
      })

      setIsAdminClubOpen(false)
      setAdminClubName("")
      setAdminClubTagline("")
      setAdminClubDesc("")
      setAdminClubAdvisor("")
      toast({
        title: "Campus Club Created!",
        description: `"${adminClubName}" has been successfully chartered and added to the campus directory.`,
      })
    } catch (err: any) {
      toast({ title: "Failed to Create Club", description: err?.message, variant: "destructive" })
    } finally {
      setIsSubmittingClub(false)
    }
  }

  // Club pending approvals mock
  const [clubApprovals, setClubApprovals] = useState([
    { id: 1, clubName: "Coding Club NKOCET", changeType: "Mission & Meeting Venue Update", submittedBy: "Coordinator (Sufiyan)", status: "Pending" },
    { id: 2, clubName: "Robotics Society", changeType: "New Faculty Advisor Endorsement", submittedBy: "Lead (Aditya)", status: "Pending" },
  ])

  const loadRoleRequests = async () => {
    try {
      const reqs = await coordinatorService.getPendingRoleElevations()
      setRoleRequests(reqs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingRequests(false)
    }
  }

  useEffect(() => {
    loadRoleRequests()
  }, [])

  const handleResolve = async (req: RoleElevationRequest, approve: boolean) => {
    try {
      await coordinatorService.resolveRoleElevation(req.id, approve, req.targetRole, req.clubId, req.userId)
      toast({
        title: approve ? "Role Elevation Approved!" : "Request Rejected",
        description: approve
          ? `${req.userName} has been promoted to ${req.targetRole === "coordinator" ? `Club Coordinator for ${req.clubName || "Club"}` : "Faculty Advisor"}.`
          : `Role elevation request for ${req.userName} has been rejected.`,
      })
      await loadRoleRequests()
    } catch (err: any) {
      toast({
        title: "Action Failed",
        description: err?.message || "Could not resolve request.",
        variant: "destructive"
      })
    }
  }

  const handleApproveClubChange = (id: number, approve: boolean) => {
    setClubApprovals(prev => prev.filter(c => c.id !== id))
    toast({
      title: approve ? "Club Changes Approved!" : "Changes Returned",
      description: approve ? "Club profile update published to campus directory." : "Changes rejected and returned to coordinator.",
    })
  }

  const handleCreateAdminEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminEventTitle.trim()) {
      toast({ title: "Validation Error", description: "Event title is required.", variant: "destructive" })
      return
    }

    try {
      await coordinatorService.saveClubEvent(1, {
        title: adminEventTitle.trim(),
        category: adminEventCategory,
        venue: adminEventVenue,
        description: adminEventDesc.trim(),
        imageUrl: adminEventImage || undefined,
        bannerUrl: adminEventImage || undefined,
        galleryUrls: adminEventGallery,
        startDatetime: adminEventDate ? new Date(adminEventDate).toISOString() : new Date(Date.now() + 86400000 * 4).toISOString(),
        capacity: Number(adminEventCapacity),
        status: "upcoming",
      })

      setIsAdminEventOpen(false)
      setAdminEventTitle("")
      setAdminEventDesc("")
      setAdminEventGallery([])
      toast({
        title: "Campus Event Published!",
        description: `"${adminEventTitle}" has been scheduled and broadcast across Campus 360 calendar.`,
      })
    } catch (err: any) {
      toast({ title: "Publish Error", description: err?.message, variant: "destructive" })
    }
  }

  const handlePublishAdminNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminNewsTitle.trim() || !adminNewsSummary.trim()) {
      toast({ title: "Validation Error", description: "Title and summary are required.", variant: "destructive" })
      return
    }

    try {
      await coordinatorService.saveClubNews(1, {
        title: adminNewsTitle.trim(),
        summary: adminNewsSummary.trim(),
        content: adminNewsContent.trim() || adminNewsSummary.trim(),
        category: adminNewsCategory,
        imageUrl: adminNewsImage.trim() || undefined,
        isImportant: true,
        isPublished: true,
      })

      setIsAdminNewsOpen(false)
      setAdminNewsTitle("")
      setAdminNewsSummary("")
      setAdminNewsContent("")
      setAdminNewsImage("")
      toast({
        title: "Institute Circular Broadcasted!",
        description: `"${adminNewsTitle}" is now live on the public news feed and alerts.`,
      })
    } catch (err: any) {
      toast({ title: "Broadcast Failed", description: err?.message, variant: "destructive" })
    }
  }

  const stats = dashboard?.platformStats || {
    totalStudents: 4850,
    totalClubs: 9,
    totalEvents: 54,
    totalCertificates: 1420
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Campus 360 System Admin Console</h1>
            <Badge className="bg-primary text-primary-foreground font-bold text-xs">Full Authority</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Platform governance, coordinator elevation requests, club content approvals, and campus-wide notices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button onClick={() => setIsAdminClubOpen(true)} variant="outline" className="font-bold text-xs h-10 gap-1.5 shadow-2xs">
            <Building2 className="h-4 w-4 text-primary" /> Create New Club
          </Button>
          <Button onClick={() => setIsAdminNewsOpen(true)} variant="outline" className="font-bold text-xs h-10 gap-1.5 shadow-2xs">
            <Newspaper className="h-4 w-4 text-primary" /> Post Institute Circular
          </Button>
          <Button onClick={() => setIsAdminEventOpen(true)} className="font-bold text-xs h-10 gap-1.5 shadow-md">
            <Plus className="h-4 w-4" /> Create Campus Event
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Total Registered Students</div>
          <div className="text-2xl font-black mt-1 text-primary">{stats.totalStudents}</div>
        </Card>
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Active Campus Clubs</div>
          <div className="text-2xl font-black mt-1 text-teal-500">{stats.totalClubs}</div>
        </Card>
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Total Events</div>
          <div className="text-2xl font-black mt-1 text-purple-500">{stats.totalEvents}</div>
        </Card>
        <Card className="p-4 border shadow-2xs">
          <div className="text-xs text-muted-foreground font-extrabold uppercase">Certificates Issued</div>
          <div className="text-2xl font-black mt-1 text-amber-500">{stats.totalCertificates}</div>
        </Card>
      </div>

      {/* 1. Pending Role Elevation Requests (Coordinators & Faculty) */}
      <Card className="border shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-black tracking-tight">Pending Coordinator & Faculty Role Requests</CardTitle>
              {roleRequests.length > 0 && (
                <Badge className="bg-amber-500/15 text-amber-600 font-bold border-amber-500/30 text-xs">
                  {roleRequests.length} Pending
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Review and approve student requests to lead campus clubs or faculty requests for departmental advisory roles.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadRoleRequests} className="text-xs h-8">
            Refresh Requests
          </Button>
        </div>

        {loadingRequests ? (
          <div className="py-8 text-center text-xs text-muted-foreground">Loading pending elevation requests...</div>
        ) : roleRequests.length === 0 ? (
          <div className="py-8 text-center border rounded-xl bg-muted/20 space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <div className="text-xs font-bold">All Role Elevation Requests Resolved</div>
            <p className="text-[11px] text-muted-foreground">No pending club coordinator or faculty applications awaiting admin action.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roleRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border bg-card hover:bg-muted/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{req.userName}</span>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {req.targetRole === "coordinator" ? "Club Coordinator" : "Faculty Advisor"}
                    </Badge>
                    {req.clubName && (
                      <Badge className="bg-primary/10 text-primary font-bold border-primary/20 text-[10px]">
                        {req.clubName}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground font-medium">({req.userEmail})</span>
                  </div>

                  <p className="text-xs text-foreground/80 font-medium italic">
                    "{req.justification}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Dept: <strong className="text-foreground">{req.department || "Engineering"}</strong></span>
                    <span>PRN / ID: <strong className="text-foreground">{req.prn || "N/A"}</strong></span>
                    <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(req, false)}
                    className="text-xs h-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResolve(req, true)}
                    className="text-xs h-8 font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve & Assign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 2. Club Content & Status Approvals */}
      <Card className="border shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-black tracking-tight">Club Profile & Status Approvals</CardTitle>
              {clubApprovals.length > 0 && (
                <Badge className="bg-amber-500/15 text-amber-600 font-bold border-amber-500/30 text-xs">
                  {clubApprovals.length} Pending
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Review club modifications, meeting venue changes, and advisor reassignments before live publication.
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="outline" className="font-bold text-xs gap-1.5 shadow-2xs">
            <Link href="/coordinator/dashboard">
              <Layers className="h-4 w-4" /> Open Coordinator Hub
            </Link>
          </Button>
        </div>

        {clubApprovals.length === 0 ? (
          <div className="py-6 text-center border rounded-xl bg-muted/20 text-xs text-muted-foreground">
            All club profile changes verified and published.
          </div>
        ) : (
          <div className="space-y-3">
            {clubApprovals.map(ca => (
              <div key={ca.id} className="p-4 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{ca.clubName}</span>
                    <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-400">
                      {ca.changeType}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Submitted by {ca.submittedBy}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleApproveClubChange(ca.id, false)} className="text-xs h-8 text-destructive hover:bg-destructive/10">
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleApproveClubChange(ca.id, true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8">
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Admin Create Event Modal */}
      <Dialog open={isAdminEventOpen} onOpenChange={setIsAdminEventOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Create Campus-Wide Event</DialogTitle>
            <DialogDescription className="text-xs">
              System Administrators can create institution-wide hackathons, convocations, and fests.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAdminEvent} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Event Title *</Label>
              <Input
                value={adminEventTitle}
                onChange={(e) => setAdminEventTitle(e.target.value)}
                placeholder="e.g. Annual National Tech Fest 2026"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Category</Label>
                <Input
                  value={adminEventCategory}
                  onChange={(e) => setAdminEventCategory(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Max Capacity</Label>
                <Input
                  type="number"
                  value={adminEventCapacity}
                  onChange={(e) => setAdminEventCapacity(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={adminEventDate}
                  onChange={(e) => setAdminEventDate(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Venue / Auditorium</Label>
                <Input
                  value={adminEventVenue}
                  onChange={(e) => setAdminEventVenue(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <EventMediaUploader
              mainImageUrl={adminEventImage}
              onMainImageChange={setAdminEventImage}
              galleryUrls={adminEventGallery}
              onGalleryUrlsChange={setAdminEventGallery}
            />

            <div className="space-y-1">
              <Label className="text-xs font-bold">Full Event Description & Agenda</Label>
              <Textarea
                value={adminEventDesc}
                onChange={(e) => setAdminEventDesc(e.target.value)}
                placeholder="Detailed event overview, rules, schedule..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdminEventOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="font-bold text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Broadcast Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Publish Circular Modal */}
      <Dialog open={isAdminNewsOpen} onOpenChange={setIsAdminNewsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Broadcast Institute Circular</DialogTitle>
            <DialogDescription className="text-xs">
              Publish university notifications, campus alerts, or policy announcements.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishAdminNews} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Circular Subject / Title *</Label>
              <Input
                value={adminNewsTitle}
                onChange={(e) => setAdminNewsTitle(e.target.value)}
                placeholder="e.g. Revised Campus Schedule & Holiday Notice"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Category</Label>
              <Input
                value={adminNewsCategory}
                onChange={(e) => setAdminNewsCategory(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Summary Highlights *</Label>
              <Input
                value={adminNewsSummary}
                onChange={(e) => setAdminNewsSummary(e.target.value)}
                placeholder="One sentence summary for student feeds..."
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Banner Image URL</Label>
              <Input
                value={adminNewsImage}
                onChange={(e) => setAdminNewsImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Full Circular Content</Label>
              <Textarea
                value={adminNewsContent}
                onChange={(e) => setAdminNewsContent(e.target.value)}
                placeholder="Complete circular text..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdminNewsOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="font-bold text-xs gap-1.5">
                <Send className="h-3.5 w-3.5" /> Broadcast Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
