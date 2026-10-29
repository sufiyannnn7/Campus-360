/**
 * Team & Leadership Management
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Maintain official club core committee, leadership roles, biographies, and terms.
 */

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Users,
  Award,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCoordinator } from "./coordinator-context";
import { coordinatorService } from "@/api/services/coordinator.service";
import { ClubTeamRosterItem } from "@/types/coordinator";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorTeam() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();

  const [teamMembers, setTeamMembers] = useState<ClubTeamRosterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<ClubTeamRosterItem> | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [clubRole, setClubRole] = useState("");
  const [bio, setBio] = useState("");
  const [termYear, setTermYear] = useState("2026-2027");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublic, setIsPublic] = useState(true);

  const loadTeam = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getClubTeam(activeClub.id);
      setTeamMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [activeClub]);

  const handleOpenModal = (member?: ClubTeamRosterItem) => {
    if (member) {
      setEditingMember(member);
      setDisplayName(member.displayName);
      setClubRole(member.clubRole);
      setBio(member.bio || "");
      setTermYear(member.termYear || "2026-2027");
      setDisplayOrder(member.displayOrder);
      setIsPublic(member.isPublic);
    } else {
      setEditingMember(null);
      setDisplayName("");
      setClubRole("Technical Lead");
      setBio("");
      setTermYear("2026-2027");
      setDisplayOrder(teamMembers.length + 1);
      setIsPublic(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!activeClub || !displayName.trim() || !clubRole.trim()) {
      toast({ title: "Validation Error", description: "Name and Club Role are required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveTeamMember(activeClub.id, {
        id: editingMember?.id,
        displayName: displayName.trim(),
        clubRole: clubRole.trim(),
        bio: bio.trim(),
        termYear,
        displayOrder,
        isPublic,
      });

      await loadTeam();
      setIsModalOpen(false);

      toast({
        title: editingMember ? "Leader Updated" : "Leader Added",
        description: `${displayName} has been updated on the club leadership roster.`,
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err?.message || "Could not save team member.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!activeClub) return;
    try {
      await coordinatorService.deleteTeamMember(activeClub.id, id);
      await loadTeam();
      toast({ title: "Removed", description: "Leader removed from roster." });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    }
  };

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Team & Leadership Structure</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Manage your core leadership council displayed prominently on the club's public page.
          </p>
        </div>

        <Button size="sm" onClick={() => handleOpenModal()} className="font-bold text-xs h-9 gap-1.5 shadow-2xs">
          <Plus className="h-4 w-4" /> Add Leadership Member
        </Button>
      </div>

      {/* Leadership Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="border shadow-2xs p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-bold">
                  Order #{member.displayOrder}
                </Badge>
                <Badge variant={member.isPublic ? "default" : "secondary"} className="text-[10px]">
                  {member.isPublic ? "Publicly Visible" : "Hidden"}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm shrink-0">
                  {member.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{member.displayName}</h4>
                  <p className="text-xs font-semibold text-primary">{member.clubRole}</p>
                </div>
              </div>

              {member.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                  {member.bio}
                </p>
              )}
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className="text-[11px] text-muted-foreground font-medium">Term: {member.termYear || "2026-27"}</span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenModal(member)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => member.id && handleDelete(member.id)}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {teamMembers.length === 0 && !isLoading && (
          <div className="md:col-span-3 p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
            <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="font-bold text-sm">No leadership members listed yet</div>
            <p>Click "Add Leadership Member" to showcase President, Vice President, and Leads.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              {editingMember ? "Edit Leader Profile" : "Add Leadership Member"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure official club leadership title and short biography.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Display Name *</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Prathamesh Patil"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Club Role / Designation *</Label>
              <Input
                value={clubRole}
                onChange={(e) => setClubRole(e.target.value)}
                placeholder="e.g. Club President, Technical Lead, Design Head..."
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Term / Academic Year</Label>
                <Input
                  value={termYear}
                  onChange={(e) => setTermYear(e.target.value)}
                  placeholder="2026-2027"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Display Priority Order</Label>
                <Input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Short Bio / Highlights</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief intro for the public page..."
                rows={3}
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-0.5">
                <div className="text-xs font-bold">Public Display</div>
                <div className="text-[11px] text-muted-foreground">Show in team section of club detail page</div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} className="font-bold text-xs">Save Leader</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
