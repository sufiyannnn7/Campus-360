import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO_HIGHLIGHT } from "@/data/landing-data";
import { ArrowRight, Calendar, Users, Sparkles, Trophy, CheckCircle2, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-28 border-b">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Featured Event Banner Chip */}
            <Link href={HERO_HIGHLIGHT.link}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{HERO_HIGHLIGHT.badge}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Your entire campus life,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-teal-500">
                unified.
              </span>
            </h1>

            {/* Short Product Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover events, join active student clubs, collect cryptographically verified certificates, and never miss a deadline again.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/events">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4" /> Explore Events
                </Button>
              </Link>
              
              <Link href="/clubs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-2 hover:bg-muted/80 gap-2 cursor-pointer">
                  <Users className="h-4 w-4" /> Join a Club
                </Button>
              </Link>
            </div>

            {/* Micro Feature Bullets */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero Deadlines Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>QR Attendance Scanner</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Official Verified Credentials</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Graphic / Card Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Mockup Container */}
              <div className="relative rounded-2xl border bg-card/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
                
                {/* Header preview bar */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">campushub.in/dashboard</span>
                </div>

                {/* Hero Showcase Card 1: HackSphere 2026 -> /events/1 */}
                <Link href="/events/1">
                  <div className="rounded-xl border bg-muted/40 p-4 flex items-center justify-between gap-4 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 font-bold">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors">HackSphere 2026</h4>
                        <p className="text-xs text-muted-foreground">Main Auditorium • 09:00 AM</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-emerald-600 text-white text-[11px] shrink-0 font-semibold">
                      Confirmed
                    </Badge>
                  </div>
                </Link>

                {/* Hero Showcase Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Active Clubs -> /clubs */}
                  <Link href="/clubs">
                    <div className="rounded-xl border bg-card p-3 shadow-sm space-y-2 hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-muted-foreground">Active Clubs</span>
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="text-xl font-bold text-foreground">32 Clubs</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Recruiting Now</div>
                    </div>
                  </Link>

                  {/* Certificates -> /certificates */}
                  <Link href="/certificates">
                    <div className="rounded-xl border bg-card p-3 shadow-sm space-y-2 hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-muted-foreground">Certificates</span>
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <div className="text-xl font-bold text-foreground">1,290+</div>
                      <div className="text-[10px] text-indigo-600 font-medium">Verified Badges</div>
                    </div>
                  </Link>

                </div>

                {/* Floating Notification Banner -> /recruitments */}
                <Link href="/recruitments">
                  <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-indigo-500/10 to-teal-500/10 p-3 flex items-center gap-3 hover:border-primary/50 transition-all cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-primary animate-ping shrink-0" />
                    <p className="text-xs font-medium text-foreground hover:text-primary transition-colors">
                      CodeCraft Club posted 3 new recruitment roles today!
                    </p>
                  </div>
                </Link>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
