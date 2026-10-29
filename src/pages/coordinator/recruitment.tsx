/**
 * Recruitment Management
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Full control over recruitment lifecycle, status toggle, custom positions, and applicant requirements.
 */

import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  PauseCircle,
  PlayCircle,
  Briefcase,
  ExternalLink,
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
import { RecruitmentPositionItem, RecruitmentStatus } from "@/types/coordinator";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorRecruitment() {
  const { activeClub, refreshClubs } = useCoordinator();
  const { toast } = useToast();

  const [positions, setPositions] = useState<RecruitmentPositionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status Change Confirmation Dialog
  const [pendingStatus, setPendingStatus] = useState<RecruitmentStatus | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Add / Edit Position Modal
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Partial<RecruitmentPositionItem> | null>(null);
  const [posTitle, setPosTitle] = useState("");
  const [posDepartment, setPosDepartment] = useState("");
  const [posDescription, setPosDescription] = useState("");
  const [posResponsibilities, setPosResponsibilities] = useState("");
  const [posRequiredSkills, setPosRequiredSkills] = useState("");
  const [posPreferredSkills, setPosPreferredSkills] = useState("");
  const [posOpenings, setPosOpenings] = useState(2);
  const [posIsActive, setPosIsActive] = useState(true);

  const loadPositions = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getRecruitmentPositions(activeClub.id);
      setPositions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
  }, [activeClub]);

  const handleOpenStatusChange = (newStatus: RecruitmentStatus) => {
    setPendingStatus(newStatus);
    setIsStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!activeClub || !pendingStatus) return;

    try {
      await coordinatorService.updateRecruitmentStatus(activeClub.id, pendingStatus);
      await refreshClubs();

      toast({
        title: "Recruitment Status Updated",
        description: `Recruitment status is now set to ${pendingStatus.toUpperCase()}. Public site updated.`,
      });
    } catch (err: any) {
      toast({
        title: "Status Update Failed",
        description: err?.message || "Could not update recruitment status.",
        variant: "destructive",
      });
    } finally {
      setIsStatusDialogOpen(false);
      setPendingStatus(null);
    }
  };

  const handleOpenPositionModal = (pos?: RecruitmentPositionItem) => {
    if (pos) {
      setEditingPosition(pos);
      setPosTitle(pos.title);
      setPosDepartment(pos.department || "");
      setPosDescription(pos.description);
      setPosResponsibilities(pos.responsibilities || "");
      setPosRequiredSkills((pos.requiredSkills || []).join(", "));
      setPosPreferredSkills((pos.preferredSkills || []).join(", "));
      setPosOpenings(pos.openings);
      setPosIsActive(pos.isActive);
    } else {
      setEditingPosition(null);
      setPosTitle("");
      setPosDepartment("Computer Science / IT");
      setPosDescription("");
      setPosResponsibilities("");
      setPosRequiredSkills("React, Node.js");
      setPosPreferredSkills("Git, Docker");
      setPosOpenings(2);
      setPosIsActive(true);
    }
    setIsPositionModalOpen(true);
  };

  const handleSavePosition = async () => {
    if (!activeClub || !posTitle.trim()) {
      toast({ title: "Validation Error", description: "Position title is required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveRecruitmentPosition(activeClub.id, {
        id: editingPosition?.id,
        title: posTitle.trim(),
        department: posDepartment.trim(),
        description: posDescription.trim(),
        responsibilities: posResponsibilities.trim(),
        requiredSkills: posRequiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        preferredSkills: posPreferredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        openings: posOpenings,
        isActive: posIsActive,
      });

      await loadPositions();
      setIsPositionModalOpen(false);

      toast({
        title: editingPosition ? "Position Updated" : "Position Created",
        description: `Position "${posTitle}" has been saved.`,
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err?.message || "Could not save position.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePosition = async (id: number) => {
    if (!activeClub) return;
    try {
      await coordinatorService.deleteRecruitmentPosition(activeClub.id, id);
      await loadPositions();
      toast({ title: "Position Deleted", description: "Position removed from recruitment drive." });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    }
  };

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      {/* Top Banner: Status Controller */}
      <Card className="border shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-black tracking-tight">Recruitment Lifecycle & Status</CardTitle>
              <Badge
                className={
                  activeClub.recruitmentStatus === "open"
                    ? "bg-emerald-600 text-white font-bold"
                    : activeClub.recruitmentStatus === "paused"
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-muted text-muted-foreground font-bold"
                }
              >
                {activeClub.recruitmentStatus.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              When open, verified students can apply. When closed or paused, applications are disabled.
            </CardDescription>
          </div>

          {/* Quick Lifecycle Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={activeClub.recruitmentStatus === "open" ? "default" : "outline"}
              onClick={() => handleOpenStatusChange("open")}
              className="text-xs font-bold h-8 gap-1.5 shadow-2xs"
            >
              <PlayCircle className="h-3.5 w-3.5 text-emerald-500" /> Open Recruitment
            </Button>

            <Button
              size="sm"
              variant={activeClub.recruitmentStatus === "paused" ? "default" : "outline"}
              onClick={() => handleOpenStatusChange("paused")}
              className="text-xs font-bold h-8 gap-1.5 shadow-2xs"
            >
              <PauseCircle className="h-3.5 w-3.5 text-amber-500" /> Pause
            </Button>

            <Button
              size="sm"
              variant={activeClub.recruitmentStatus === "closed" ? "default" : "outline"}
              onClick={() => handleOpenStatusChange("closed")}
              className="text-xs font-bold h-8 gap-1.5 shadow-2xs"
            >
              Close
            </Button>

            <Button asChild size="sm" variant="secondary" className="text-xs font-bold h-8 gap-1.5">
              <Link href="/coordinator/applications">
                <UserCheck className="h-3.5 w-3.5" /> View Applications Pipeline
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Positions Manager Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-foreground">Open Positions & Roles</h3>
          <p className="text-xs text-muted-foreground">
            Configure specific roles (e.g. Tech Lead, Event Manager) available for this recruitment cycle.
          </p>
        </div>

        <Button size="sm" onClick={() => handleOpenPositionModal()} className="font-bold text-xs h-9 gap-1.5 shadow-2xs">
          <Plus className="h-4 w-4" /> Add New Position
        </Button>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((pos) => (
          <Card key={pos.id} className="border shadow-2xs p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {pos.department || "General"}
                </Badge>
                <Badge variant={pos.isActive ? "default" : "secondary"} className="text-[10px]">
                  {pos.isActive ? "Active Opening" : "Paused"}
                </Badge>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-foreground">{pos.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{pos.description}</p>
              </div>

              {pos.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {pos.requiredSkills.map((sk) => (
                    <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-muted font-medium text-foreground">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">{pos.openings} Openings</span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenPositionModal(pos)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => pos.id && handleDeletePosition(pos.id)}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {positions.length === 0 && !isLoading && (
          <div className="md:col-span-3 p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
            <Briefcase className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="font-bold text-sm">No positions created yet</div>
            <p>Click "Add New Position" above to define roles for prospective members.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Position Modal */}
      <Dialog open={isPositionModalOpen} onOpenChange={setIsPositionModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              {editingPosition ? "Edit Position" : "Create Recruitment Position"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define the requirements, responsibilities, and openings count for this role.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Position Title *</Label>
              <Input
                value={posTitle}
                onChange={(e) => setPosTitle(e.target.value)}
                placeholder="e.g. Technical Team Lead"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Department / Division</Label>
                <Input
                  value={posDepartment}
                  onChange={(e) => setPosDepartment(e.target.value)}
                  placeholder="Computer Science, Any..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Number of Openings</Label>
                <Input
                  type="number"
                  min={1}
                  value={posOpenings}
                  onChange={(e) => setPosOpenings(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Short Description *</Label>
              <Textarea
                value={posDescription}
                onChange={(e) => setPosDescription(e.target.value)}
                placeholder="Core purpose of this role..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Responsibilities & Tasks</Label>
              <Textarea
                value={posResponsibilities}
                onChange={(e) => setPosResponsibilities(e.target.value)}
                placeholder="Day-to-day duties..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Required Skills (comma separated)</Label>
              <Input
                value={posRequiredSkills}
                onChange={(e) => setPosRequiredSkills(e.target.value)}
                placeholder="React, TypeScript, Git"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Preferred / Bonus Skills</Label>
              <Input
                value={posPreferredSkills}
                onChange={(e) => setPosPreferredSkills(e.target.value)}
                placeholder="Docker, Figma, Public Speaking"
                className="h-9 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-0.5">
                <div className="text-xs font-bold">Accepting Submissions</div>
                <div className="text-[11px] text-muted-foreground">Keep position visible and selectable in application form</div>
              </div>
              <Switch checked={posIsActive} onCheckedChange={setPosIsActive} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsPositionModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSavePosition} className="font-bold text-xs">
              Save Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Status Change */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-extrabold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Recruitment Status Change
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to transition recruitment to <strong>{pendingStatus?.toUpperCase()}</strong>?
              {pendingStatus === "open" && " This will make the application form live on the student portal immediately."}
              {pendingStatus === "closed" && " This will prevent students from submitting further applications."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} className="text-xs font-bold">
              Confirm Transition
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
