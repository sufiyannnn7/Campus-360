import { useListEvents } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Search, MapPin, Filter, ArrowLeft, Clock, ChevronDown, Sparkles, Check } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { cn, getStatusColor } from "@/lib/utils"
import { UPCOMING_EVENTS_DATA } from "@/data/landing-data"

const CATEGORY_TABS = [
  { id: "all", label: "All Events" },
  { id: "entrepreneurship", label: "Entrepreneurship" },
  { id: "technical", label: "Technical" },
  { id: "literary", label: "Literary" },
  { id: "social service", label: "Social Service" },
  { id: "sports", label: "Sports" },
  { id: "cultural", label: "Cultural" },
]

const STATUS_TABS = [
  { id: "all", label: "All Statuses" },
  { id: "open", label: "Open" },
  { id: "filling fast", label: "Filling Fast" },
  { id: "closed", label: "Closed" },
]

export default function Events() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [limit, setLimit] = useState<number>(6)
  
  const { data, isLoading } = useListEvents({
    q: search || undefined,
    category: category !== 'all' ? category : undefined,
    status: status !== 'all' ? status : undefined
  })

  const fullEventsList = (Array.isArray(data) ? data : (data?.events || UPCOMING_EVENTS_DATA)).filter((event: any) => {
    if (category !== 'all') {
      const cat = (event.category || "").toLowerCase()
      const filterCat = category.toLowerCase()
      if (!cat.includes(filterCat) && !filterCat.includes(cat)) return false
    }
    if (status !== 'all') {
      const stat = (event.status || "").toLowerCase()
      const filterStat = status.toLowerCase()
      if (!stat.includes(filterStat) && !filterStat.includes(stat)) return false
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (event.title || "").toLowerCase().includes(q) ||
        (event.venue || "").toLowerCase().includes(q) ||
        (event.organizer || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const visibleEvents = fullEventsList.slice(0, limit)

  return (
    <div className="space-y-3 max-w-7xl mx-auto animate-in fade-in-50 duration-200">
      
      {/* Compact Top Header Bar */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs font-semibold gap-1 hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-3 w-3" /> Home
            </Button>
          </Link>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-primary" /> Campus Events Directory
          </h1>
        </div>
        <Badge variant="secondary" className="px-2.5 py-0.5 font-bold text-xs bg-primary/10 text-primary border border-primary/20">
          Showing {visibleEvents.length} of {fullEventsList.length} Events
        </Badge>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b">
        {CATEGORY_TABS.map((tab) => {
          const isActive = category.toLowerCase() === tab.id.toLowerCase()
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCategory(tab.id)
                setLimit(6)
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 shadow-2xs",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs scale-105"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {isActive && <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Search Input & Status Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-muted/30 p-2 rounded-xl border">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search events by title, venue or organizer..." 
            className="pl-8 h-8 text-xs bg-background font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Status:</span>
          {STATUS_TABS.map((tab) => {
            const isActive = status.toLowerCase() === tab.id.toLowerCase()
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatus(tab.id)
                  setLimit(6)
                }}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer",
                  isActive
                    ? "bg-background text-primary border-primary/50 shadow-2xs font-extrabold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : fullEventsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-xl border-dashed space-y-2">
          <Calendar className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">No events found in "{category}"</h3>
          <p className="text-xs text-muted-foreground">Try selecting "All Events" or clearing your search query.</p>
          <Button variant="outline" size="sm" className="text-xs font-bold mt-2" onClick={() => { setSearch(""); setCategory("all"); setStatus("all"); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          {/* EXACTLY 6 CARDS DISPLAYED (3 columns x 2 rows) with 3:3 / 4:3 Aspect Ratio */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {visibleEvents.map((event: any) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:border-primary/60 transition-all overflow-hidden border bg-card shadow-2xs cursor-pointer group hover:scale-[1.01] flex flex-col justify-between">
                  <div>
                    {/* Aspect Ratio 4:3 / 3:3 Banner Image */}
                    <div className="aspect-[4/3] sm:aspect-[16/10] bg-muted relative overflow-hidden">
                      {event.bannerUrl ? (
                        <img src={event.bannerUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-teal-500/10 flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs backdrop-blur-md bg-background/90 text-foreground">
                          {event.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs backdrop-blur-md", getStatusColor(event.status))}>
                          {event.status}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-3 space-y-1.5">
                      <h3 className="font-extrabold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-0.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <Clock className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1 line-clamp-1">
                          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{typeof event.venue === 'string' ? event.venue : (event.venue?.name || "Campus")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-3 pt-0 flex items-center justify-between border-t border-border/40 text-[11px]">
                    <span className="text-muted-foreground font-medium truncate">By {event.organizer}</span>
                    <span className="text-primary font-bold group-hover:underline shrink-0">View Details →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {fullEventsList.length > visibleEvents.length && (
            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit((prev) => prev + 6)}
                className="h-8 px-4 text-xs font-bold gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
              >
                <span>Load More Events ({fullEventsList.length - visibleEvents.length} remaining)</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
