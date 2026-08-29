import { useState } from "react"
import { useGetMe, useGetStudentDashboard, useGetAdminDashboard } from "@workspace/api-client-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  Calendar, Medal, Trophy, Star, ChevronRight, Bell, Ticket, Users,
  CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Sparkles, Plus,
  FileText, Activity, Layers, ArrowUpRight
} from "lucide-react"
import { Link } from "wouter"
import { cn, formatDateTime, getEventCategoryColor } from "@/lib/utils"

export default function Dashboard() {
  const { data: user } = useGetMe()
  const [activePersona, setActivePersona] = useState<string>("student")

  if (!user) return null

  // Allow switching personas for preview/review purposes
  const currentRole = activePersona || user.role

  return (
    <div className="space-y-6">
      {/* Persona Switcher Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 via-teal-500/10 to-primary/5 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span>Active Persona Dashboard: <strong className="capitalize text-foreground">{currentRole}</strong></span>
        </div>
        <div className="flex items-center gap-1 bg-background border p-1 rounded-lg">
          {(["student", "faculty", "coordinator", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActivePersona(r)}
              className={cn(
                "px-2.5 py-1 rounded capitalize font-medium transition-all",
                currentRole === r ? "bg-primary text-primary-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {currentRole === "student" && <StudentDashboardView user={user} />}
      {currentRole === "faculty" && <FacultyDashboardView user={user} />}
      {currentRole === "coordinator" && <CoordinatorDashboardView user={user} />}
      {currentRole === "admin" && <AdminDashboardView user={user} />}
    </div>
  )
}

function StudentDashboardView({ user }: { user: any }) {
  const { data: dashboard, isLoading } = useGetStudentDashboard()

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted rounded-xl animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-32 bg-muted rounded-xl animate-pulse md:col-span-2" />
          <div className="h-32 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground">Here's your personal schedule, points, and event recommendations.</p>
        </div>

        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Campus Rank & Points</div>
            <div className="text-xl font-extrabold text-foreground flex items-center gap-2">
              {dashboard.totalPoints} pts
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                Rank #{dashboard.rank || 4}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Conflict Alert Banner (Wow Feature) */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-sm text-amber-700 dark:text-amber-300">Schedule Conflict Safeguard Active</div>
          <p className="text-amber-800 dark:text-amber-200">
            CampusHub automatically checks registered event start times against your class schedule and overlapping events.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Registrations & Recommendations */}
        <div className="md:col-span-2 space-y-6">
          {/* Upcoming Registered Events */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold">My Upcoming Events</CardTitle>
                <CardDescription>Events you are confirmed or waitlisted for</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/events">Browse All <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {dashboard.upcomingRegistrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                  You haven't registered for any upcoming events yet.
                </div>
              ) : (
                dashboard.upcomingRegistrations.map(({ registration, event }: any) => (
                  <div
                    key={registration.id}
                    className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold", getEventCategoryColor(event.category))}>
                          {event.category}
                        </span>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {registration.status}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-base">{event.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {formatDateTime(event.startDatetime)}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild className="shrink-0">
                      <Link href={`/events/${event.id}`}>View Pass & Ticket</Link>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/calendar" className="p-4 rounded-xl border bg-card hover:border-primary transition-all text-center space-y-2 group">
              <Calendar className="h-6 w-6 text-primary mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Interactive Calendar</div>
            </Link>
            <Link href="/map" className="p-4 rounded-xl border bg-card hover:border-primary transition-all text-center space-y-2 group">
              <MapPin className="h-6 w-6 text-teal-500 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Campus Map</div>
            </Link>
            <Link href="/certificates" className="p-4 rounded-xl border bg-card hover:border-primary transition-all text-center space-y-2 group">
              <Medal className="h-6 w-6 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">My Certificates</div>
            </Link>
            <Link href="/leaderboard" className="p-4 rounded-xl border bg-card hover:border-primary transition-all text-center space-y-2 group">
              <Trophy className="h-6 w-6 text-purple-500 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Leaderboard</div>
            </Link>
          </div>
        </div>

        {/* Right Column: Badges & Achievements */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-500" /> Badges & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/30 flex items-center gap-3">
                <Star className="h-8 w-8 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold text-xs">First Step Badge</div>
                  <div className="text-[11px] text-muted-foreground">Attended 1st Campus Event</div>
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-muted/40 flex items-center gap-3 opacity-60">
                <Trophy className="h-8 w-8 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-bold text-xs">Event Master</div>
                  <div className="text-[11px] text-muted-foreground">Attend 5 events (Progress: 2/5)</div>
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty Event Oversight Console</h1>
          <p className="text-muted-foreground">Review department events, verify attendance reports, and approve proposals.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Propose New Event</Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Events Under Oversight</div>
          <div className="text-2xl font-bold mt-1 text-primary">12</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Pending Approvals</div>
          <div className="text-2xl font-bold mt-1 text-amber-500">3</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Avg. Event Attendance</div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">84%</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Certificates Verified</div>
          <div className="text-2xl font-bold mt-1">142</div>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Pending Event Proposals for Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-xl border flex items-center justify-between bg-card">
            <div>
              <h4 className="font-bold text-base">Annual Tech Symposium 2026</h4>
              <p className="text-xs text-muted-foreground">Submitted by Coding Club • Main Auditorium • Aug 20, 2026</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-500/30">Approve</Button>
              <Button size="sm" variant="ghost" className="text-rose-600">Reject</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CoordinatorDashboardView({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Operations Hub</h1>
          <p className="text-muted-foreground">Manage club recruitments, volunteer shift assignments, and live event check-ins.</p>
        </div>
        <Button asChild><Link href="/recruitments"><Layers className="mr-2 h-4 w-4" /> Open Kanban Board</Link></Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Club Event Organizer Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="line-through text-muted-foreground">Reserve Main Auditorium venue</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="line-through text-muted-foreground">Publish recruitment post for volunteers</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-background font-medium">
              <div className="h-4 w-4 rounded-full border-2 border-primary" />
              <span>Enable QR attendance check-in scanner for live event</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboardView({ user }: { user: any }) {
  const { data: dashboard, isLoading } = useGetAdminDashboard()

  if (isLoading || !dashboard) {
    return <div className="p-8 text-center animate-pulse">Loading Platform Analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campus 360 System Admin Console</h1>
        <p className="text-muted-foreground">Platform KPIs, role assignments, system health, and audit logs.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Total Users</div>
          <div className="text-2xl font-bold mt-1 text-primary">{dashboard.platformStats?.totalStudents || 0}</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Active Clubs</div>
          <div className="text-2xl font-bold mt-1 text-teal-500">{dashboard.platformStats?.totalClubs || 0}</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Total Events</div>
          <div className="text-2xl font-bold mt-1 text-purple-500">{dashboard.platformStats?.totalEvents || 0}</div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="text-xs text-muted-foreground font-semibold">Certificates Issued</div>
          <div className="text-2xl font-bold mt-1 text-amber-500">{dashboard.platformStats?.totalCertificates || 0}</div>
        </Card>
      </div>
    </div>
  )
}
