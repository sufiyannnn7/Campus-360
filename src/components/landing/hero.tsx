import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO_HIGHLIGHT } from "@/data/landing-data";
import { ArrowRight, Calendar, Users, Sparkles, Trophy, CheckCircle2, ChevronRight } from "lucide-react";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative overflow-hidden w-full py-3 sm:py-5">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Featured Event Banner Chip */}
            <Link href={HERO_HIGHLIGHT.link}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4.5 py-1.5 text-xs sm:text-sm font-extrabold text-primary hover:bg-primary/20 transition-all cursor-pointer shadow-xs">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{HERO_HIGHLIGHT.badge}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>

            {/* Main Headline (Enlarged for Widescreen) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tight text-foreground leading-[1.08]">
              Your entire campus life,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-teal-500">
                unified.
              </span>
            </h1>

            {/* Product Description */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Discover events, join active student clubs, collect cryptographically verified certificates, and access role-based campus tools.
            </p>

            {/* Primary Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/events">
                <Button size="lg" className="h-13 px-8 text-base sm:text-lg font-black shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all gap-2.5 cursor-pointer">
                  <Calendar className="h-5 w-5" /> Explore Events
                </Button>
              </Link>
              
              <Link href="/clubs">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base sm:text-lg font-black border-2 hover:bg-muted/80 gap-2.5 cursor-pointer">
                  <Users className="h-5 w-5" /> Join a Club
                </Button>
              </Link>
            </div>

            {/* Feature Checkmarks */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-bold text-muted-foreground border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Zero Deadlines Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>QR Attendance Scanner</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Verified Credentials</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Graphic Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl border bg-card/95 p-6 shadow-2xl backdrop-blur-md space-y-4">
                
                {/* Header preview bar */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono font-bold">campus360.in/dashboard</span>
                </div>

                {/* Event Card Preview */}
                <Link href="/events/1">
                  <div className="rounded-2xl border bg-muted/40 p-4 flex items-center justify-between gap-3 hover:border-primary/50 transition-all cursor-pointer shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 font-black">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-foreground hover:text-primary transition-colors">Eureka Pitching Competition</h4>
                        <p className="text-xs text-muted-foreground font-semibold">Seminar Hall • Aug 22</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-emerald-600 text-white text-xs shrink-0 font-extrabold px-3 py-1">
                      Confirmed
                    </Badge>
                  </div>
                </Link>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/clubs">
                    <div className="rounded-2xl border bg-card p-3.5 shadow-xs space-y-1 hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-center text-xs font-extrabold text-muted-foreground">
                        <span>Active Clubs</span>
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-black text-foreground">9+ Clubs</div>
                      <div className="text-xs text-emerald-600 font-bold">Recruiting Now</div>
                    </div>
                  </Link>

                  <Link href="/certificates">
                    <div className="rounded-2xl border bg-card p-3.5 shadow-xs space-y-1 hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-center text-xs font-extrabold text-muted-foreground">
                        <span>Certificates</span>
                        <Trophy className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="text-2xl font-black text-foreground">1,420+</div>
                      <div className="text-xs text-indigo-600 font-bold">Verified Badges</div>
                    </div>
                  </Link>
                </div>

                {/* Floating Notification */}
                <Link href="/news/1">
                  <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-indigo-500/10 to-teal-500/10 p-3.5 flex items-center gap-3 hover:border-primary/50 transition-all cursor-pointer">
                    <div className="h-3 w-3 rounded-full bg-primary animate-ping shrink-0" />
                    <p className="text-xs font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                      Eureka Pitching & E-Cell launch reports published today!
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
