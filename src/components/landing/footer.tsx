import { Link } from "wouter";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, ShieldCheck, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t text-card-foreground pt-16 pb-10 relative overflow-hidden">
      {/* Warm background orb */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 space-y-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Branding col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-black tracking-tight text-xl text-foreground">Campus 360</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connecting every corner of campus. The smart campus event, club, interactive map, and student engagement platform built for NKOCET.
            </p>

            <div className="flex items-center gap-2.5">
              {[
                { href: "https://github.com", icon: Github, label: "GitHub" },
                { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
                { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-9 w-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/8 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/70">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                ["/events", "Campus Events"],
                ["/clubs", "Student Clubs"],
                ["/calendar", "Event Calendar"],
                ["/recruitments", "Club Recruitments"],
                ["/news", "Campus Bulletins"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors hover:translate-x-0.5 inline-flex items-center gap-1 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/70">Features</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                ["/map", "Interactive Campus Map"],
                ["/leaderboard", "Student Leaderboard"],
                ["/certificates/verify/SAMPLE", "Certificate Verification"],
                ["/login", "Coordinator Dashboard"],
                ["/signup", "Create Student Account"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors group inline-flex items-center gap-1">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/70">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Student Affairs, Main Admin Block</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@campushub.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 (080) 4567-8900</span>
              </li>
              <li className="pt-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                  <ShieldCheck className="h-3.5 w-3.5" /> Systems Operational
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Campus 360. All rights reserved. Connecting every corner of campus.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
