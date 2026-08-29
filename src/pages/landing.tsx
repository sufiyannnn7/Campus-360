import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { GalleryPreview } from "@/components/landing/gallery-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";
import { cn } from "@/lib/utils";
import {
  Calendar, Users, Newspaper, MapPin, LayoutDashboard, LogIn,
  UserPlus, Menu, X, ArrowRight, Ticket, Sparkles, ShieldCheck
} from "lucide-react";

export default function Landing() {
  const { data: user } = useGetMe();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isLinkActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 font-extrabold text-xl text-primary cursor-pointer hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Campus 360 Logo" className="h-9 w-9 object-contain shrink-0 rounded-lg" />
              <span className="tracking-tight text-foreground font-black text-xl">Campus 360</span>
            </div>
          </Link>

          {/* Navigation Links with Active Link Highlighting */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Link href="/events" className={cn(
              "hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/events') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground"
            )}>
              <Calendar className={cn("h-4 w-4", isLinkActive('/events') ? "text-primary" : "")} /> Events
            </Link>

            <Link href="/clubs" className={cn(
              "hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/clubs') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground"
            )}>
              <Users className={cn("h-4 w-4", isLinkActive('/clubs') ? "text-primary" : "")} /> Clubs
            </Link>

            <Link href="/calendar" className={cn(
              "hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/calendar') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground"
            )}>
              <Calendar className={cn("h-4 w-4", isLinkActive('/calendar') ? "text-primary" : "")} /> Calendar
            </Link>

            <Link href="/news" className={cn(
              "hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/news') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground"
            )}>
              <Newspaper className={cn("h-4 w-4", isLinkActive('/news') ? "text-primary" : "")} /> News
            </Link>

            <Link href="/map" className={cn(
              "hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer",
              isLinkActive('/map') ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs" : "text-muted-foreground"
            )}>
              <MapPin className={cn("h-4 w-4", isLinkActive('/map') ? "text-primary" : "")} /> Map
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button className="font-semibold gap-2 shadow-md">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold gap-1.5">
                    <LogIn className="h-4 w-4" /> Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="font-semibold gap-1.5 shadow-md">
                    <UserPlus className="h-4 w-4" /> Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-background p-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
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
            <div className="pt-3 border-t flex flex-col gap-2">
              {user ? (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center font-semibold gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center font-semibold">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center font-semibold">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Homepage View Content */}
      <main className="flex-1 animate-in fade-in-50 duration-200">
        
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Live Statistics Bar */}
        <Stats />

        {/* 3. Feature Overview Shortcuts */}
        <section className="py-16 md:py-24 bg-background border-b">
          <div className="container mx-auto max-w-7xl px-4 space-y-12">
            
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Smart Campus Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Dedicated Modules for Every Feature
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Campus 360 operates as a modern multi-view web application. Access complete dedicated interfaces for events, clubs, calendar, news, and campus navigation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1: Events */}
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Events Directory
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Discover hackathons, cultural nights, sports tournaments, and workshops with instant registration & QR check-ins.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/events">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Events Page</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2: Clubs */}
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 font-bold group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Student Clubs & Societies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Explore official student organizations, view member rosters, track active recruitments and join societies.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/clubs">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Clubs Page</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3: Calendar */}
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Interactive Schedule
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Unified calendar matrix for academic schedules, exams, club meetings, and iCal/Google Calendar exports.
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

              {/* Feature 4: News */}
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold group-hover:scale-110 transition-transform">
                      <Newspaper className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      News & Bulletins
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Stay updated with official university announcements, placement records, student achievements, and circulars.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/news">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open News Page</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 5: Campus Map */}
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 font-bold group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Interactive Campus Map
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Locate event venues, view hall capacities, inspect audio/visual equipment, and get walking directions.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href="/map">
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>Open Campus Map</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 6: Dashboard & Certificates */}
              <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between">
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Verified Credentials
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cryptographically signed achievement badges, QR verifiable certificates, and personalized student dashboard.
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Link href={user ? "/dashboard" : "/login"}>
                      <Button variant="outline" className="w-full justify-between font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <span>{user ? "Go to Dashboard" : "Sign In to Access"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </section>

        {/* 4. Photo Gallery Preview */}
        <GalleryPreview />

        {/* 5. Student Testimonials */}
        <Testimonials />

      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}
