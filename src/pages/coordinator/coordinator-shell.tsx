/**
 * Coordinator Shell & Layout
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Provides assigned club switcher, top status bar, and dedicated navigation sidebar.
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { clubsService } from "@/api/services/clubs.service";
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  Newspaper,
  UserCheck,
  Award,
  Image as ImageIcon,
  HelpCircle,
  BarChart3,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Settings,
  Bell,
  Menu,
  X,
  FileCheck2,
  FileBadge,
  Plus,
  Lock,
  LogIn,
  Loader2,
  LogOut,
  AlertTriangle,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useCoordinator } from "./coordinator-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { coordinatorService } from "@/api/services/coordinator.service";
import { CheckCircle2, Clock, Send, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/coordinator/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/coordinator/profile", label: "My Club Profile", icon: Building2 },
  { href: "/coordinator/recruitment", label: "Recruitment Drives", icon: Layers },
  { href: "/coordinator/applications", label: "Applications Pipeline", icon: UserCheck },
  { href: "/coordinator/members", label: "Club Members", icon: Users },
  { href: "/coordinator/team", label: "Team & Leadership", icon: ShieldCheck },
  { href: "/coordinator/events", label: "Club Events", icon: Calendar },
  { href: "/coordinator/certificates", label: "Certificates", icon: FileBadge },
  { href: "/coordinator/news", label: "News & Notices", icon: Newspaper },
  { href: "/coordinator/achievements", label: "Achievements & Media", icon: Award },
  { href: "/coordinator/faqs", label: "FAQs & Contact", icon: HelpCircle },
  { href: "/coordinator/analytics", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/coordinator/approvals", label: "Approval Submissions", icon: FileCheck2 },
];

export function CoordinatorShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const { clubs, activeClub, setActiveClubId, isLoading, refreshClubs } = useCoordinator();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Leave Club Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isCheckingCoordinators, setIsCheckingCoordinators] = useState(false);
  const [clubCoordinators, setClubCoordinators] = useState<any[]>([]);
  const [clubMembersList, setClubMembersList] = useState<any[]>([]);
  const [selectedPromoteMember, setSelectedPromoteMember] = useState<string>("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isActionExecuting, setIsActionExecuting] = useState(false);
  const [leaveTab, setLeaveTab] = useState<"promote" | "delete">("promote");

  const handleOpenLeaveModal = async () => {
    if (!activeClub) return;
    setIsLeaveModalOpen(true);
    setIsCheckingCoordinators(true);
    setDeleteConfirmText("");
    setSelectedPromoteMember("");
    try {
      const [coords, members] = await Promise.all([
        coordinatorService.getClubCoordinators(activeClub.id),
        coordinatorService.getClubMembers(activeClub.id),
      ]);
      setClubCoordinators(coords);
      const nonLeadMembers = members.filter(
        (m: any) => m.userId !== user?.id && m.role !== "lead" && !coords.some((c: any) => c.id === m.userId)
      );
      setClubMembersList(nonLeadMembers);
      if (nonLeadMembers.length > 0) {
        setSelectedPromoteMember(nonLeadMembers[0].userId);
      }
    } catch (err) {
      console.warn("Could not load coordinator roster:", err);
    } finally {
      setIsCheckingCoordinators(false);
    }
  };

  const handleLeaveAsMultiple = async () => {
    if (!activeClub) return;
    setIsActionExecuting(true);
    try {
      await coordinatorService.leaveClubAsCoordinator(activeClub.id, user?.id);
      toast({
        title: "Resigned Successfully",
        description: `You have stepped down as coordinator of ${activeClub.name}.`,
      });
      setIsLeaveModalOpen(false);
      await refreshClubs();
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Failed to leave", description: err?.message, variant: "destructive" });
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handlePromoteAndLeave = async () => {
    if (!activeClub || !selectedPromoteMember) {
      toast({ title: "Selection Required", description: "Please select a member to promote to coordinator.", variant: "destructive" });
      return;
    }
    setIsActionExecuting(true);
    try {
      await coordinatorService.promoteMemberToCoordinator(activeClub.id, selectedPromoteMember);
      await coordinatorService.leaveClubAsCoordinator(activeClub.id, user?.id);
      toast({
        title: "Successor Assigned & Left Club",
        description: `New coordinator promoted. You have stepped down from ${activeClub.name}.`,
      });
      setIsLeaveModalOpen(false);
      await refreshClubs();
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Action Failed", description: err?.message, variant: "destructive" });
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!activeClub) return;
    if (deleteConfirmText.trim().toLowerCase() !== activeClub.name.trim().toLowerCase()) {
      toast({
        title: "Name Mismatch",
        description: `Please type "${activeClub.name}" exactly to confirm permanent deletion.`,
        variant: "destructive",
      });
      return;
    }
    setIsActionExecuting(true);
    try {
      await coordinatorService.deleteClub(activeClub.id, user?.id);
      toast({
        title: "Club Deleted",
        description: `"${activeClub.name}" has been permanently removed.`,
      });
      setIsLeaveModalOpen(false);
      await refreshClubs();
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    } finally {
      setIsActionExecuting(false);
    }
  };

  // Show spinner while checking auth session on fresh load or new device
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Verifying coordinator session...</p>
      </div>
    );
  }

  // Require login if not authenticated (prevents showing elevation form to unauthenticated users)
  if (!user) {
    return <CoordinatorLoginRequiredView />;
  }

  // Check role authorization
  const isAuthorized = user.role === "coordinator" || user.role === "admin";

  if (!isAuthorized) {
    return <CoordinatorAccessRequestView user={user} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Club Selector & Global Actions */}
      <div className="bg-card border rounded-2xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Logo or Abbreviation */}
          <div className="h-12 w-12 rounded-xl border bg-muted flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
            {activeClub?.logoUrl ? (
              <img src={activeClub.logoUrl} alt={activeClub.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-black text-primary text-base">
                {(activeClub?.name || "CC").substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {clubs.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto p-0 font-black text-lg md:text-xl hover:bg-transparent flex items-center gap-1.5 tracking-tight">
                      <span>{activeClub?.name || "Loading Assigned Club..."}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
                      Switch Assigned Club ({clubs.length})
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {clubs.map((c) => (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => setActiveClubId(c.id)}
                        className={cn("cursor-pointer font-medium text-xs py-2 flex items-center justify-between", c.id === activeClub?.id && "bg-muted font-bold")}
                      >
                        <span>{c.name}</span>
                        {c.id === activeClub?.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <h1 className="font-black text-lg md:text-xl tracking-tight text-foreground">
                  {activeClub?.name || (isLoading ? "Loading Assigned Club..." : "No Club Assigned")}
                </h1>
              )}

              {/* Status Badge */}
              {activeClub && (
                <Badge
                  variant={activeClub.status === "published" ? "default" : "outline"}
                  className={cn(
                    "capitalize text-[11px] px-2 py-0.5 font-bold shadow-2xs",
                    activeClub.status === "published" && "bg-emerald-600 hover:bg-emerald-700",
                    activeClub.status === "pending_approval" && "bg-amber-500/10 text-amber-600 border-amber-300",
                    activeClub.status === "draft" && "bg-muted text-muted-foreground"
                  )}
                >
                  {activeClub.status.replace("_", " ")}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
              <span>{activeClub?.category || "Club"}</span>
              <span>•</span>
              <span>{activeClub?.memberCount || 0} Members</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Recruitment: {activeClub?.recruitmentStatus?.toUpperCase() || "CLOSED"}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeClub && (
            <>
              <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-semibold shadow-2xs">
                <Link href={`/clubs/${activeClub.id}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" /> Preview Public Page
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 shadow-2xs cursor-pointer"
                onClick={handleOpenLeaveModal}
              >
                <LogOut className="h-3.5 w-3.5" /> Leave Club
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            className="md:hidden h-9 text-xs font-semibold gap-1.5"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span>Sections</span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside
          className={cn(
            "md:block md:col-span-1 space-y-1 bg-card border rounded-2xl p-2.5 shadow-2xs sticky top-20",
            isMobileNavOpen ? "block" : "hidden md:block"
          )}
        >
          <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-muted-foreground border-b mb-1.5 flex items-center justify-between">
            <span>Management Sections</span>
            <Sparkles className="h-3 w-3 text-primary" />
          </div>

          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/coordinator/dashboard" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Pane */}
        <main className="md:col-span-3 lg:col-span-4 min-w-0">
          {children}
        </main>
      </div>

      {/* Leave Club Modal */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <LogOut className="h-5 w-5" />
              <span>Leave {activeClub?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Manage coordinator leadership transition or club deletion.
            </DialogDescription>
          </DialogHeader>

          {isCheckingCoordinators ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Checking coordinator roster...</p>
            </div>
          ) : clubCoordinators.length <= 1 ? (
            <div className="space-y-4">
              <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <strong>You are currently the only Coordinator for {activeClub?.name}.</strong>
                  <br />
                  A club cannot be left without active leadership. You must assign another member as coordinator before leaving, or permanently delete the club.
                </AlertDescription>
              </Alert>

              <div className="flex border-b text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLeaveTab("promote")}
                  className={cn(
                    "pb-2 px-3 border-b-2 transition-colors cursor-pointer",
                    leaveTab === "promote"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  1. Assign Coordinator & Leave
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveTab("delete")}
                  className={cn(
                    "pb-2 px-3 border-b-2 transition-colors cursor-pointer text-rose-600",
                    leaveTab === "delete"
                      ? "border-rose-600 font-bold"
                      : "border-transparent text-muted-foreground hover:text-rose-600"
                  )}
                >
                  2. Delete Club
                </button>
              </div>

              {leaveTab === "promote" && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Select Member to Promote to Coordinator *</Label>
                    {clubMembersList.length > 0 ? (
                      <Select value={selectedPromoteMember} onValueChange={setSelectedPromoteMember}>
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Choose an active club member..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clubMembersList.map((m: any) => (
                            <SelectItem key={m.userId} value={m.userId} className="text-xs">
                              {m.name || "Student Member"} ({m.department || "Engineering"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-xl bg-muted/40 text-xs text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground">No other members in this club roster.</p>
                        <p>To transfer leadership, invite members to the club first, or delete the club using the tab above.</p>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePromoteAndLeave}
                      disabled={isActionExecuting || clubMembersList.length === 0 || !selectedPromoteMember}
                      className="gap-1.5 font-bold text-xs"
                    >
                      {isActionExecuting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Promote & Leave Club
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {leaveTab === "delete" && (
                <div className="space-y-3 pt-1">
                  <div className="p-3 border border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-900 dark:text-rose-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      Permanent Deletion Warning
                    </p>
                    <p>
                      This will permanently remove <strong>{activeClub?.name}</strong>, all associated events, members, and records. This action cannot be undone.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      Type <span className="font-mono text-rose-600 font-extrabold">{activeClub?.name}</span> to confirm:
                    </Label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder={`Type ${activeClub?.name} here`}
                      className="text-xs font-medium"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteClub}
                      disabled={isActionExecuting || deleteConfirmText.trim().toLowerCase() !== (activeClub?.name || "").trim().toLowerCase()}
                      className="gap-1.5 font-bold text-xs"
                    >
                      {isActionExecuting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Permanently Delete Club
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 border rounded-xl bg-muted/40 space-y-2 text-xs">
                <p className="text-muted-foreground">
                  There are currently <strong>{clubCoordinators.length} active coordinators</strong> managing this club. You can safely step down. The following coordinators will continue managing {activeClub?.name}:
                </p>
                <div className="space-y-1 pl-2">
                  {clubCoordinators
                    .filter((c: any) => c.id !== user?.id)
                    .map((c: any) => (
                      <div key={c.id} className="text-foreground font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{c.name}</span>
                        {c.email && <span className="text-muted-foreground font-normal">({c.email})</span>}
                      </div>
                    ))}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveAsMultiple}
                  disabled={isActionExecuting}
                  className="gap-1.5 font-bold text-xs"
                >
                  {isActionExecuting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm & Resign as Coordinator
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CoordinatorAccessRequestView({ user }: { user: any }) {
  const { toast } = useToast();
  const [targetRole, setTargetRole] = useState<"coordinator" | "faculty">("coordinator");
  const [targetClubName, setTargetClubName] = useState("Coding Club NKOCET");
  const [department, setDepartment] = useState(user?.department || "Computer Science & Engineering");
  const [prn, setPrn] = useState(user?.prn || "");
  const [justification, setJustification] = useState("");
  const [newClubName, setNewClubName] = useState("");
  const [newClubCategory, setNewClubCategory] = useState("Technical");
  const [newClubDescription, setNewClubDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dynamicClubs, setDynamicClubs] = useState<any[]>([]);

  useEffect(() => {
    clubsService.listClubs().then((res) => {
      if (Array.isArray(res)) setDynamicClubs(res);
    }).catch(console.error);
  }, []);

  const defaultClubs = [
    { id: 1, name: "Coding Club NKOCET" },
    { id: 2, name: "Robotics & Automation Society" },
    { id: 3, name: "Entrepreneurship Cell (E-Cell)" },
    { id: 4, name: "Google Developer Student Club (GDSC)" },
    { id: 5, name: "Cultural & Performing Arts Club" },
    { id: 6, name: "Sports & Athletics Committee" },
  ];

  const merged = [...dynamicClubs, ...defaultClubs];
  const seen = new Set<string>();
  const availableClubs = merged.filter((c) => {
    const key = (c?.name || "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const CLUB_OPTIONS = [
    { id: 999, name: "+ Propose & Register New Club" },
    ...availableClubs,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNewClub = targetRole === "coordinator" && targetClubName === "+ Propose & Register New Club";
    if (isNewClub && !newClubName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the proposed name for the new club.",
        variant: "destructive",
      });
      return;
    }

    if (!justification.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a brief justification or statement of purpose.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNewClub) {
        await clubsService.createClub({
          name: newClubName.trim(),
          category: newClubCategory,
          tagline: `${newClubName.trim()} at NKOCET`,
          description: newClubDescription.trim() || "Active campus society.",
        });
      }

      const isFaculty = targetRole === "faculty";
      const selectedClub = isFaculty ? undefined : CLUB_OPTIONS.find((c) => c.name === targetClubName);
      const finalClubName = isFaculty ? undefined : (isNewClub ? newClubName.trim() : targetClubName);
      await coordinatorService.requestRoleElevation({
        targetRole,
        clubId: isFaculty || isNewClub ? undefined : selectedClub?.id,
        clubName: finalClubName,
        department,
        prn,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        justification: isNewClub
          ? `[NEW CLUB PROPOSAL: ${finalClubName} (${newClubCategory})] Mission: ${newClubDescription.trim() || "Active society"} | Justification: ${justification.trim()}`
          : justification.trim(),
      });

      setSubmitted(true);
      toast({
        title: isNewClub ? "Club Proposal Submitted" : "Elevation Request Submitted",
        description: isNewClub
          ? `Proposal for "${finalClubName}" sent to Administrators for institutional charter approval.`
          : `Your application to become ${targetRole === "coordinator" ? "Club Coordinator" : "Faculty Advisor"} has been sent to the System Admin.`,
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err?.message || "Failed to submit request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="max-w-2xl mx-auto my-8 space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xs">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Club Coordinator & Faculty Access
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Currently signed in as <span className="font-semibold text-foreground capitalize">{user?.role || "Student"}</span>. 
          To manage club events, publish announcements, and review recruits, submit a role elevation request below for Admin approval.
        </p>
      </div>

      {submitted ? (
        <Card className="border shadow-sm p-6 bg-emerald-500/5 border-emerald-500/30 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground">Request Successfully Sent to Admin</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Your request to become a <strong className="capitalize text-foreground font-bold">{targetRole === "coordinator" ? `Club Coordinator (${targetClubName})` : "Faculty Advisor"}</strong> has been dispatched to the Administrator. An admin notification was sent for review. You will be notified as soon as your request is accepted.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-background border text-left text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Role:</span>
              <strong className="capitalize text-foreground">{targetRole}</strong>
            </div>
            {targetRole === "coordinator" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Club:</span>
                <strong className="text-foreground">{targetClubName}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span className="text-foreground">{department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge className="bg-amber-500/15 text-amber-600 font-bold border-amber-500/30 text-[10px]">
                <Clock className="h-3 w-3 mr-1" /> Pending Admin Review
              </Badge>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
              <Link href="/dashboard">
                Return to Dashboard
              </Link>
            </Button>
            <Button asChild size="sm" className="text-xs font-bold bg-primary text-primary-foreground gap-1.5">
              <Link href="/notifications">
                <Bell className="h-3.5 w-3.5" /> Check Notifications
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Request Official Role Elevation</CardTitle>
                <CardDescription className="text-xs">
                  Administrators will review your credentials and assign permissions accordingly.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-bold bg-muted/50">
                Official NKOCET Workflow
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* Applicant Profile Badge */}
            <div className="mb-4 p-2.5 rounded-xl bg-muted/30 border flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Applicant Account:</span>
                <span className="font-bold text-foreground">{user?.name || "Student Applicant"}</span>
                <span className="text-[11px] text-muted-foreground">({user?.email || "student@nkocet.ac.in"})</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold">
                Role: {user?.role || "student"}
              </Badge>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">I am applying to become a:</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetRole("coordinator")}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3",
                      targetRole === "coordinator"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-2xs"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <Building2 className={cn("h-5 w-5", targetRole === "coordinator" ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <div className="text-xs font-black">Club Coordinator</div>
                      <div className="text-[10px] text-muted-foreground">Manage events, recruitments & club site</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetRole("faculty")}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3",
                      targetRole === "faculty"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-2xs"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <UserCheck className={cn("h-5 w-5", targetRole === "faculty" ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <div className="text-xs font-black">Faculty Advisor / Mentor</div>
                      <div className="text-[10px] text-muted-foreground">Oversee clubs & verify event requests</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Target Club (for coordinators) */}
              {targetRole === "coordinator" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">Club You Will Coordinate</Label>
                    <button
                      type="button"
                      onClick={() => setTargetClubName("+ Propose & Register New Club")}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Create / Propose New Club
                    </button>
                  </div>
                  <select
                    value={targetClubName}
                    onChange={(e) => setTargetClubName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-input bg-background px-3 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                  >
                    {CLUB_OPTIONS.map((club) => (
                      <option
                        key={club.id}
                        value={club.name}
                        className={club.name.startsWith("+") ? "font-bold text-primary bg-primary/5" : ""}
                      >
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {targetRole === "coordinator" && targetClubName === "+ Propose & Register New Club" && (
                <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-3 animate-in fade-in-50 duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <Building2 className="h-4 w-4" /> Propose New Campus Club or Society
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold">New Club Name *</Label>
                      <Input
                        value={newClubName}
                        onChange={(e) => setNewClubName(e.target.value)}
                        placeholder="e.g. AI & Data Science Society"
                        className="text-xs h-8.5 bg-background"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold">Club Category *</Label>
                      <select
                        value={newClubCategory}
                        onChange={(e) => setNewClubCategory(e.target.value)}
                        className="w-full text-xs rounded-lg border border-input bg-background px-3 py-1.5 shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary h-8.5"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Innovation">Innovation & Entrepreneurship</option>
                        <option value="Social">Social & Community Service</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold">Club Purpose & Mission</Label>
                    <Input
                      value={newClubDescription}
                      onChange={(e) => setNewClubDescription(e.target.value)}
                      placeholder="e.g. Hands-on machine learning projects, seminars, and competitive hackathons"
                      className="text-xs h-8.5 bg-background"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Department</Label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="text-xs h-9"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{targetRole === "coordinator" ? "Student PRN / Roll No" : "Faculty Employee ID"}</Label>
                  <Input
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    placeholder="e.g. NK2023CS042"
                    className="text-xs h-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Statement of Purpose / Justification</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Explain your past leadership experience, qualifications, or reasons for coordinating this club..."
                  rows={3}
                  className="text-xs resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-muted-foreground"
                >
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-xs font-bold gap-1.5 shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Submitting..." : "Send Request to Admin"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CoordinatorLoginRequiredView() {
  return (
    <div className="max-w-md mx-auto my-12 space-y-6 animate-in fade-in-50 duration-300">
      <Card className="border shadow-md overflow-hidden text-center p-6 sm:p-8">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xs mb-4">
          <Lock className="h-8 w-8" />
        </div>

        <CardHeader className="p-0 space-y-2 mb-6">
          <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The Campus 360 Coordinator Portal is restricted to authorized NKOCET club leads, faculty advisors, and administrators.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className="p-3.5 rounded-xl bg-muted/60 border text-xs text-muted-foreground text-left space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Access Information:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Sign in with your verified NKOCET credentials.</li>
              <li>Students wishing to lead a club can submit an elevation request.</li>
              <li>Public clubs and events remain open to all visitors.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link href="/login?redirect=/coordinator" className="w-full">
              <Button className="w-full text-xs font-bold h-10 cursor-pointer gap-2 shadow-xs">
                <LogIn className="h-4 w-4" /> Sign In to Access Portal
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full text-xs font-semibold h-10 cursor-pointer">
                Create Student Account
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full text-xs text-muted-foreground h-9 cursor-pointer">
                Return to Campus Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CoordinatorShell;
