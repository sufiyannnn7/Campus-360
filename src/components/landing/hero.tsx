import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO_HIGHLIGHT } from "@/data/landing-data";
import { FloatElement, ParallaxBackground } from "@/components/ui/scroll-reveal";
import {
  ArrowRight, Calendar, Users, Sparkles, Trophy,
  CheckCircle2, ChevronRight, Zap, GraduationCap, Clock, Ticket
} from "lucide-react";

const checkFeatures = [
  "Zero Deadlines Missed",
  "QR Attendance Scanner",
  "Verified Credentials",
];

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative overflow-hidden w-full py-4 sm:py-6">
      {/* Warm background orbs */}
      <ParallaxBackground speed={0.3}>
        <div className="relative w-full h-full pointer-events-none">
          <div className="absolute top-8 left-1/4 w-[480px] h-[480px] bg-primary/12 rounded-full blur-3xl animate-glow" />
          <div className="absolute top-32 right-8 w-[360px] h-[360px] bg-secondary/10 rounded-full blur-3xl" style={{ animationDelay: '1.2s' }} />
          <div className="absolute -bottom-20 left-12 w-[320px] h-[320px] bg-accent/8 rounded-full blur-3xl animate-glow" style={{ animationDelay: '0.6s' }} />
        </div>
      </ParallaxBackground>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ── Left Column ── */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

            {/* Live badge — badge-pop animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Link href={HERO_HIGHLIGHT.link}>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs sm:text-sm font-bold text-primary hover:bg-primary/15 transition-all cursor-pointer hover:scale-105 active:scale-95">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{HERO_HIGHLIGHT.badge}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </div>
              </Link>
            </motion.div>

            {/* Headline — handcrafted editorial highlight without gradient colors */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-[4.25rem] font-black tracking-tight text-foreground leading-[1.08]"
            >
              Your entire campus life,{" "}
              <span className="relative inline-block mx-1">
                <span
                  className="relative z-10 italic font-medium text-secondary tracking-normal px-2.5"
                  style={{ fontFamily: 'var(--font-serif, serif)' }}
                >
                  unified.
                </span>
                {/* 21st.dev craft marker highlight badge */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  className="absolute inset-x-0 bottom-1.5 h-3.5 bg-secondary/15 rounded-md -rotate-1 origin-left pointer-events-none"
                />
                {/* Handcrafted wave underline accent */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3 text-primary overflow-visible"
                  viewBox="0 0 120 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M3 8.5 C 30 2, 70 13, 117 5.5"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: "easeInOut" }}
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle — slide + fade */}
            <motion.p
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Discover events, join active student clubs, collect cryptographically verified certificates, and access role-based campus tools — all in one warm, connected space.
            </motion.p>

            {/* CTAs — scale stagger */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1"
            >
              <Link href="/events">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-craft-lg hover:scale-105 active:scale-95 transition-all gap-2.5 cursor-pointer rounded-xl border border-primary-border"
                >
                  <Calendar className="h-5 w-5" /> Explore Events
                </Button>
              </Link>

              <Link href="/clubs">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base font-bold border-2 border-primary/35 hover:border-primary hover:bg-primary/8 hover:scale-105 active:scale-95 gap-2.5 cursor-pointer transition-all rounded-xl text-primary bg-card/80 shadow-craft-sm"
                >
                  <Users className="h-5 w-5" /> Join a Club
                </Button>
              </Link>
            </motion.div>

            {/* Feature checks — stagger in one by one */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12, delayChildren: 0.48 } },
              }}
              className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-semibold text-muted-foreground border-t border-border/50"
            >
              {checkFeatures.map((feat) => (
                <motion.div
                  key={feat}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                  }}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column: App Preview Card (Craft Bento Shape) ── */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 44, scale: 0.93 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <FloatElement duration={7} amplitude={7}>
                <div className="relative rounded-[2rem] border-2 border-border/80 bg-card p-6 shadow-craft-lg backdrop-blur-sm space-y-4 animate-breathe hover:shadow-2xl transition-shadow duration-500 overflow-hidden">

                  {/* Corner ticket cutouts for artisanal look */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-background border border-border/70 pointer-events-none" />
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-background border border-border/70 pointer-events-none" />

                  {/* ── Browser-style address bar (Craft edition) ── */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2 bg-muted/80 rounded-lg px-2.5 py-1 border border-border/50">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary tracking-wide">Campus360</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono opacity-70">campus360.in/dashboard</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* Event card preview with relative-time label & quick action button */}
                  <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 space-y-2.5 hover:border-primary/50 transition-all shadow-craft-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary shrink-0">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <Link href="/events/1">
                            <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                              Eureka Pitching Competition
                            </h4>
                          </Link>
                          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Seminar Hall · Aug 22</p>
                        </div>
                      </div>

                      {/* Live badge + countdown/relative-time label */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 shrink-0">
                          Live
                        </Badge>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          <Clock className="h-2.5 w-2.5 text-amber-600" />
                          Starts in 3 days
                        </span>
                      </div>
                    </div>

                    {/* Quick action button row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <span className="text-[11px] text-muted-foreground font-medium">84 / 120 seats filled</span>
                      <Link href="/events/1">
                        <Button
                          size="sm"
                          className="h-7.5 px-3.5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm gap-1.5 cursor-pointer hover:scale-102 active:scale-98 transition-all"
                        >
                          <Ticket className="h-3 w-3" />
                          <span>Register</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Mini stat grid with warm cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/clubs">
                      <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-2xl border border-border/70 bg-muted/30 p-3.5 space-y-1.5 hover:border-primary/50 transition-all cursor-pointer group shadow-craft-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Active Clubs</span>
                          <Users className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="text-2xl font-black text-foreground">9+</div>
                        <div className="text-[10px] text-secondary font-bold">Recruiting Now</div>
                      </motion.div>
                    </Link>

                    <Link href="/certificates">
                      <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-2xl border border-border/70 bg-muted/30 p-3.5 space-y-1.5 hover:border-primary/50 transition-all cursor-pointer group shadow-craft-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Certificates</span>
                          <Trophy className="h-3.5 w-3.5 text-secondary" />
                        </div>
                        <div className="text-2xl font-black text-foreground">1,420+</div>
                        <div className="text-[10px] text-primary font-bold">Verified Badges</div>
                      </motion.div>
                    </Link>
                  </div>

                  {/* Notification strip without gradient */}
                  <Link href="/news/1">
                    <motion.div
                      whileHover={{ scale: 1.015 }}
                      className="rounded-xl border border-primary/25 bg-primary/8 p-3 flex items-center gap-2.5 hover:border-primary/40 transition-all cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
                      <p className="text-[11px] font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                        Eureka Pitching &amp; E-Cell launch reports published today!
                      </p>
                    </motion.div>
                  </Link>

                </div>
              </FloatElement>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
