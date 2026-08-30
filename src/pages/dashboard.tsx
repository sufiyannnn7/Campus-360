import { useState } from "react"
import { useGetMe, useGetStudentDashboard, useGetAdminDashboard } from "@workspace/api-client-react"
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA } from "@/data/landing-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  Calendar, Medal, Trophy, Star, ChevronRight, Bell, Ticket, Users,
  CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Sparkles, Plus,
  FileText, Activity, Layers, ArrowUpRight, Check, UserCheck
} from "lucide-react"
import { Link } from "wouter"
import { cn, formatDateTime, getEventCategoryColor } from "@/lib/utils"

export default function Dashboard() {
  const { data: user } = useGetMe()
  const [activePersona, setActivePersona] = useState<string>("")

  // Robust User Fallback
  const currentUser = user || {
    id: 1,
    name: "Sufiyan Shaikh",
    email: "sufiyan.shaikh@nkocet.ac.in",
    role: (localStorage.getItem("demo_role") as any) || "student",
    department: "Computer Science & Engineering"
  }

  // Active persona selection
  const currentRole = activePersona || currentUser.role || "student"

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      
      {/* Persona Switcher Bar */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/10 via-teal-500/10 to-primary/5 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2 font-semibold">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span>Active Role Interface: <strong className="capitalize text-foreground font-black px-2 py-0.5 rounded bg-background border">{currentRole}</strong></span>
        </div>
        <div className="flex items-center gap-1 bg-background border p-1 rounded-xl shadow-2xs">
          <span className="text-[10px] font-extrabold text-muted-foreground px-2 uppercase tracking-wider">Switch Persona:</span>
          {(["student", "faculty", "coordinator", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setActivePersona(r)
                localStorage.setItem("demo_role", r)
              }}
              className={cn(
                "px-2.5 py-1 rounded-lg capitalize font-bold transition-all text-xs cursor-pointer",
                currentRole === r ? "bg-primary text-primary-foreground font-black shadow-xs scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {r === "coordinator" ? "Club Lead" : r}
            </button>
          ))}
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
  const [proposals, setProposals] = useState([
    { id: 1, title: "Eureka Pitching Competition (Internal Round)", organizer: "E-Cell NKOCET", venue: "Seminar Hall", status: "Approved" },
    { id: 2, title: "CSESA National Code-A-Thon 2026", organizer: "CSESA", venue: "Central Computer Center", status: "Approved" },
    { id: 3, title: "Future Tech AI Expo & Inauguration", organizer: "Future Tech Club", venue: "Seminar Hall", status: "Pending Review" }
  ])

  const handleApprove = (id: number) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Faculty Event Oversight Console</h1>
          <p className="text-sm text-muted-foreground font-medium">Review department events, verify attendance rosters, and approve student proposals.</p>
        </div>
        <Button className="font-bold text-xs h-10 gap-1.5 shadow-md">
          <Plus className="h-4 w-4" /> Propose Faculty Event
        </Button>
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
        </CardHeader>
        <CardContent className="space-y-3">
          {proposals.map(p => (
            <div key={p.id} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card shadow-2xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-extrabold text-base text-foreground">{p.title}</h4>
                  <Badge variant={p.status === "Approved" ? "default" : "outline"} className={p.status === "Approved" ? "bg-emerald-600" : "text-amber-600 border-amber-400"}>
                    {p.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Organized by {p.organizer} • Venue: {p.venue}</p>
              </div>
              {p.status === "Pending Review" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8">
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve Event
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function CoordinatorDashboardView({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Club Operations Hub</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage student club recruitments, volunteer shift assignments, and live event check-ins.</p>
        </div>
        <Button asChild className="font-bold text-xs h-10 gap-1.5 shadow-md">
          <Link href="/recruitments"><Layers className="h-4 w-4" /> Open Recruitments Board</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Club Event Organizer Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/40 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="line-through text-muted-foreground">Reserve College Seminar Hall for Eureka Pitching</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/40 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="line-through text-muted-foreground">Publish recruitment post for E-Cell & CSESA volunteers</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border bg-primary/10 border-primary/30 font-bold">
              <div className="h-4 w-4 rounded-full border-2 border-primary shrink-0" />
              <span>Enable QR attendance check-in scanner for live event entries</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">My Club Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/clubs/1">
              <Button variant="outline" className="w-full justify-between font-bold text-xs h-10 mb-2">
                <span>E-Cell NKOCET Page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/clubs/2">
              <Button variant="outline" className="w-full justify-between font-bold text-xs h-10">
                <span>CSESA Page</span>
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

  const stats = dashboard?.platformStats || {
    totalStudents: 4850,
    totalClubs: 9,
    totalEvents: 54,
    totalCertificates: 1420
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-2xl border shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Campus 360 System Admin Console</h1>
        <p className="text-sm text-muted-foreground font-medium">Platform KPIs, role assignments, system health, and audit logs.</p>
      </div>

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
    </div>
  )
}
