import { useListEvents } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/scroll-reveal";
import { Calendar, Search, MapPin, ArrowLeft, Clock, ChevronDown, History, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { cn, getStatusColor } from "@/lib/utils";
import { UPCOMING_EVENTS_DATA } from "@/data/landing-data";

const CATEGORY_TABS = [
  { id: "all", label: "All Events" },
  { id: "entrepreneurship", label: "Entrepreneurship" },
  { id: "technical", label: "Technical" },
  { id: "literary", label: "Literary" },
  { id: "social service", label: "Social Service" },
  { id: "sports", label: "Sports" },
  { id: "cultural", label: "Cultural" },
];

const TIMELINE_TABS = [
  { id: "all", label: "All Events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past Events Archive" },
];

export default function Events() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [timelineTab, setTimelineTab] = useState<string>("all");
  const [limit, setLimit] = useState<number>(6);

  const { data, isLoading } = useListEvents({
    q: search || undefined,
    category: category !== "all" ? category : undefined,
  });

  const rawList = Array.isArray(data) ? data : (data as any)?.events || UPCOMING_EVENTS_DATA;

  const isEventPast = (event: any) => {
    if (event.status === "past" || event.status === "completed") {
      return true;
    }
    const dateStr = event.start_datetime || event.startDatetime || event.date;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) && d.getTime() < Date.now();
  };

  const filteredList = rawList.filter((event: any) => {
    if (category !== "all") {
      const cat = (event.category || "").toLowerCase();
      const filterCat = category.toLowerCase();
      if (!cat.includes(filterCat) && !filterCat.includes(cat)) return false;
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

  const upcomingEvents = filteredList.filter((e: any) => !isEventPast(e));
  const pastEvents = filteredList.filter((e: any) => isEventPast(e));

  // Determine what to show based on timeline tab
  let displayUpcoming = upcomingEvents;
  let displayPast = pastEvents;

  if (timelineTab === "upcoming") {
    displayPast = [];
  } else if (timelineTab === "past") {
    displayUpcoming = [];
  }

  const renderEventCard = (event: any, isPast: boolean) => (
    <StaggerItem key={event.id} className="h-full">
      <Link href={`/events/${event.id}`}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.18 }}
          className="h-full"
        >
          <Card
            className={cn(
              "hover:border-primary/60 transition-all overflow-hidden border bg-card shadow-2xs hover:shadow-md cursor-pointer group flex flex-col justify-between h-full",
              isPast && "opacity-90 bg-muted/20"
            )}
          >
            <div>
              {/* Aspect Ratio Banner Image */}
              <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                {event.bannerUrl ? (
                  <img
                    src={event.bannerUrl}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                      isPast && "grayscale-[30%] group-hover:grayscale-0"
                    )}
                    alt={event.title}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold shadow-2xs bg-background/90 text-foreground backdrop-blur-xs">
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold shadow-2xs backdrop-blur-xs",
                      isPast ? "bg-stone-800/80 text-stone-100" : getStatusColor(event.status)
                    )}
                  >
                    {isPast ? "Concluded" : event.status}
                  </span>
                </div>
              </div>

              <CardContent className="p-3.5 space-y-1.5">
                <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                  {event.title}
                </h3>

                <div className="space-y-0.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Clock className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">
                      {typeof event.venue === "string" ? event.venue : event.venue?.name || "Campus Auditorium"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-3 pt-0 flex items-center justify-between border-t border-border/50 text-[11px]">
              <span className="text-muted-foreground font-medium truncate">By {event.organizer}</span>
              <span className="text-primary font-bold group-hover:underline shrink-0">
                {isPast ? "View Recap & Photos →" : "View Details →"}
              </span>
            </div>
          </Card>
        </motion.div>
      </Link>
    </StaggerItem>
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-semibold gap-1 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" /> Home
            </Button>
          </Link>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-primary" /> Campus Events Directory
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-2.5 py-0.5 font-bold text-xs bg-primary/10 text-primary border border-primary/20">
            {filteredList.length} Total Events
          </Badge>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b">
        {CATEGORY_TABS.map((tab) => {
          const isActive = category.toLowerCase() === tab.id.toLowerCase();
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCategory(tab.id);
                setLimit(6);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 shadow-2xs",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input & Timeline Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-2.5 rounded-xl border">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search events by title, venue or organizer..."
            className="pl-8 h-8 text-xs bg-background font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Timeline Tabs (All / Upcoming / Past) */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Timeline:</span>
          {TIMELINE_TABS.map((tab) => {
            const isActive = timelineTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimelineTab(tab.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-bold transition-all border cursor-pointer",
                  isActive
                    ? "bg-background text-primary border-primary/40 shadow-2xs font-extrabold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Presentation */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-xl border-dashed space-y-2">
          <Calendar className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">No events found in "{category}"</h3>
          <p className="text-xs text-muted-foreground">Try selecting "All Events" or clearing your search query.</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold mt-2"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setTimelineTab("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Upcoming Events */}
          {displayUpcoming.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-base font-extrabold text-foreground">Upcoming Campus Events</h2>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 border-emerald-200 bg-emerald-50">
                    {displayUpcoming.length} Scheduled
                  </Badge>
                </div>
              </div>

              <StaggerContainer
                key={`upcoming-${category}-${search}`}
                staggerDelay={0.05}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5"
              >
                {displayUpcoming.slice(0, limit).map((event: any) => renderEventCard(event, false))}
              </StaggerContainer>
            </div>
          )}

          {/* Section 2: Past Events & Archives */}
          {/* Automatically rendered if displayPast has events AND (timelineTab !== 'upcoming' OR upcomingEvents is fewer than 3) */}
          {(displayPast.length > 0 || (upcomingEvents.length < 3 && pastEvents.length > 0)) && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-base font-extrabold text-foreground">Past Events & Archives</h2>
                  <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground border-border bg-muted/40">
                    {pastEvents.length} Concluded
                  </Badge>
                </div>
                {upcomingEvents.length < 3 && timelineTab === "all" && (
                  <span className="text-[11px] text-muted-foreground italic">
                    Showing past events as fewer than 3 upcoming events are currently scheduled
                  </span>
                )}
              </div>

              <StaggerContainer
                key={`past-${category}-${search}`}
                staggerDelay={0.05}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5"
              >
                {pastEvents.map((event: any) => renderEventCard(event, true))}
              </StaggerContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
