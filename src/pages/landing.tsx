import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";
import { HeadingReveal, ParallaxBackground } from "@/components/ui/scroll-reveal";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Calendar, Users, Newspaper, MapPin, LogIn,
  UserPlus, Menu, X, ArrowRight, Ticket, Sparkles, ShieldCheck,
  CheckCircle2, Clock, Search, Bell, User
} from "lucide-react";
import { useRef } from "react";

// ── Bento Card 1: Events Directory (Flagship Hub — Deep Plum Accent Card) ──
function EventsBentoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-1 lg:col-span-2 h-full"
    >
      <div className="relative rounded-[2rem] rounded-tl-md border-2 border-[#6B3A52]/50 dark:border-[#4E2A3C]/40 bg-gradient-to-br from-[#FDFBF8] to-[#f2d8e3] dark:from-[#2A1C24] dark:to-[#1E1218] p-6 sm:p-7 shadow-craft hover:shadow-craft-lg transition-all duration-300 group h-full flex flex-col justify-between overflow-hidden">
        {/* Corner ticket notch */}
        <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-background border border-border/70 pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl border border-[#6B3A52]/30 bg-[#6B3A52]/15 text-[#6B3A52] dark:text-[#C59DB1] group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-craft-sm">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B3A52] dark:text-[#C59DB1]">Flagship Hub</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#2B1420] dark:text-[#f2d8e3] group-hover:text-[#6B3A52] transition-colors">
                  Events Directory &amp; Competitions
                </h3>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Live Registrations
            </span>
          </div>

          <p className="text-sm text-[#4E2A3C] dark:text-[#B58EA1] leading-relaxed max-w-xl">
            Eureka Pitch Slams, E-Cell launches, CSESA hackathons, SAE vehicle showcases, and sports meets with instant one-click registration and automated calendar reminders.
          </p>

          {/* Category badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {["🔥 Eureka Pitch Slam", "💻 CSESA Hackathon", "🏎️ Team Avengineers", "🏆 Sports Matrix", "⚡ Tech Expos"].map((badge) => (
              <span key={badge} className="text-xs font-bold px-3 py-1 rounded-lg border border-[#6B3A52]/20 bg-[#6B3A52]/10 text-[#4E2A3C] dark:text-[#E8D6DF]">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-5 mt-4 border-t border-[#6B3A52]/25 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4E2A3C] dark:text-[#B58EA1]">
            <Clock className="h-3.5 w-3.5 text-[#6B3A52] dark:text-[#C59DB1]" />
            <span>Updated hourly • 54+ Active Competitions</span>
          </div>
          <Link href="/events">
            <Button
              className="font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-[#4E2A3C] bg-[#4E2A3C] text-white hover:bg-[#6B3A52] shadow-craft-sm transition-all duration-200 gap-2 cursor-pointer"
            >
              <span>Explore Events Directory</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bento Card 2: Student Clubs & Societies (Pale Warm Ochre / Honey Wash) ──
function ClubsBentoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-1 lg:col-span-1 h-full"
    >
      <div className="relative rounded-[2rem] rounded-tr-md border-2 border-[#D4A76A]/45 dark:border-[#B58A4E]/40 bg-gradient-to-br from-[#FDF6E8] to-[#F5EAD2] dark:from-[#251E13] dark:to-[#1B150C] p-6 shadow-craft hover:shadow-craft-lg transition-all duration-300 group h-full flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-background border border-border/70 pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#B58A4E]/35 bg-[#B58A4E]/15 text-[#7A5524] dark:text-[#E8C896] group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-craft-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8C6028] dark:text-[#D4A76A]">Campus Community</span>
              <h3 className="text-lg font-black text-[#2E1F14] dark:text-[#F8EFE4] group-hover:text-[#8C6028] transition-colors">
                Student Clubs &amp; Societies
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#6A5240] dark:text-[#C5B3A2] leading-relaxed">
            E-Cell NKOCET, CSESA, GDG, Future Tech, English Club, Rotaract &amp; Team Avengineers SAE teams.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {["E-Cell", "CSESA", "GDG", "Avengineers", "Rotaract"].map((club) => (
              <span key={club} className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-[#B58A4E]/30 bg-[#B58A4E]/15 text-[#68461B] dark:text-[#E0C092]">
                {club}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-[#B58A4E]/20">
          <Link href="/clubs">
            <Button
              className="w-full justify-between font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#B58A4E]/40 bg-[#B58A4E]/15 text-[#68461B] dark:text-[#E8C896] hover:bg-[#8C6028] hover:text-white shadow-craft-sm transition-all duration-200 cursor-pointer"
            >
              <span>Explore 9+ Clubs</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bento Card 3: Interactive Schedule (Light Warm Amber / Gold Wash) ──
function ScheduleBentoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-1 lg:col-span-1 h-full"
    >
      <div className="relative rounded-[2rem] rounded-bl-md border-2 border-[#D9A05B]/50 dark:border-[#B88645]/40 bg-gradient-to-br from-[#FDF8EB] to-[#F5EAD2] dark:from-[#241E15] dark:to-[#1B160C] p-6 shadow-craft hover:shadow-craft-lg transition-all duration-300 group h-full flex flex-col justify-between overflow-hidden">
        <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-background border border-border/70 pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#C48C3D]/35 bg-[#C48C3D]/15 text-[#8A5A19] dark:text-[#E2B77A] group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-craft-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8A5A19] dark:text-[#C48C3D]">Matrix View</span>
              <h3 className="text-lg font-black text-[#4A2E08] dark:text-[#F9F3E8] group-hover:text-[#8A5A19] transition-colors">
                Interactive Schedule
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#7A572B] dark:text-[#D4B692] leading-relaxed">
            Monthly, weekly, and agenda matrix for academic exams, pitch slams, and calendar exports.
          </p>

          <div className="space-y-1.5 pt-1">
            {[
              { date: "Aug 22", title: "Eureka Pitch Slam" },
              { date: "Sep 04", title: "CSESA Code Sprint" },
            ].map((item) => (
              <div key={item.date} className="flex items-center gap-2 text-xs font-semibold text-[#5A3B11] dark:text-[#EAD0AB] bg-[#C48C3D]/12 px-2.5 py-1.5 rounded-lg border border-[#D9A05B]/35">
                <span className="font-bold text-[#8A5A19] dark:text-[#D9A05B]">{item.date}</span>
                <span className="truncate">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-[#D9A05B]/25">
          <Link href="/calendar">
            <Button
              className="w-full justify-between font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#C48C3D]/40 bg-[#C48C3D]/15 text-[#8A5A19] dark:text-[#EAD0AB] hover:bg-[#8A5A19] hover:text-white shadow-craft-sm transition-all duration-200 cursor-pointer"
            >
              <span>Open Calendar View</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bento Card 4: News & Bulletins (Light Terracotta / Clay Wash) ──
function NewsBentoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-1 lg:col-span-1 h-full"
    >
      <div className="relative rounded-[2rem] border-2 border-[#D38B6B]/50 dark:border-[#A96245]/40 bg-gradient-to-br from-[#FCF3EE] to-[#F4E1D8] dark:from-[#241A16] dark:to-[#1A110E] p-6 shadow-craft hover:shadow-craft-lg transition-all duration-300 group h-full flex flex-col justify-between overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#B8623B]/35 bg-[#B8623B]/15 text-[#82391C] dark:text-[#E5A88E] group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-craft-sm">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#82391C] dark:text-[#CD7A55]">Official Press</span>
              <h3 className="text-lg font-black text-[#471C0B] dark:text-[#F9ECE7] group-hover:text-[#82391C] transition-colors">
                News &amp; Bulletins
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#7A4027] dark:text-[#D8A794] leading-relaxed">
            Eureka Pitching Competition reports, E-Cell inauguration, triple club launches, and placement circulars.
          </p>

          <div className="rounded-xl border border-[#D38B6B]/40 bg-[#B8623B]/10 p-3 text-xs font-semibold text-[#6A2912] dark:text-[#F0C9BA] space-y-1">
            <div className="text-[10px] font-bold text-[#82391C] dark:text-[#CD7A55] uppercase tracking-wider">Latest Bulletin</div>
            <p className="line-clamp-1 font-bold">E-Cell NKOCET Announces 2026 Eureka Pitch Slam Teams</p>
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-[#D38B6B]/25">
          <Link href="/news">
            <Button
              className="w-full justify-between font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#B8623B]/40 bg-[#B8623B]/15 text-[#82391C] dark:text-[#F0C9BA] hover:bg-[#82391C] hover:text-white shadow-craft-sm transition-all duration-200 cursor-pointer"
            >
              <span>Read News Bulletins</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bento Card 5: Event Venue Locator (Light Muted Mustard / Ochre Wash) ──
function VenueBentoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-1 lg:col-span-1 h-full"
    >
      <div className="relative rounded-[2rem] border-2 border-[#D1B054]/50 dark:border-[#A38634]/40 bg-gradient-to-br from-[#FCF9EF] to-[#F3EAC6] dark:from-[#211E13] dark:to-[#17150C] p-6 shadow-craft hover:shadow-craft-lg transition-all duration-300 group h-full flex flex-col justify-between overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#B39335]/35 bg-[#B39335]/15 text-[#7A6117] dark:text-[#DECA85] group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-craft-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#7A6117] dark:text-[#C4A94D]">Campus Guide</span>
              <h3 className="text-lg font-black text-[#3D3008] dark:text-[#F8F5E6] group-hover:text-[#7A6117] transition-colors">
                Event Venue Locator
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#6E591B] dark:text-[#CFC088] leading-relaxed">
            College Seminar Hall, CSE Computer Center, Main Auditorium, Mechanical Quadrangle, and walking directions.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Seminar Hall", "CSE Lab 3", "Auditorium", "Mech Quad"].map((venue) => (
              <span key={venue} className="text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#B39335]/30 bg-[#B39335]/12 text-[#7A6117] dark:text-[#E3D4A1]">
                📍 {venue}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-[#D1B054]/25">
          <Link href="/map">
            <Button
              className="w-full justify-between font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#B39335]/40 bg-[#B39335]/15 text-[#7A6117] dark:text-[#E3D4A1] hover:bg-[#7A6117] hover:text-white shadow-craft-sm transition-all duration-200 cursor-pointer"
            >
              <span>Open Venue Locator</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bento Card 6: Verified Credentials (Deeper Warm Amber / Burnt Orange Wash) ──
function CredentialsBentoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-1 md:col-span-2 lg:col-span-3 h-full"
    >
      <div className="relative rounded-[2rem] rounded-br-md border-2 border-[#C97241]/50 dark:border-[#9E5128]/40 bg-gradient-to-br from-[#FDF1E9] to-[#F3D7C5] dark:from-[#26160E] dark:to-[#1A0E08] p-6 sm:p-8 shadow-craft hover:shadow-craft-lg transition-all duration-300 group overflow-hidden">
        <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-background border border-border/70 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#AD5222]/30 bg-[#AD5222]/15 text-[#82340E] dark:text-[#E69F7A] group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-craft-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#82340E] dark:text-[#C97241]">Digital Credentials &amp; Roles</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#4A1A04] dark:text-[#FCEAE1] group-hover:text-[#82340E] transition-colors">
                  Verified Certificates &amp; Campus Dashboard
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#703517] dark:text-[#D8A78A] leading-relaxed">
              Cryptographically signed achievement badges, QR verifiable certificates, and role dashboards for students, club leaders, and faculty coordinators.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-lg border border-[#AD5222]/25 bg-[#AD5222]/10 text-[#6B2808] dark:text-[#C97241] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% QR Code Verifiable
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-lg border border-[#AD5222]/25 bg-[#AD5222]/10 text-[#6B2808] dark:text-[#C97241]">
                SHA-256 Cryptographic Signature
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-lg border border-[#AD5222]/25 bg-[#AD5222]/10 text-[#6B2808] dark:text-[#C97241]">
                4 Role-Based Portals
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl border border-[#AD5222]/40 bg-[#AD5222] text-white hover:bg-[#82340E] shadow-craft hover:scale-102 active:scale-98 transition-all gap-2 cursor-pointer"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const { data: user } = useGetMe();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const isLinkActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("club")) setLocation("/clubs");
    else if (q.includes("sched") || q.includes("cal")) setLocation("/calendar");
    else if (q.includes("news") || q.includes("bulletin")) setLocation("/news");
    else if (q.includes("map") || q.includes("venue")) setLocation("/map");
    else setLocation("/events");
  };

  const handleDemoRoleLogin = (role: string) => {
    localStorage.setItem("token", "demo-token-" + role);
    localStorage.setItem("demo_role", role);
    setLocation("/dashboard");
    window.location.reload();
  };

  const navLinks = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/clubs", label: "Clubs", icon: Users },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/map", label: "Map", icon: MapPin },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">

      {/* ── Sticky Header with Distinct Dark Roasted Mocha Color ── */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-primary/20 bg-[#231710]/95 backdrop-blur-xl shadow-craft text-[#FAF6F0]"
      >
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 gap-2 lg:gap-4">

          {/* Brand */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group shrink-0">
              <motion.img
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="/logo.png"
                alt="Campus 360 Logo"
                className="h-8 w-8 object-contain rounded-lg"
              />
              <span className="font-black text-lg tracking-tight text-[#FAF6F0] group-hover:text-amber-200 transition-colors">Campus 360</span>
            </div>
          </Link>

          {/* Search bar in top nav */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-[#D5C6BA]/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events, clubs, students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-44 2xl:w-56 rounded-xl bg-white/10 border border-primary/30 pl-8.5 pr-3 text-xs text-[#FAF6F0] placeholder:text-[#A89486] focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
            />
          </form>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all",
                  isLinkActive(href)
                    ? "bg-primary/30 text-amber-100 font-bold border border-primary/45 shadow-inner"
                    : "text-[#D5C6BA] hover:text-[#FFFFFF] hover:bg-white/10"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions: Notifications + Profile Avatar + Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Notification bell with unread dot & dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#FAF6F0] hover:bg-white/10 rounded-xl h-9 w-9 cursor-pointer"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Campus Notifications"
              >
                <Bell className="h-4 w-4 text-[#FAF6F0]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#231710] animate-pulse" />
                )}
              </Button>

              {/* Notification dropdown popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-primary/30 bg-[#231710] text-[#FAF6F0] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-primary/20">
                    <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">Campus Bulletins</span>
                    <span className="text-[10px] text-amber-200/70">{unreadCount} unread</span>
                  </div>
                  <div className="py-2 space-y-1.5">
                    <Link href="/news/1" onClick={() => { setIsNotifOpen(false); setUnreadCount(0); }}>
                      <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-400">🔥 Live Bulletin</span>
                          <span className="text-[9px] text-[#A8988C]">Today</span>
                        </div>
                        <p className="text-xs font-semibold text-amber-50 leading-snug line-clamp-2">
                          Eureka Pitching &amp; E-Cell launch reports published today!
                        </p>
                      </div>
                    </Link>
                    <Link href="/clubs" onClick={() => setIsNotifOpen(false)}>
                      <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-300">👥 Recruitment Open</span>
                          <span className="text-[9px] text-[#A8988C]">2h ago</span>
                        </div>
                        <p className="text-xs font-semibold text-amber-50 leading-snug line-clamp-2">
                          CSESA, GDG &amp; SAE Teams open candidate registrations.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="pt-2 border-t border-primary/20 text-center">
                    <Link href="/news" onClick={() => setIsNotifOpen(false)} className="text-[11px] font-bold text-amber-300 hover:text-white transition-colors">
                      View All Bulletins →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Avatar element indicating logged-in student dashboard state */}
            <Link href="/dashboard">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-white/8 hover:bg-white/15 border border-primary/25 transition-all cursor-pointer group">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#C05D38] to-[#E58D67] flex items-center justify-center text-xs font-black text-white shadow-sm">
                  AS
                </div>
                <div className="text-left leading-none">
                  <div className="text-xs font-bold text-[#FAF6F0] group-hover:text-amber-200 transition-colors">Aarav S.</div>
                  <div className="text-[9px] text-amber-200/80 font-medium mt-0.5">Student • NKOCET</div>
                </div>
              </div>
            </Link>

            <Link href="/login">
              <Button variant="ghost" className="font-semibold gap-1.5 text-xs text-[#D5C6BA] hover:text-[#FFFFFF] hover:bg-white/10 rounded-xl transition-all h-9 px-3">
                <LogIn className="h-3.5 w-3.5" /> Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="font-bold gap-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-craft-sm hover:scale-102 active:scale-98 transition-all rounded-xl border border-primary-border h-9 px-3">
                <UserPlus className="h-3.5 w-3.5" /> Portal
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#FAF6F0] hover:bg-white/10 h-9 w-9"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Toggle Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#FAF6F0] hover:bg-white/10 h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-b border-primary/20 bg-[#231710] text-amber-50 p-4 space-y-3"
          >
            {/* Mobile search bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-amber-200/60" />
              <input
                type="text"
                placeholder="Search events, clubs, students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-xl bg-white/10 border border-primary/30 pl-8.5 pr-3 text-xs text-[#FAF6F0] placeholder:text-[#A89486] focus:outline-none focus:border-primary"
              />
            </form>

            {/* Mobile Profile Card */}
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/8 border border-primary/25 cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#C05D38] to-[#E58D67] flex items-center justify-center text-xs font-black text-white">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FAF6F0]">Aarav S.</div>
                  <div className="text-[10px] text-amber-200/80">Student Portal • NKOCET</div>
                </div>
              </div>
            </Link>

            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 p-2 font-semibold text-sm rounded-lg transition-colors",
                  isLinkActive(href) ? "bg-primary/30 text-amber-200" : "text-[#D5C6BA] hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-primary/20 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70 px-2">Quick Demo</div>
              <div className="grid grid-cols-2 gap-2">
                {["student", "faculty", "coordinator", "admin"].map((role) => (
                  <Button
                    key={role}
                    size="sm"
                    variant="outline"
                    onClick={() => handleDemoRoleLogin(role)}
                    className="text-xs font-bold capitalize bg-[#2D1F18] border-primary/30 text-amber-100 hover:bg-primary/20"
                  >
                    {role === "coordinator" ? "Club Lead" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-primary/20">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full text-xs font-semibold bg-[#2D1F18] border-primary/30 text-amber-100">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button className="w-full text-xs font-semibold bg-primary text-primary-foreground">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main className="flex-1">

        {/* ── Screen 1: Hero + Stats ── */}
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between border-b bg-gradient-to-b from-primary/6 via-background/80 to-background relative">
          {/* Subtle warm grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--primary)), hsl(var(--primary)) 1px, transparent 1px, transparent 60px),
                                repeating-linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)) 1px, transparent 1px, transparent 60px)`,
            }}
          />
          <div className="flex-1 flex items-center">
            <Hero />
          </div>
          <div className="pb-3 sm:pb-5">
            <Stats />
          </div>
        </div>

        {/* ── Screen 2: NKOCET Bento Grid Modules ── */}
        <section
          id="modules"
          className="py-20 md:py-28 bg-muted/20 border-b min-h-screen flex flex-col justify-center relative overflow-hidden"
        >
          <ParallaxBackground speed={0.2}>
            <div className="absolute top-16 left-1/3 w-[520px] h-[520px] bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute bottom-16 right-8 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-3xl" />
          </ParallaxBackground>

          <div className="container mx-auto max-w-7xl px-4 space-y-14 relative z-10">

            <HeadingReveal
              badge="Dedicated Section Modules"
              badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
              title="Explore NKOCET Modules"
              subtitle="Click any dedicated module below or use the top navigation menu to access complete views for events, student societies, live schedules, news bulletins, and venue addresses."
              centered
            />

            {/* Asymmetrical Bento Grid with varied sizes and shapes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <EventsBentoCard />
              <ClubsBentoCard />
              <ScheduleBentoCard />
              <NewsBentoCard />
              <VenueBentoCard />
              <CredentialsBentoCard />
            </div>

          </div>
        </section>

        {/* ── Testimonials ── */}
        <Testimonials />

      </main>

      <Footer />
    </div>
  );
}
