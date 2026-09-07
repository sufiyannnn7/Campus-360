import { useState } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { LANDING_STATS } from "@/data/landing-data";
import { Calendar, Users, GraduationCap, Award, ArrowUpRight, Zap } from "lucide-react";

// ── Card 1: Events Scheduled (Warm Pale Amber / Terracotta Wash) ──
function EventsStatCard({ stat }: { stat: typeof LANDING_STATS[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Link href={stat.href || "/events"}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
        className="relative rounded-2xl border border-[#E5A885]/45 dark:border-[#C05D38]/30 bg-gradient-to-br from-[#FDF3E7] to-[#F9E5D2] dark:from-[#2A1B14] dark:to-[#1F120B] p-4.5 sm:p-5 shadow-[0_4px_20px_-2px_rgba(192,93,56,0.08)] hover:shadow-[0_8px_24px_-2px_rgba(192,93,56,0.16)] hover:border-[#C05D38]/60 transition-colors duration-300 group cursor-pointer h-full flex flex-col justify-between overflow-hidden"
      >
        <div>
          {/* Top header row: sentence case + solid terracotta badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-[#6A4736] dark:text-[#E8D5C8] leading-snug">
              Events scheduled
            </span>

            {/* Solid-fill terracotta badge with smooth subtle motion */}
            <motion.div
              animate={isHovered ? { rotate: [0, -5, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl bg-[#C05D38] text-[#FFFDF9] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(192,93,56,0.25)]"
            >
              <Calendar className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </motion.div>
          </div>

          {/* Designed stat number with warm espresso tint & terracotta suffix */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2E160C] dark:text-[#F8ECE3]">
              54<span className="text-[#C05D38] font-bold text-xl sm:text-2xl ml-0.5">+</span>
            </span>
            <span className="text-[11px] font-bold text-[#8C4624] bg-[#C05D38]/12 px-2 py-0.5 rounded-full border border-[#C05D38]/22">
              +18% this month
            </span>
          </div>

          <p className="text-xs text-[#7A5B4C] dark:text-[#BFAFA3] font-medium mt-1.5 leading-snug line-clamp-2">
            {stat.description}
          </p>
        </div>

        {/* Subtle, smooth ticker reveal on hover */}
        <div className="mt-3.5 pt-2.5 border-t border-[#C05D38]/15 dark:border-[#D9825B]/20">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="hovered"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-between text-[11px] font-bold text-[#8C4624] dark:text-[#E89E7A] bg-[#C05D38]/12 px-2.5 py-1 rounded-lg border border-[#C05D38]/20"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Zap className="h-3 w-3 text-[#C05D38] shrink-0" />
                  <span>Eureka Pitch Slam (Aug 22)</span>
                </span>
                <ArrowUpRight className="h-3 w-3 shrink-0" />
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between text-[11px] font-medium text-[#7A5B4C] dark:text-[#A8988C]"
              >
                <span>Pitch slams &amp; expos</span>
                <span className="text-[#8C4624] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">View →</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Card 2: Active Campus Clubs (Pale Sage / Moss Tinted Wash) ──
function ClubsStatCard({ stat }: { stat: typeof LANDING_STATS[1] }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const clubBadges = ["E-Cell", "CSESA", "GDG", "SAE"];

  return (
    <Link href={stat.href || "/clubs"}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
        className="relative rounded-2xl border border-[#9CB895]/50 dark:border-[#616B4D]/35 bg-gradient-to-br from-[#EFF5EB] to-[#E2EDE0] dark:from-[#1A2318] dark:to-[#121A10] p-4.5 sm:p-5 shadow-[0_4px_20px_-2px_rgba(97,107,77,0.08)] hover:shadow-[0_8px_24px_-2px_rgba(97,107,77,0.16)] hover:border-[#616B4D]/60 transition-colors duration-300 group cursor-pointer h-full flex flex-col justify-between overflow-hidden"
      >
        <div>
          {/* Top header row: sentence case + solid olive/moss green badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-[#3F5036] dark:text-[#C8D7C2] leading-snug">
              Active campus clubs
            </span>

            {/* Solid moss badge with smooth subtle scale */}
            <motion.div
              animate={isHovered ? { scale: 1.06 } : { scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl bg-[#5A6B4A] text-[#FFFDF9] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(90,107,74,0.25)]"
            >
              <Users className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </motion.div>
          </div>

          {/* Designed stat number */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2C18] dark:text-[#EDF5EA]">
              9<span className="text-[#5A6B4A] font-bold text-xl sm:text-2xl ml-0.5">+</span>
            </span>
            <span className="text-[11px] font-bold text-[#3F5036] bg-[#5A6B4A]/12 px-2 py-0.5 rounded-full border border-[#5A6B4A]/22">
              Recruiting
            </span>
          </div>

          <p className="text-xs text-[#516347] dark:text-[#AEBEA4] font-medium mt-1.5 leading-snug line-clamp-2">
            {stat.description}
          </p>
        </div>

        {/* Fanning club badges on hover with smooth spacing */}
        <div className="mt-3.5 pt-2.5 border-t border-[#5A6B4A]/15 dark:border-[#616B4D]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-0.5">
              {clubBadges.map((name, i) => (
                <motion.span
                  key={name}
                  animate={isHovered ? { x: i * 2 } : { x: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="inline-flex items-center justify-center text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#5A6B4A]/30 bg-[#5A6B4A]/12 text-[#3F5036] dark:text-[#D5DECA]"
                >
                  {name}
                </motion.span>
              ))}
            </div>
            <span className="text-[11px] font-semibold text-[#425339] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Join →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Card 3: Registered Students (Pale Warm Taupe / Sienna Wash) ──
function StudentsStatCard({ stat }: { stat: typeof LANDING_STATS[2] }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Link href={stat.href || "/dashboard"}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
        className="relative rounded-2xl border border-[#C4A999]/50 dark:border-[#7D4E35]/35 bg-gradient-to-br from-[#F7EFE9] to-[#ECDFD5] dark:from-[#251A15] dark:to-[#1B110B] p-4.5 sm:p-5 shadow-[0_4px_20px_-2px_rgba(125,78,53,0.08)] hover:shadow-[0_8px_24px_-2px_rgba(125,78,53,0.16)] hover:border-[#7D4E35]/60 transition-colors duration-300 group cursor-pointer h-full flex flex-col justify-between overflow-hidden"
      >
        <div>
          {/* Top header row: sentence case + solid mocha badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-[#5D4032] dark:text-[#DDD0C7] leading-snug">
              Registered students
            </span>

            {/* Solid mocha brown badge with smooth subtle lift */}
            <motion.div
              animate={isHovered ? { y: -3 } : { y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl bg-[#7D4E35] text-[#FFFDF9] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(125,78,53,0.25)]"
            >
              <GraduationCap className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </motion.div>
          </div>

          {/* Designed stat number */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2B1A12] dark:text-[#F7EFE9]">
              4,850<span className="text-[#7D4E35] font-bold text-xl sm:text-2xl ml-0.5">+</span>
            </span>
            <span className="text-[11px] font-bold text-[#5D4032] bg-[#7D4E35]/12 px-2 py-0.5 rounded-full border border-[#7D4E35]/22 whitespace-nowrap">
              Active
            </span>
          </div>

          <p className="text-xs text-[#745849] dark:text-[#BDB0A7] font-medium mt-1.5 leading-snug line-clamp-2">
            {stat.description}
          </p>
        </div>

        {/* Smooth activity gauge on hover */}
        <div className="mt-3.5 pt-2.5 border-t border-[#7D4E35]/15 dark:border-[#7D4E35]/20 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#6A4E3F] dark:text-[#A8988C]">
            <span>Engagement rate</span>
            <span className="text-[#7D4E35] font-bold">96% active</span>
          </div>
          <div className="h-1.5 w-full bg-[#7D4E35]/15 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "75%" }}
              animate={isHovered ? { width: "96%" } : { width: "75%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-full bg-[#7D4E35] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Card 4: Certificates Issued (HERO STAT CARD — Pale Peach / Terracotta Wash) ──
function CertificatesStatCard({ stat }: { stat: typeof LANDING_STATS[3] }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Link href={stat.href || "/certificates"}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
        className="relative rounded-2xl border-2 border-[#D9825B]/45 dark:border-[#D9825B]/40 bg-gradient-to-br from-[#FDF0E6] via-[#F8E2D2] to-[#F2D4C0] dark:from-[#301C12] dark:via-[#25140A] dark:to-[#1A0D05] p-5 sm:p-5.5 shadow-[0_4px_24px_-2px_rgba(190,110,60,0.12)] hover:shadow-[0_10px_32px_-2px_rgba(190,110,60,0.22)] hover:border-[#B85D38]/75 transition-colors duration-300 group cursor-pointer h-full flex flex-col justify-between overflow-hidden"
      >
        {/* ── Signature Micro-Detail: Campus collegiate seal watermark (ONLY on this hero card) ── */}
        <svg
          className="absolute -right-6 -bottom-6 w-36 h-36 text-[#984622] opacity-[0.07] dark:opacity-[0.14] pointer-events-none select-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="60" r="32" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
          <path d="M60 6 L60 114 M6 60 L114 60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
          <polygon points="60,20 65,45 90,50 65,55 60,80 55,55 30,50 55,45" fill="currentColor" opacity="0.4" />
        </svg>

        <div className="relative z-10">
          {/* Top header row: Hero title with verification tag + solid deep terracotta wax seal stamp */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#7A361A] dark:text-[#F3A984]">
                Certificates issued
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#255C3E] bg-[#255C3E]/12 px-2 py-0.5 rounded-full border border-[#255C3E]/25">
                ✓ QR Valid
              </span>
            </div>

            {/* Solid wax seal stamp with smooth subtle tilt */}
            <motion.div
              animate={isHovered ? { rotate: 20, scale: 1.06 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-9 w-9 sm:h-9.5 sm:w-9.5 rounded-2xl bg-[#984622] text-[#FFFDF9] flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(152,70,34,0.3)] border border-[#984622]/30"
            >
              <Award className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </motion.div>
          </div>

          {/* Designed Hero stat number with warm terracotta-espresso tone */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-[2.65rem] font-black tracking-tight text-[#4F1E0B] dark:text-[#FBE8DE] leading-tight">
              1,420<span className="text-[#984622] font-bold text-2xl sm:text-3xl ml-0.5">+</span>
            </span>
            <span className="text-[11px] font-bold text-[#255C3E] bg-[#255C3E]/12 px-2 py-0.5 rounded-full border border-[#255C3E]/25">
              100% Verifiable
            </span>
          </div>

          <p className="text-xs text-[#6A4330] dark:text-[#CBB5A7] font-medium mt-1.5 leading-snug">
            {stat.description}
          </p>
        </div>

        {/* Cryptographic verification moment on hover (smooth 0.25s) */}
        <div className="relative z-10 mt-3.5 pt-2.5 border-t border-[#D9825B]/25 dark:border-[#D9825B]/30">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="hovered"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-between text-[11px] font-bold text-[#255C3E] bg-[#255C3E]/12 px-2.5 py-1 rounded-lg border border-[#255C3E]/28"
              >
                <span>✓ SHA-256 Validated</span>
                <span className="text-[10px] font-mono">Verify →</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between text-[11px] font-medium text-[#7A4B35] dark:text-[#B59F90]"
              >
                <span>Cryptographically signed credentials</span>
                <span className="text-[#984622] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">Verify →</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Link>
  );
}

export function Stats() {
  return (
    <section className="py-4 sm:py-5 border-b border-border/40">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Asymmetrical rhythm: 3 quieter cards (1fr each) + 1 wider Hero card (1.32fr) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.32fr] gap-3.5 sm:gap-4 items-stretch">
          <div>
            <EventsStatCard stat={LANDING_STATS[0]} />
          </div>
          <div>
            <ClubsStatCard stat={LANDING_STATS[1]} />
          </div>
          <div>
            <StudentsStatCard stat={LANDING_STATS[2]} />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <CertificatesStatCard stat={LANDING_STATS[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

