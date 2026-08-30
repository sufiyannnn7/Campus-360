import { useListEvents } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, MapPin, Users, Filter, Ticket, ArrowLeft, Clock } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { cn, formatDateTime, getEventCategoryColor, getStatusColor } from "@/lib/utils"
import { UPCOMING_EVENTS_DATA } from "@/data/landing-data"

export default function Events() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  
  const { data, isLoading } = useListEvents({
    q: search || undefined,
    category: category !== 'all' ? category : undefined,
    status: status !== 'all' ? status : undefined
  })

  const eventsList = (Array.isArray(data) ? data : (data?.events || UPCOMING_EVENTS_DATA)).filter((event: any) => {
    if (category !== 'all' && event.category?.toLowerCase() !== category.toLowerCase()) return false;
    if (status !== 'all' && event.status?.toLowerCase() !== status.toLowerCase()) return false;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" /> Campus Events Directory
          </h1>
          <p className="text-muted-foreground mt-1">Discover, filter and register for hackathons, pitch slams, and club inaugurations.</p>
        </div>
        <Button className="shrink-0 font-semibold shadow-sm"><Ticket className="mr-2 h-4 w-4" /> My Registrations</Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
        <div className="flex-1">
          <Input 
            placeholder="Search events by title, venue or organizer..." 
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-full md:w-[180px]">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                 <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Literary">Literary</SelectItem>
                <SelectItem value="Social Service">Social Service</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-[180px]">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="filling fast">Filling Fast</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : eventsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border rounded-xl border-dashed">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
             <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No events found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
          <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setCategory("all"); setStatus("all"); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map((event: any) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full flex flex-col hover-elevate transition-all overflow-hidden border-border/50 shadow-sm cursor-pointer group">
                <div className="h-48 bg-muted relative">
                  {event.bannerUrl ? (
                    <img src={event.bannerUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-teal-500/10 flex items-center justify-center">
                       <Calendar className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm backdrop-blur-md bg-background/95 text-foreground">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm backdrop-blur-md", getStatusColor(event.status))}>
                      {event.status}
                    </span>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                    <div className="space-y-1 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t text-xs">
                    <span className="text-muted-foreground font-medium">By {event.organizer}</span>
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
