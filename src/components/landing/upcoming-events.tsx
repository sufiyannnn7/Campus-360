import { useState } from "react";
import { Link } from "wouter";
import { UPCOMING_EVENTS_DATA, UpcomingEventItem } from "@/data/landing-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, Tag, Users } from "lucide-react";

export function UpcomingEvents() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Technical", "Cultural", "Sports", "Entrepreneurship"];

  const filteredEvents = selectedCategory === "All"
    ? UPCOMING_EVENTS_DATA
    : UPCOMING_EVENTS_DATA.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="events" className="py-16 md:py-24 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Upcoming Campus Events
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Explore workshops, technical hackathons, cultural showcases, and inter-college sports tournaments.
            </p>
          </div>

          {/* View All Events CTA */}
          <Link href="/events">
            <Button variant="outline" className="shrink-0 h-11 px-5 border-2 hover:bg-primary hover:text-primary-foreground font-semibold transition-all gap-2">
              View All Events <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full text-xs font-semibold px-4 transition-all shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: UpcomingEventItem) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="group h-full flex flex-col overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer">
                
                {/* Event Image Banner */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback gradient if image fails to load
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-background/95 backdrop-blur font-semibold text-xs shadow-sm">
                      {event.category}
                    </Badge>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={
                        event.status === "Filling Fast"
                          ? "bg-amber-500 text-white font-semibold text-[11px]"
                          : "bg-emerald-600 text-white font-semibold text-[11px]"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>

                {/* Event Details Content */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Organizer Club Header */}
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      {event.organizerLogo && (
                        <img
                          src={event.organizerLogo}
                          alt={event.organizer}
                          className="h-4 w-4 rounded-full"
                        />
                      )}
                      <span>{event.organizer}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {event.title}
                    </h3>
                  </div>

                  {/* Metadata Rows */}
                  <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    <span>{event.seatsLeft ? `${event.seatsLeft} seats remaining` : "Registration Open"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="text-center pt-4">
          <Link href="/events">
            <Button size="lg" className="px-8 font-semibold shadow-md gap-2">
              Browse All Campus Events <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
