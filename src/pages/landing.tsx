import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";
import { cn } from "@/lib/utils";
import {
  Calendar, Users, Newspaper, MapPin, LayoutDashboard, LogIn,
  UserPlus, Menu, X, ArrowRight, Ticket, Sparkles, ShieldCheck, Flame, Award,
  GraduationCap, UserCheck, Settings, ChevronDown
} from "lucide-react";

export default function Landing() {
  const { data: user } = useGetMe();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const isLinkActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const handleDemoRoleLogin = (role: string) => {
    localStorage.setItem("token", "demo-token-" + role);
    localStorage.setItem("demo_role", role);
    setLocation("/dashboard");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          
          {/* Brand Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 font-extrabold text-xl text-primary cursor-pointer hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Campus 360 Logo" className="h-9 w-9 object-contain shrink-0 rounded-lg shadow-sm" />
              <span className="tracking-tight text-foreground font-black text-xl">Campus 360</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Link href="/events" className={cn(
              "hover:text-primary transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/events') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground hover:bg-muted/50"
            )}>
              <Calendar className={cn("h-4 w-4", isLinkActive('/events') ? "text-primary" : "")} /> Events
            </Link>

            <Link href="/clubs" className={cn(
              "hover:text-primary transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/clubs') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground hover:bg-muted/50"
            )}>
              <Users className={cn("h-4 w-4", isLinkActive('/clubs') ? "text-primary" : "")} /> Clubs
            </Link>

            <Link href="/calendar" className={cn(
              "hover:text-primary transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/calendar') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground hover:bg-muted/50"
            )}>
              <Calendar className={cn("h-4 w-4", isLinkActive('/calendar') ? "text-primary" : "")} /> Calendar
            </Link>

            <Link href="/news" className={cn(
              "hover:text-primary transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/news') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground hover:bg-muted/50"
            )}>
              <Newspaper className={cn("h-4 w-4", isLinkActive('/news') ? "text-primary" : "")} /> News
            </Link>

            <Link href="/map" className={cn(
              "hover:text-primary transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/map') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground hover:bg-muted/50"
            )}>
              <MapPin className={cn("h-4 w-4", isLinkActive('/map') ? "text-primary" : "")} /> Map
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold gap-1.5 hover:bg-primary/10 hover:text-primary transition-all">
                <LogIn className="h-4 w-4" /> Log in
              </Button>
            </Link>
            
            <Link href="/signup">
              <Button className="font-semibold gap-1.5 shadow-md bg-gradient-to-r from-primary to-teal-600 text-white hover:scale-105 transition-all">
                <UserPlus className="h-4 w-4" /> Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation Drawer Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b bg-background p-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className={cn(
              "flex items-center gap-2.5 p-2 font-semibold text-sm rounded-md transition-colors",
              isLinkActive('/events') ? "bg-primary/10 text-primary font-bold" : "hover:text-primary"
            )}>
              <Calendar className="h-4 w-4" /> Events
            </Link>
            <Link href="/clubs" onClick={() => setIsMobileMenuOpen(false)} className={cn(
              "flex items-center gap-2.5 p-2 font-semibold text-sm rounded-md transition-colors",
              isLinkActive('/clubs') ? "bg-primary/10 text-primary font-bold" : "hover:text-primary"
            )}>
              <Users className="h-4 w-4" /> Clubs
            </Link>
            <Link href="/calendar" onClick={() => setIsMobileMenuOpen(false)} className={cn(
              "flex items-center gap-2.5 p-2 font-semibold text-sm rounded-md transition-colors",
              isLinkActive('/calendar') ? "bg-primary/10 text-primary font-bold" : "hover:text-primary"
            )}>
              <Calendar className="h-4 w-4" /> Calendar
            </Link>
            <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className={cn(
              "flex items-center gap-2.5 p-2 font-semibold text-sm rounded-md transition-colors",
              isLinkActive('/news') ? "bg-primary/10 text-primary font-bold" : "hover:text-primary"
            )}>
              <Newspaper className="h-4 w-4" /> News
            </Link>
            <Link href="/map" onClick={() => setIsMobileMenuOpen(false)} className={cn(
              "flex items-center gap-2.5 p-2 font-semibold text-sm rounded-md transition-colors",
              isLinkActive('/map') ? "bg-primary/10 text-primary font-bold" : "hover:text-primary"
            )}>
              <MapPin className="h-4 w-4" /> Campus Map
            </Link>
            <div className="pt-3 border-t space-y-2">
              <div className="text-xs font-bold uppercase text-muted-foreground">Demo Role Sign-In:</div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => handleDemoRoleLogin("student")} className="text-xs font-bold text-indigo-600">Student</Button>
                <Button size="sm" variant="outline" onClick={() => handleDemoRoleLogin("faculty")} className="text-xs font-bold text-teal-600">Faculty</Button>
                <Button size="sm" variant="outline" onClick={() => handleDemoRoleLogin("coordinator")} className="text-xs font-bold text-amber-600">Club Lead</Button>
                <Button size="sm" variant="outline" onClick={() => handleDemoRoleLogin("admin")} className="text-xs font-bold text-rose-600">Admin</Button>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full justify-center font-semibold text-xs">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button className="w-full justify-center font-semibold text-xs">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        
        {/* SCREEN 1: PERFECT FULL-HEIGHT VIEWPORT FOLD (100% SCREEN 1) */}
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between border-b bg-gradient-to-b from-primary/5 via-background to-background relative">
          
          {/* Hero Section centered vertically */}
          <div className="flex-1 flex items-center">
            <Hero />
          </div>

          {/* Live Stats Bar pinned at bottom of Screen 1 fold */}
          <div>
            <Stats />
          </div>

        </div>

        {/* SCREEN 2: SCROLL DOWN TO EXPLORE NKOCET MODULES */}
        <section id="modules" className="py-16 md:py-24 bg-background border-b min-h-screen flex flex-col justify-center">
          <div className="container mx-auto max-w-7xl px-4 space-y-10">
            
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1 rounded-full border border-primary/20 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Dedicated Section Modules</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Explore NKOCET Modules
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Click any dedicated module below or use the top navigation menu to access complete views for events, student societies, live schedules, news bulletins, and venue addresses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Module 1: Events */}
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Events Directory
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Eureka Pitch Slams, E-Cell launches, CSESA hackathons, SAE vehicle showcases, and sports meets with instant registration.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/events">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Events View</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Module 2: Clubs */}
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Student Clubs & Societies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      E-Cell NKOCET, CSESA, GDG, Future Tech, ENGLISH CLUB, Rotaract & Team Avengineers, Pushpak, Ashwamedh SAE teams.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/clubs">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Clubs View</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Module 3: Calendar */}
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Interactive Schedule
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Monthly, weekly, and agenda matrix for academic exams, pitch slams, and calendar exports.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/calendar">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Calendar View</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Module 4: News */}
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold group-hover:scale-110 transition-transform">
                      <Newspaper className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      News & Bulletins
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Eureka Pitching Competition reports, E-Cell inauguration, triple club launches, and placement circulars.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/news">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open News View</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Module 5: Event Address Map */}
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Event Venue Address Locator
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      College Seminar Hall, CSE Computer Center, Main Auditorium, Mechanical Quadrangle, and walking directions.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/map">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Venue Locator</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Module 6: Verified Credentials */}
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Verified Credentials
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cryptographically signed achievement badges, QR verifiable certificates, and role dashboards.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </section>

        {/* 4. Student & Faculty Testimonials */}
        <Testimonials />

      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}
