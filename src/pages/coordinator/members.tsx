/**
 * Club Members Directory & Role Management
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Search, filter, club-level role assignments, remove member with confirmation, and CSV export.
 */

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Download,
  UserPlus,
  Shield,
  Trash2,
  AlertTriangle,
  GraduationCap,
  Mail,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCoordinator } from "./coordinator-context";
import { coordinatorService } from "@/api/services/coordinator.service";
import { ClubMemberDirectoryItem } from "@/types/coordinator";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorMembers() {
  const { activeClub, refreshClubs } = useCoordinator();
  const { toast } = useToast();

  const [members, setMembers] = useState<ClubMemberDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Remove Member State
  const [memberToRemove, setMemberToRemove] = useState<ClubMemberDirectoryItem | null>(null);

  const loadMembers = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getClubMembers(activeClub.id);
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [activeClub]);

  const handleRoleChange = async (member: ClubMemberDirectoryItem, newRole: "member" | "lead" | "advisor") => {
    if (!activeClub) return;

    try {
      await coordinatorService.updateMemberRole(activeClub.id, member.id, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
      );

      toast({
        title: "Role Updated",
        description: `Assigned club role "${newRole.toUpperCase()}" to ${member.name}.`,
      });
    } catch (err: any) {
      toast({
        title: "Role Update Failed",
        description: err?.message || "Could not change role.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmRemove = async () => {
    if (!activeClub || !memberToRemove) return;

    try {
      await coordinatorService.removeMember(activeClub.id, memberToRemove.id);
      setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
      await refreshClubs();

      toast({
        title: "Member Removed",
        description: `${memberToRemove.name} has been removed from this club.`,
      });
    } catch (err: any) {
      toast({
        title: "Remove Failed",
        description: err?.message || "Could not remove member.",
        variant: "destructive",
      });
    } finally {
      setMemberToRemove(null);
    }
  };

  const handleExportCsv = () => {
    const rows = members.map((m) => ({
      ID: m.id,
      Name: m.name,
      Email: m.email,
      Department: m.department || "N/A",
      Year: m.year || "N/A",
      ClubRole: m.role,
      JoinedDate: new Date(m.joinedAt).toLocaleDateString(),
    }));

    coordinatorService.exportToCsv(`members_${activeClub?.slug || "club"}`, rows);
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.department && m.department.toLowerCase().includes(q));

    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Club Membership Directory</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Manage student memberships, assign club-level titles, and export member records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="h-8 gap-1.5 text-xs font-semibold shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" /> Export Member Roster
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-2xl p-3 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department..."
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Filter Role:</span>
          {["all", "lead", "member", "advisor"].map((r) => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? "default" : "outline"}
              onClick={() => setRoleFilter(r)}
              className="h-7 text-xs capitalize font-bold"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <Card className="border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Department & Year</th>
                <th className="p-3">Club Role</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{member.name}</div>
                        <div className="text-[11px] text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {member.department || "Engineering"} • {member.year || "Student"}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={member.role === "lead" ? "default" : member.role === "advisor" ? "secondary" : "outline"}
                      className="text-[10px] capitalize font-bold"
                    >
                      {member.role === "lead" ? "Lead Coordinator" : member.role === "advisor" ? "Faculty Advisor" : "Active Member"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 text-xs font-bold gap-1">
                            Role <Shield className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="text-xs">Assign Club Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRoleChange(member, "member")} className="text-xs cursor-pointer font-medium">
                            Set as General Member
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(member, "lead")} className="text-xs cursor-pointer font-bold text-primary">
                            Promote to Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(member, "advisor")} className="text-xs cursor-pointer font-medium">
                            Designate as Advisor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMemberToRemove(member)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                    No matching members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog for Member Removal */}
      <AlertDialog open={Boolean(memberToRemove)} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-extrabold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Remove Member from Club
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from {activeClub.name}?
              They will lose access to member-only materials and events. Their Campus 360 student account remains active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="text-xs font-bold bg-destructive hover:bg-destructive/90 text-white">
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
