import { useState, useMemo } from "react"
import { useListEvents } from "@workspace/api-client-react"
import { UPCOMING_EVENTS_DATA } from "@/data/landing-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search,
  MapPin, Clock, ExternalLink, Download, Layers, Ticket, ArrowLeft,
  Sparkles, Check, Building2, Flame
} from "lucide-react"
import { Link } from "wouter"
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, addDays
} from "date-fns"
import { cn, formatDateTime, getEventCategoryColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type ViewMode = "month" | "week" | "day" | "agenda"

export default function CalendarPage() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 22))
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  // Layer toggles
  const [layers, setLayers] = useState({
    academic: true,
    cultural: true,
    sports: true,
    club: true,
    workshop: true,
    hackathon: true,
  })

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const { data } = useListEvents({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    q: search || undefined,
    limit: 100,
  })

  const events = Array.isArray(data) ? data : (data?.events || UPCOMING_EVENTS_DATA)

  // Filter events based on active layer toggles
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const cat = (event.category || "").toLowerCase()
      if (cat.includes("academic") && !layers.academic) return false
      if (cat.includes("cultural") && !layers.cultural) return false
      if (cat.includes("sports") && !layers.sports) return false
      if (cat.includes("club") && !layers.club) return false
      if (cat.includes("workshop") && !layers.workshop) return false
      if ((cat.includes("hackathon") || cat.includes("seminar") || cat.includes("entrepreneurship")) && !layers.hackathon) return false
      
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          (event.title || "").toLowerCase().includes(q) ||
          (event.venue || "").toLowerCase().includes(q) ||
          (event.organizer || "").toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [events, layers, search])

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1))
    else if (viewMode === "week") setCurrentDate(addDays(currentDate, -7))
    else setCurrentDate(addDays(currentDate, -1))
  }

  const handleNext = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1))
    else if (viewMode === "week") setCurrentDate(addDays(currentDate, 7))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 22))
  }

  // Month View Days computation
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentDate])

  // Week View Days computation
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => {
      const rawDate = event.startDatetime || event.date
      if (!rawDate) return false
      const eventDate = new Date(rawDate)
      if (isNaN(eventDate.getTime())) return false
      return isSameDay(eventDate, day)
    })
  }

  const exportToICal = (event: any) => {
    const title = event.title || "Event"
    const description = event.description || event.title || ""
    const rawDate = event.startDatetime || event.date || new Date().toISOString()
    let eventDate = new Date(rawDate)
    if (isNaN(eventDate.getTime())) eventDate = new Date()
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, "")
    const end = eventDate.toISOString().replace(/-|:|\.\d+/g, "")

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:${description}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT\nEND:VCALENDAR`
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({ title: "Calendar File Exported", description: ".ics downloaded successfully." })
  }

  const getGoogleCalendarUrl = (event: any) => {
    const title = encodeURIComponent(event.title || "Event")
    const details = encodeURIComponent(event.description || event.title || "")
    const location = encodeURIComponent(typeof event.venue === 'string' ? event.venue : (event.venue?.name || "Campus"))
    const rawDate = event.startDatetime || event.date || new Date().toISOString()
    let eventDate = new Date(rawDate)
    if (isNaN(eventDate.getTime())) eventDate = new Date()
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, "")
    const end = eventDate.toISOString().replace(/-|:|\.\d+/g, "")
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto py-2 animate-in fade-in-50 duration-200">
      
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card px-4 py-3 rounded-2xl border shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 px-2.5 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Button>
          </Link>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-teal-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <CalendarIcon className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-foreground">Campus Calendar</h1>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Schedule
              </span>
            </div>
          </div>
        </div>

        {/* Header Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday} className="h-8 px-3 text-xs font-extrabold hover:bg-primary hover:text-primary-foreground transition-all">
            Today
          </Button>

          {/* Prev / Next */}
          <div className="flex items-center gap-0.5 border rounded-xl p-0.5 bg-muted/40 shadow-2xs">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handlePrev} aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handleNext} aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <span className="font-black text-sm min-w-[130px] text-center text-foreground font-mono bg-muted/30 px-3 py-1 rounded-xl border">
            {format(currentDate, "MMMM yyyy")}
          </span>

          {/* View Switcher Tabs */}
          <div className="flex items-center border rounded-xl p-0.5 bg-muted/40 text-xs font-bold shadow-2xs">
            {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer text-xs font-extrabold",
                  viewMode === mode
                    ? "bg-primary text-primary-foreground shadow-2xs font-black scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border rounded-2xl px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-2xs">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search calendar events..."
              className="pl-8 h-8 text-xs bg-background font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Compact Layer Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-primary" /> Layers:
          </span>

          {[
            { key: "academic", label: "Academic", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300" },
            { key: "cultural", label: "Cultural", color: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300" },
            { key: "sports", label: "Sports", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300" },
            { key: "club", label: "Clubs", color: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-300" },
            { key: "workshop", label: "Workshops", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300" },
            { key: "hackathon", label: "Hackathons", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300" },
          ].map((layer) => {
            const active = layers[layer.key as keyof typeof layers]
            return (
              <button
                key={layer.key}
                type="button"
                onClick={() => toggleLayer(layer.key as keyof typeof layers)}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 shadow-2xs",
                  active
                    ? `${layer.color}`
                    : "bg-muted/40 text-muted-foreground border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-current animate-pulse" : "bg-muted-foreground")} />
                <span>{layer.label}</span>
                {active && <Check className="h-3 w-3 stroke-[3]" />}
              </button>
            )
          })}
        </div>

      </div>

      {/* 1. COMPACT CALENDAR GRID (MINIMIZED HEIGHT) WITH BIG PROMINENT EVENT CARDS */}
      {viewMode === "month" && (
        <div className="border rounded-2xl bg-card shadow-md overflow-hidden animate-in fade-in-50 duration-200">
          
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b bg-muted/60 text-center font-black text-xs py-2 text-muted-foreground uppercase tracking-widest">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Days Grid - Compact Box Height (min-h-[88px] sm:min-h-[98px]) */}
          <div className="grid grid-cols-7 divide-x divide-y border-t-0">
            {monthDays.map((day) => {
              const dayEvents = getEventsForDay(day)
              const isCurrMonth = isSameMonth(day, currentDate)

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    setCurrentDate(day)
                    if (dayEvents.length > 0) setViewMode("day")
                  }}
                  className={cn(
                    "min-h-[88px] sm:min-h-[98px] p-2 transition-all flex flex-col justify-between cursor-pointer hover:bg-primary/5 hover:border-primary/40 group",
                    !isCurrMonth ? "bg-muted/10 text-muted-foreground/30" : "bg-card",
                    isToday(day) && "bg-primary/10 ring-2 ring-inset ring-primary/40"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        "text-xs font-black h-5 w-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                        isToday(day) ? "bg-primary text-primary-foreground font-black shadow-xs scale-105" : "text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-primary font-black bg-primary/15 px-2 py-0.5 rounded-full border border-primary/20">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* BIG PROMINENT EVENT CARDS INSIDE COMPACT DAY CELLS */}
                  <div className="space-y-1 overflow-hidden flex-1 flex flex-col justify-start">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(evt)
                        }}
                        className={cn(
                          "p-1.5 rounded-xl text-xs font-black truncate cursor-pointer transition-all border hover:scale-[1.02] flex items-center gap-2 bg-background hover:bg-primary/15 border-primary/20 shadow-xs",
                          getEventCategoryColor(evt.category)
                        )}
                        title={evt.title}
                      >
                        {evt.bannerUrl ? (
                          <img src={evt.bannerUrl} className="h-6 w-9 rounded-lg object-cover shrink-0 border border-black/20 shadow-2xs" alt="" />
                        ) : (
                          <span className="h-3 w-3 rounded-full bg-primary shrink-0" />
                        )}
                        <span className="truncate leading-snug font-extrabold text-xs text-foreground">{evt.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentDate(day)
                          setViewMode("day")
                        }}
                        className="text-[10px] text-primary font-black hover:underline cursor-pointer px-1 pt-0.5"
                      >
                        +{dayEvents.length - 2} more events
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 2. Week View */}
      {viewMode === "week" && (
        <div className="border rounded-2xl bg-card shadow-md overflow-hidden animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-7 divide-x border-b bg-muted/50">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                onClick={() => {
                  setCurrentDate(day)
                  setViewMode("day")
                }}
                className={cn(
                  "p-2.5 text-center cursor-pointer hover:bg-muted/70 transition-all group",
                  isToday(day) && "bg-primary/15 font-bold"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase font-black">{format(day, "EEE")}</div>
                <div className={cn("text-base font-black mt-0.5 group-hover:scale-110 transition-transform", isToday(day) && "text-primary")}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x min-h-[320px]">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day)
              return (
                <div key={day.toISOString()} className="p-2 space-y-2">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={cn(
                        "p-2 rounded-xl text-xs border cursor-pointer hover:scale-102 hover:shadow-md transition-all space-y-1.5 bg-card",
                        getEventCategoryColor(evt.category)
                      )}
                    >
                      {evt.bannerUrl && (
                        <img src={evt.bannerUrl} className="w-full h-16 rounded-lg object-cover border shadow-xs" alt="" />
                      )}
                      <div className="font-extrabold line-clamp-2 leading-tight text-xs">{evt.title}</div>
                      <div className="text-[10px] opacity-90 flex items-center gap-1 font-semibold">
                        <Clock className="h-3 w-3" /> {evt.time || format(new Date(evt.startDatetime), "p")}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. Day View */}
      {viewMode === "day" && (
        <Card className="border shadow-md animate-in fade-in-50 duration-200">
          <CardContent className="p-5">
            <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> {format(currentDate, "EEEE, MMMM d, yyyy")}
            </h2>
            {getEventsForDay(currentDate).length === 0 ? (
              <div className="text-center py-10 text-muted-foreground space-y-2">
                <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p className="font-bold text-sm">No events scheduled for this day.</p>
                <Button variant="outline" size="sm" onClick={() => setViewMode("month")}>Back to Month View</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {getEventsForDay(currentDate).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border hover:border-primary/50 transition-all cursor-pointer bg-card shadow-xs gap-3 hover:scale-[1.01]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {evt.bannerUrl ? (
                        <img src={evt.bannerUrl} className="h-20 w-full sm:w-36 rounded-xl object-cover shrink-0 border shadow-xs" alt="" />
                      ) : (
                        <div className="h-20 w-full sm:w-36 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <CalendarIcon className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", getEventCategoryColor(evt.category))}>
                            {evt.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                            <Clock className="h-3.5 w-3.5 text-primary" /> {evt.time || format(new Date(evt.startDatetime), "p")}
                          </span>
                        </div>
                        <h3 className="font-black text-base text-foreground">{evt.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {typeof evt.venue === 'string' ? evt.venue : (evt.venue?.name || "Campus")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); exportToICal(evt); }} className="text-xs font-bold gap-1">
                        <Download className="h-3.5 w-3.5" /> iCal
                      </Button>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedEvent(evt); }} className="text-xs font-bold gap-1">
                        View Pass →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 4. Agenda View */}
      {viewMode === "agenda" && (
        <Card className="border shadow-md">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Campus Agenda
            </h2>
            <div className="space-y-2.5">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-3 rounded-xl border bg-card hover:border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={evt.bannerUrl} className="h-12 w-16 rounded-lg object-cover shrink-0 border" alt="" />
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                        <span>📅 {evt.date} • {evt.time}</span>
                        <Badge variant="secondary" className="text-[10px]">{evt.category}</Badge>
                      </div>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">{evt.title}</h4>
                      <p className="text-xs text-muted-foreground">📍 {typeof evt.venue === 'string' ? evt.venue : (evt.venue?.name || "Campus")}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 text-xs font-bold">Details →</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Details Dialog Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl">
            <div className="relative h-48 bg-muted overflow-hidden">
              <img src={selectedEvent.bannerUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className={cn("text-xs font-bold shadow-md", getEventCategoryColor(selectedEvent.category))}>
                  {selectedEvent.category}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
                <h3 className="text-xl font-black leading-tight">{selectedEvent.title}</h3>
                <p className="text-xs text-white/80 flex items-center gap-2">
                  <span>📅 {selectedEvent.date}</span>
                  <span>• {selectedEvent.time}</span>
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2 text-foreground font-semibold">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{typeof selectedEvent.venue === 'string' ? selectedEvent.venue : (selectedEvent.venue?.name || "Campus")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Organized by: <strong className="text-foreground">{selectedEvent.organizer}</strong></span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={getGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full font-bold text-xs gap-1.5 h-9">
                    <ExternalLink className="h-4 w-4" /> Add to Google Calendar
                  </Button>
                </a>
                <Button onClick={() => exportToICal(selectedEvent)} className="flex-1 font-bold text-xs gap-1.5 h-9">
                  <Download className="h-4 w-4" /> Download .ics File
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

    </div>
  )
}
