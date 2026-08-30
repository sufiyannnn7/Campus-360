import { Link, useLocation } from "wouter"
import { useGetMe, useLogout } from "@workspace/api-client-react"
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"

import { 
  Calendar, LayoutDashboard, Ticket, Users, FileText, 
  Trophy, Medal, Newspaper, Bell, Search, Menu, LogOut,
  Settings, User, MapPin, X, LogIn, UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: user } = useGetMe()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [location] = useLocation()

  // Helper for active navigation link
  const isLinkActive = (path: string) => {
    if (path === '/') return location === '/'
    return location.startsWith(path)
  }

  // Public Layout when not logged in
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

            {/* Compact Animated Public Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <Link href="/events" className={cn(
                "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                isLinkActive('/events') ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}>
                <Calendar className="h-3.5 w-3.5" /> Events
              </Link>

              <Link href="/clubs" className={cn(
                "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                isLinkActive('/clubs') ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}>
                <Users className="h-3.5 w-3.5" /> Clubs
              </Link>

              <Link href="/calendar" className={cn(
                "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                isLinkActive('/calendar') ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}>
                <Calendar className="h-3.5 w-3.5" /> Calendar
              </Link>

              <Link href="/news" className={cn(
                "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                isLinkActive('/news') ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}>
                <Newspaper className="h-3.5 w-3.5" /> News
              </Link>

              <Link href="/map" className={cn(
                "transition-all flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer hover:scale-105 duration-200",
                isLinkActive('/map') ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}>
                <MapPin className="h-3.5 w-3.5" /> Map
              </Link>
            </nav>

            {/* Auth CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant={isLinkActive('/login') ? "default" : "ghost"} size="sm" className="font-semibold text-xs h-8 gap-1.5">
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
              <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className={cn(
                "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                isLinkActive('/events') ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
              )}>
                <Calendar className="h-4 w-4" /> Events
              </Link>
              <Link href="/clubs" onClick={() => setIsMobileMenuOpen(false)} className={cn(
                "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                isLinkActive('/clubs') ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
              )}>
                <Users className="h-4 w-4" /> Clubs
              </Link>
              <Link href="/calendar" onClick={() => setIsMobileMenuOpen(false)} className={cn(
                "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                isLinkActive('/calendar') ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
              )}>
                <Calendar className="h-4 w-4" /> Calendar
              </Link>
              <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className={cn(
                "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                isLinkActive('/news') ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
              )}>
                <Newspaper className="h-4 w-4" /> News
              </Link>
              <Link href="/map" onClick={() => setIsMobileMenuOpen(false)} className={cn(
                "flex items-center gap-2.5 p-2 font-semibold text-xs rounded-lg transition-colors",
                isLinkActive('/map') ? "bg-primary text-primary-foreground font-bold" : "hover:text-primary"
              )}>
                <MapPin className="h-4 w-4" /> Campus Map
              </Link>
              <div className="pt-2 border-t flex flex-col gap-1.5">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-center font-semibold text-xs h-8">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-center font-semibold text-xs h-8">Get Started</Button>
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

  // Authenticated Layout
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

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:static md:flex md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-primary" onClick={() => setIsMobileMenuOpen(false)}>
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
            
            <div className="my-3 border-t" />
            <div className="px-2 mb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Me</div>
            <SidebarLink href="/profile" icon={User} label="Profile" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/certificates" icon={Medal} label="Certificates" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarLink href="/notifications" icon={Bell} label="Notifications" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </div>
        <div className="border-t p-3">
          <UserMenu user={user} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto animate-in fade-in-50 duration-200">
        <div className="hidden h-14 w-full items-center justify-end border-b bg-background px-6 md:flex gap-3">
          {!location.startsWith('/search') && (
            <Link href="/search" className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 hover:bg-muted px-3 py-1.5 rounded-lg transition-colors w-60 border">
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
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Floating AI Assistant Widget */}
      <AIAssistant />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label, onClick }: { href: string, icon: any, label: string, onClick?: () => void }) {
  const [location] = useLocation()
  const isActive = location === href || (href !== '/dashboard' && location.startsWith(href))
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all text-xs font-semibold",
        isActive 
          ? "bg-primary text-primary-foreground shadow-xs font-bold" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

function UserMenu({ user }: { user: any }) {
  const logoutMut = useLogout()
  const [_, setLocation] = useLocation()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("token")
    logoutMut.mutate(undefined, {
      onSuccess: () => {
        setLocation('/login')
      },
      onError: () => {
        toast({ title: "Failed to logout", variant: "destructive" })
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2 hover:bg-sidebar-accent h-10">
          <Avatar className="h-7 w-7 border-sidebar-border">
            <AvatarImage src={user.avatarUrl || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-xs overflow-hidden">
            <span className="font-semibold truncate w-full">{user.name}</span>
            <span className="text-[10px] text-muted-foreground truncate w-full capitalize">{user.role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-bold text-xs">{user.name}</p>
            <p className="w-[180px] truncate text-[11px] text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <div className="border-t my-1" />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer w-full text-xs">
            <User className="mr-2 h-3.5 w-3.5" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer w-full text-xs">
            <Settings className="mr-2 h-3.5 w-3.5" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <div className="border-t my-1" />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer text-xs">
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
