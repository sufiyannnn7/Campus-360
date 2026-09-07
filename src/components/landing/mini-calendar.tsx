import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MINI_CALENDAR_EVENTS, MiniCalendarEvent } from "@/data/landing-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeadingReveal, ScrollReveal } from "@/components/ui/scroll-reveal";
import { Calendar as CalendarIcon, ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";

export function MiniCalendar() {
  const today = new Date();
  const currentDayNumber = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const yearNumber = today.getFullYear();

  const daysInMonth = 31;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [activeEvent, setActiveEvent] = useState<MiniCalendarEvent | null>(
    MINI_CALENDAR_EVENTS[0] || null
  );

  return (
    <section className="py-16 md:py-24 bg-background border-b relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        
        {/* Header with HeadingReveal */}
        <HeadingReveal
          badge="Schedule Overview"
          badgeIcon={<CalendarIcon className="h-3.5 w-3.5" />}
          title="Campus Mini Calendar"
          subtitle="Quickly preview key event dates this month. Click any event badge for details."
          cta={
            <Link href="/calendar">
              <Button variant="outline" className="shrink-0 h-11 px-5 border-2 hover:bg-primary hover:text-primary-foreground font-semibold transition-all gap-2 hover:scale-105 active:scale-95">
                View Full Calendar <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar Widget */}
          <ScrollReveal direction="right" delay={0.1} className="lg:col-span-7">
            <Card className="border shadow-md bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <span>{monthName} {yearNumber}</span>
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block mr-1 animate-pulse" /> Event Scheduled
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                
                {/* Day Headers */}
                <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-2">
                  {daysArray.map((dayNum) => {
                    const eventOnDay = MINI_CALENDAR_EVENTS.find((e) => e.day === dayNum);
                    const isToday = dayNum === currentDayNumber;
                    const isSelected = activeEvent?.day === dayNum;

                    return (
                      <motion.button
                        key={dayNum}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (eventOnDay) setActiveEvent(eventOnDay);
                        }}
                        className={`relative min-h-[52px] sm:min-h-[60px] p-2 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isToday
                            ? "ring-2 ring-primary ring-offset-2 font-bold bg-primary/10 border-primary"
                            : isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/60 hover:border-primary/40 bg-card"
                        }`}
                      >
                        <span className={`text-xs font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>
                          {dayNum}
                        </span>

                        {/* Event Dot / Badge */}
                        {eventOnDay && (
                          <div className="mt-1">
                            <span className="hidden sm:block text-[10px] font-semibold truncate bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow-xs">
                              {eventOnDay.title}
                            </span>
                            <span className="sm:hidden h-2 w-2 rounded-full bg-primary block mx-auto mt-1" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Selected Event Side Panel */}
          <ScrollReveal direction="left" delay={0.2} className="lg:col-span-5">
            <Card className="border shadow-md bg-muted/20">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>Event Quick Preview</span>
                  <Badge variant="outline" className="text-xs font-medium">
                    {activeEvent ? `Day ${activeEvent.day}` : "Selected"}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {activeEvent ? (
                    <motion.div
                      key={activeEvent.eventId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Badge variant="secondary" className="font-semibold text-xs">
                          {activeEvent.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground leading-snug">
                          {activeEvent.title}
                        </h3>
                      </div>

                      <div className="space-y-3 text-sm text-muted-foreground bg-card p-4 rounded-xl border">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>{monthName} {activeEvent.day}, {yearNumber} • {activeEvent.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <span>Main Auditorium & Campus Grounds</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link href={`/events/${activeEvent.eventId}`}>
                          <Button className="w-full h-11 font-semibold gap-2 hover:scale-102 active:scale-98 transition-all">
                            View Event Details <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground space-y-2">
                      <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/50" />
                      <p className="text-sm font-medium">Click any date with an event indicator on the left to preview details.</p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}

