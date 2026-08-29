import { useState, useMemo } from "react"
import { useListEvents } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search,
  MapPin, Clock, ExternalLink, Download, Layers, Ticket, ArrowLeft,
  Sparkles, Check
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
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

  const events = data?.events || []

  // Filter events based on active layer toggles
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const cat = (event.category || "").toLowerCase()
      if (cat.includes("academic") && !layers.academic) return false
      if (cat.includes("cultural") && !layers.cultural) return false
      if (cat.includes("sports") && !layers.sports) return false
      if (cat.includes("club") && !layers.club) return false
      if (cat.includes("workshop") && !layers.workshop) return false
      if ((cat.includes("hackathon") || cat.includes("seminar")) && !layers.hackathon) return false
      return true
    })
  }, [events, layers])

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
    setCurrentDate(new Date())
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
      const eventDate = new Date(event.startDatetime)
      return isSameDay(eventDate, day)
    })
  }

  const exportToICal = (event: any) => {
    const title = event.title
    const description = event.description || ""
    const start = new Date(event.startDatetime).toISOString().replace(/-|:|\.\d+/g, "")
    const end = new Date(event.endDatetime || event.startDatetime).toISOString().replace(/-|:|\.\d+/g, "")

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
    const title = encodeURIComponent(event.title)
    const details = encodeURIComponent(event.description || "")
    const location = encodeURIComponent(event.venue?.name || "Campus")
    const start = new Date(event.startDatetime).toISOString().replace(/-|:|\.\d+/g, "")
    const end = new Date(event.endDatetime || event.startDatetime).toISOString().replace(/-|:|\.\d+/g, "")
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-in fade-in-50 duration-300">
      
      {/* Sleek Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 shadow-xs">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">Campus Calendar</h1>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Visual Schedule
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Interactive timetable with rich event banners & category filters.</p>
          </div>
        </div>

        {/* Header Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Today Button */}
          <Button variant="outline" size="sm" onClick={handleToday} className="h-8 px-3 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all">
            Today
          </Button>

          {/* Prev / Next */}
          <div className="flex items-center gap-0.5 border rounded-lg p-0.5 bg-muted/30">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={handlePrev} aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={handleNext} aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <span className="font-extrabold text-sm min-w-[130px] text-center text-foreground font-mono">
            {format(currentDate, "MMMM yyyy")}
          </span>

          {/* View Switcher Tabs */}
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/40 text-xs font-semibold">
            {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-2.5 py-1 rounded-md capitalize transition-all cursor-pointer text-xs",
                  viewMode === mode
                    ? "bg-primary text-primary-foreground shadow-xs font-bold scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sleek Animated Layers & Filter Toolbar */}
      <div className="bg-card/80 backdrop-blur border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        
        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 h-8 text-xs bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-md border bg-background font-semibold text-foreground cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="club">Club</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="workshop">Workshop</option>
            <option value="hackathon">Hackathons</option>
          </select>
        </div>

        {/* Animated Interactive Layer Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-primary" /> Layers:
          </span>

          {[
            { key: "academic", label: "Academic", color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900" },
            { key: "cultural", label: "Cultural", color: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900" },
            { key: "sports", label: "Sports", color: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900" },
            { key: "club", label: "Clubs", color: "bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-900" },
            { key: "workshop", label: "Workshops", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900" },
          ].map((layer) => {
            const active = layers[layer.key as keyof typeof layers]
            return (
              <button
                key={layer.key}
                type="button"
                onClick={() => toggleLayer(layer.key as keyof typeof layers)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95",
                  active
                    ? `${layer.color} shadow-2xs`
                    : "bg-muted/40 text-muted-foreground border-transparent opacity-60 hover:opacity-100"
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

      {/* Main View Display */}
      {viewMode === "month" && (
        <div className="border rounded-2xl bg-card shadow-md overflow-hidden animate-in fade-in-50 duration-200">
          
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b bg-muted/50 text-center font-extrabold text-[11px] py-2 text-muted-foreground uppercase tracking-widest">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Days Grid with Prominent Image Badges */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y border-t-0">
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
                    "min-h-[85px] sm:min-h-[96px] p-1.5 transition-all flex flex-col justify-between cursor-pointer hover:bg-primary/5 hover:border-primary/40 group",
                    !isCurrMonth ? "bg-muted/10 text-muted-foreground/40" : "bg-card",
                    isToday(day) && "bg-primary/5 ring-2 ring-inset ring-primary/40"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        "text-xs font-extrabold h-5 w-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                        isToday(day) && "bg-primary text-primary-foreground font-extrabold shadow-sm scale-110"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] text-primary font-extrabold bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">
                        {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Animated Event Badges WITH Large Image Thumbnail */}
                  <div className="space-y-1 overflow-hidden flex-1">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(evt)
                        }}
                        className={cn(
                          "p-1 rounded-md text-[10px] font-bold truncate cursor-pointer transition-all border hover:scale-102 hover:shadow-xs shadow-2xs flex items-center gap-1.5",
                          getEventCategoryColor(evt.category)
                        )}
                        title={evt.title}
                      >
                        {evt.bannerUrl ? (
                          <img src={evt.bannerUrl} className="h-5 w-7 rounded object-cover shrink-0 border border-black/15 shadow-2xs" alt="" />
                        ) : (
                          <span className="h-3 w-3 rounded-full bg-primary/60 shrink-0" />
                        )}
                        <span className="truncate leading-tight">{evt.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentDate(day)
                          setViewMode("day")
                        }}
                        className="text-[9px] text-primary font-bold hover:underline cursor-pointer px-1"
                      >
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week View WITH BIG Event Images */}
      {viewMode === "week" && (
        <div className="border rounded-2xl bg-card shadow-md overflow-hidden animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-7 divide-x border-b bg-muted/40">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                onClick={() => {
                  setCurrentDate(day)
                  setViewMode("day")
                }}
                className={cn(
                  "p-2.5 text-center cursor-pointer hover:bg-muted/60 transition-all group",
                  isToday(day) && "bg-primary/10 font-bold"
                )}
              >
                <div className="text-[10px] text-muted-foreground uppercase font-bold">{format(day, "EEE")}</div>
                <div className={cn("text-base font-extrabold mt-0.5 group-hover:scale-110 transition-transform", isToday(day) && "text-primary")}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x min-h-[340px]">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day)
              return (
                <div key={day.toISOString()} className="p-1.5 space-y-2">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={cn(
                        "p-2 rounded-xl text-xs border cursor-pointer hover:scale-102 hover:shadow-md transition-all space-y-1.5",
                        getEventCategoryColor(evt.category)
                      )}
                    >
                      {evt.bannerUrl && (
                        <img src={evt.bannerUrl} className="w-full h-16 rounded-lg object-cover border shadow-xs" alt="" />
                      )}
                      <div className="font-bold line-clamp-2 leading-tight text-[11px]">{evt.title}</div>
                      <div className="text-[9px] opacity-80 flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" /> {format(new Date(evt.startDatetime), "p")}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Day View WITH BIG Event Banner Cards */}
      {viewMode === "day" && (
        <Card className="border shadow-md animate-in fade-in-50 duration-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> {format(currentDate, "EEEE, MMMM d, yyyy")}
            </h2>
            {getEventsForDay(currentDate).length === 0 ? (
              <div className="text-center py-10 text-muted-foreground space-y-2">
                <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p className="font-medium text-sm">No events scheduled for this day.</p>
                <Button variant="outline" size="sm" onClick={() => setViewMode("month")}>Back to Month</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {getEventsForDay(currentDate).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border hover:border-primary/50 transition-all cursor-pointer bg-card shadow-xs gap-4 hover:scale-[1.01]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {evt.bannerUrl ? (
                        <img src={evt.bannerUrl} className="h-20 w-full sm:w-32 rounded-xl object-cover shrink-0 border shadow-xs" alt="" />
                      ) : (
                        <div className="h-20 w-full sm:w-32 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", getEventCategoryColor(evt.category))}>
                            {evt.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                            <Clock className="h-3.5 w-3.5" /> {format(new Date(evt.startDatetime), "p")}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-lg text-foreground">{evt.title}</h3>
                        {evt.venue && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-primary" /> {evt.venue.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="font-semibold text-xs h-9">View Details</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agenda View WITH Event Images */}
      {viewMode === "agenda" && (
        <Card className="border shadow-md animate-in fade-in-50 duration-200">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-extrabold">Upcoming Agenda</h2>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">No upcoming events matching active filters.</div>
            ) : (
              <div className="divide-y">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="py-3 flex items-center justify-between hover:bg-muted/50 px-2 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {evt.bannerUrl && (
                        <img src={evt.bannerUrl} className="h-14 w-20 rounded-xl object-cover shrink-0 border shadow-xs" alt="" />
                      )}
                      <div className="text-center min-w-[48px] bg-primary/10 p-2 rounded-xl border border-primary/20">
                        <div className="text-[10px] uppercase font-extrabold text-primary">
                          {format(new Date(evt.startDatetime), "MMM")}
                        </div>
                        <div className="text-base font-extrabold text-foreground leading-none mt-0.5">
                          {format(new Date(evt.startDatetime), "d")}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base group-hover:text-primary transition-colors">{evt.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 font-medium">
                          <span>{format(new Date(evt.startDatetime), "p")}</span>
                          {evt.venue && <span>• {evt.venue.name}</span>}
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase", getEventCategoryColor(evt.category))}>
                            {evt.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ExternalLink className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Detail Modal with Full High-Res Banner Header */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <DialogContent className="max-w-lg rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden p-0">
            {/* Top High-Res Banner Image Header */}
            {selectedEvent.bannerUrl ? (
              <div className="h-48 w-full relative overflow-hidden bg-muted">
                <img src={selectedEvent.bannerUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </div>
            ) : (
              <div className="h-28 w-full bg-gradient-to-r from-primary/20 to-teal-500/20" />
            )}

            <div className="p-6 pt-2">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs", getEventCategoryColor(selectedEvent.category))}>
                    {selectedEvent.category}
                  </span>
                  <span className="text-xs capitalize font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Status: {selectedEvent.status}
                  </span>
                </div>
                <DialogTitle className="text-xl font-extrabold leading-snug">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="text-sm mt-2 text-muted-foreground leading-relaxed">
                  {selectedEvent.description || "No detailed description provided."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 my-4 text-xs bg-muted/30 p-3.5 rounded-xl border">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>{formatDateTime(selectedEvent.startDatetime)}</span>
                </div>
                {selectedEvent.venue && (
                  <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{selectedEvent.venue.name} ({selectedEvent.venue.building})</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                <Button asChild className="flex-1 font-semibold text-xs h-9" size="sm">
                  <Link href={`/events/${selectedEvent.id}`}>
                    <Ticket className="mr-1.5 h-3.5 w-3.5" /> Go to Event
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToICal(selectedEvent)} className="font-semibold text-xs h-9">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> iCal
                </Button>
                <Button variant="outline" size="sm" asChild className="font-semibold text-xs h-9">
                  <a href={getGoogleCalendarUrl(selectedEvent)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Google
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
