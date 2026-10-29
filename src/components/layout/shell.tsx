/**
 * AppShell Layout Component
 * 
 * Modular layout orchestrator for both public and authenticated views.
 */

import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Calendar,
  LayoutDashboard,
  Ticket,
  Users,
  FileText,
  Trophy,
  Medal,
  Newspaper,
  Bell,
  Search,
  Menu,
  MapPin,
  X,
  LogIn,
  UserPlus,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIAssistant } from "@/components/ai-assistant";
import { useAuth } from "@/context/auth-context";
import { useGetMe } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarLink } from "./sidebar-link";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  const { data: meUser } = useGetMe();
  const user = authUser || meUser;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isLinkActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  // 1. Public Layout when unauthenticated
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-2xs">
          <div className="container mx-auto max-w-7xl flex h-14 items-center justify-between px-4">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 font-extrabold text-lg text-primary cursor-pointer hover:scale-105 transition-transform">
                <img src="/logo.png" alt="Campus 360 Logo" className="h-9 w-9 object-contain shrink-0 rounded-lg" />
                <span className="tracking-tight text-foreground font-black text-lg">Campus 360</span>
              </div>
            </Link>

            {/* Public Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <Link
                href="/events"
                className={cn(
                  "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                  isLinkActive("/events")
                    ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Calendar className="h-3.5 w-3.5" /> Events
              </Link>

              <Link
                href="/clubs"
                className={cn(
                  "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                  isLinkActive("/clubs")
                    ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Users className="h-3.5 w-3.5" /> Clubs
              </Link>

              <Link
                href="/calendar"
                className={cn(
                  "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                  isLinkActive("/calendar")
                    ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Calendar className="h-3.5 w-3.5" /> Calendar
              </Link>

              <Link
                href="/news"
                className={cn(
                  "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                  isLinkActive("/news")
                    ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Newspaper className="h-3.5 w-3.5" /> News
              </Link>

              <Link
                href="/map"
                className={cn(
                  "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                  isLinkActive("/map")
                    ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <MapPin className="h-3.5 w-3.5" /> Map
              </Link>
            </nav>

            {/* Auth CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant={isLinkActive("/login") ? "default" : "ghost"} size="sm" className="font-semibold text-xs h-8 gap-1.5">
                  <LogIn className="h-3.5 w-3.5" /> Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="font-semibold text-xs h-8 gap-1.5 shadow-sm">
                  <UserPlus className="h-3.5 w-3.5" /> Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-b bg-background p-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
              <Link
                href="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                  isLinkActive("/events") ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
                )}
              >
                <Calendar className="h-4 w-4" /> Events
              </Link>
              <Link
                href="/clubs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                  isLinkActive("/clubs") ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
                )}
              >
                <Users className="h-4 w-4" /> Clubs
              </Link>
              <Link
                href="/calendar"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                  isLinkActive("/calendar") ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
                )}
              >
                <Calendar className="h-4 w-4" /> Calendar
              </Link>
              <Link
                href="/news"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                  isLinkActive("/news") ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
                )}
              >
                <Newspaper className="h-4 w-4" /> News
              </Link>
              <Link
                href="/map"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                  isLinkActive("/map") ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
                )}
              >
                <MapPin className="h-4 w-4" /> Campus Map
              </Link>
              <div className="pt-2 border-t flex flex-col gap-1.5">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-center font-semibold text-xs h-8">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-center font-semibold text-xs h-8">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Public Main Container */}
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-6 animate-in fade-in-50 duration-200">
          {children}
        </main>

        <AIAssistant />
      </div>
    );
  }

  // 2. Authenticated Layout
  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-base text-primary">
          <img src="/logo.png" alt="Campus 360 Logo" className="h-7 w-7 object-contain shrink-0 rounded-lg" />
          <span className="font-extrabold text-base tracking-tight text-foreground">Campus 360</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:static md:flex md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold text-lg text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src="/logo.png" alt="Campus 360 Logo" className="h-8 w-8 object-contain shrink-0 rounded-lg" />
            <span className="font-extrabold text-base tracking-tight text-foreground">Campus 360</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-3">
          <nav className="grid gap-1 px-4 text-xs font-medium">
            <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/events" icon={Ticket} label="Events" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/calendar" icon={Calendar} label="Calendar" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/map" icon={MapPin} label="Campus Map" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/clubs" icon={Users} label="Clubs" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/recruitments" icon={FileText} label="Recruitments" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/news" icon={Newspaper} label="News" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/leaderboard" icon={Trophy} label="Leaderboard" onClick={() => setIsMobileMenuOpen(false)} />

            <div className="my-3 border-t border-sidebar-border/50" />
            <div className="px-2 mb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Me</div>
            <SidebarLink href="/profile" icon={Users} label="Profile" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/certificates" icon={Medal} label="Certificates" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/notifications" icon={Bell} label="Notifications" onClick={() => setIsMobileMenuOpen(false)} />

            {user?.role === "admin" && (
              <>
                <div className="my-3 border-t border-sidebar-border/50" />
                <div className="px-2 mb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Administration</div>
                <SidebarLink href="/admin" icon={ShieldCheck} label="Admin Console" onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}

            {(user?.role === "coordinator" || user?.role === "admin") && (
              <>
                <div className="my-3 border-t border-sidebar-border/50" />
                <div className="px-2 mb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Management</div>
                <SidebarLink href="/coordinator/dashboard" icon={Building2} label="Coordinator Hub" onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}
          </nav>
        </div>

        <div className="border-t border-sidebar-border/50 p-3">
          <UserMenu user={user} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto animate-in fade-in-50 duration-200">
        <div className="hidden h-14 w-full items-center justify-end border-b bg-background px-6 md:flex gap-3">
          {!location.startsWith("/search") && (
            <Link
              href="/search"
              className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 hover:bg-muted px-3 py-1.5 rounded-lg transition-colors w-60 border"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search anything...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-background px-1 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
                ⌘K
              </kbd>
            </Link>
          )}
          <Link href="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </Link>
        </div>

        <div className="p-4 md:p-6 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Floating AI Assistant Widget */}
      <AIAssistant />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}

export default AppShell;
