import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter, Linkedin, Mail, MapPin, Phone, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t text-card-foreground pt-16 pb-12">
      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-extrabold text-xl text-primary">
              <img src="/logo.png" alt="Campus 360 Logo" className="h-9 w-9 object-contain shrink-0 rounded-lg" />
              <span className="font-black tracking-tight text-foreground text-xl">Campus 360</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connecting every corner of campus. The smart campus event, club, interactive map, and student engagement platform.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Campus Events
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="hover:text-primary transition-colors">
                  Student Clubs
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-primary transition-colors">
                  Event Calendar
                </Link>
              </li>
              <li>
                <Link href="/recruitments" className="hover:text-primary transition-colors">
                  Club Recruitments
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary transition-colors">
                  Campus Bulletins
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Modules & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/map" className="hover:text-primary transition-colors">
                  Interactive Campus Map
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-primary transition-colors">
                  Student Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/certificates/verify/SAMPLE" className="hover:text-primary transition-colors">
                  Certificate Verification
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Coordinator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Create Student Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contact & Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Student Affairs, Main Admin Block</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@campushub.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 (080) 4567-8900</span>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                  <ShieldCheck className="h-3.5 w-3.5" /> Systems Operational
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
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
