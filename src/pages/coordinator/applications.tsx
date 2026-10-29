/**
 * Applications Pipeline & Review
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Kanban board, candidate detail modal, stage promotions, and CSV export.
 */

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Table as TableIcon,
  Kanban,
  ExternalLink,
  Mail,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCoordinator } from "./coordinator-context";
import { coordinatorService } from "@/api/services/coordinator.service";
import { ApplicationItem, ApplicationStage } from "@/types/coordinator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STAGES: { key: ApplicationStage; label: string; color: string }[] = [
  { key: "applied", label: "Applied", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { key: "under_review", label: "Under Review", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { key: "interview", label: "Interview", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  { key: "accepted", label: "Accepted", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  { key: "rejected", label: "Rejected", color: "bg-rose-500/10 text-rose-600 border-rose-200" },
];

export default function CoordinatorApplications() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const loadApplications = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getClubApplications(activeClub.id);
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [activeClub]);

  const handleStageMove = async (appId: number, newStage: ApplicationStage) => {
    if (!activeClub) return;

    try {
      await coordinatorService.updateApplicationStage(activeClub.id, appId, newStage);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
      );

      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, stage: newStage });
      }

      toast({
        title: "Candidate Moved",
        description: `Candidate status updated to ${newStage.replace("_", " ").toUpperCase()}`,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Could not move candidate.",
        variant: "destructive",
      });
    }
  };

  const handleExportCsv = () => {
    const rows = applications.map((a) => ({
      ID: a.id,
      Name: a.applicantName,
      Email: a.applicantEmail,
      Department: a.department || "N/A",
      Year: a.year || "N/A",
      Role: a.positionTitle || "General",
      Stage: a.stage,
      AppliedDate: new Date(a.appliedAt).toLocaleDateString(),
      Portfolio: a.portfolioUrl || "N/A",
    }));

    coordinatorService.exportToCsv(`applications_${activeClub?.slug || "club"}`, rows);
  };

  const filteredApps = applications.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.applicantName.toLowerCase().includes(q) ||
      a.applicantEmail.toLowerCase().includes(q) ||
      (a.positionTitle && a.positionTitle.toLowerCase().includes(q)) ||
      (a.department && a.department.toLowerCase().includes(q))
    );
  });

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Applications Pipeline & Review
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Review applicant motivation statements, portfolios, track selection stages, and onboard accepted members.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-xl p-1 bg-muted/40 text-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "kanban" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
              )}
            >
              <Kanban className="h-3.5 w-3.5" /> Pipeline Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "table" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
              )}
            >
              <TableIcon className="h-3.5 w-3.5" /> Table View
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="h-8 gap-1.5 text-xs font-semibold shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, email, department..."
            className="pl-8 h-9 text-xs"
          />
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          {filteredApps.length} Total Applicants
        </span>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-start overflow-x-auto pb-4">
          {STAGES.map((col) => {
            const colApps = filteredApps.filter((a) => a.stage === col.key);
            return (
              <div key={col.key} className="bg-muted/30 border rounded-2xl p-2.5 space-y-2.5 min-w-[200px]">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <span className="font-extrabold text-xs text-foreground tracking-tight">{col.label}</span>
                  <Badge variant="secondary" className="text-[10px] h-5 w-5 p-0 flex items-center justify-center font-bold">
                    {colApps.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {colApps.map((app) => (
                    <Card
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="border shadow-2xs p-3 space-y-2 cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.01]"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-foreground truncate">{app.applicantName}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{app.positionTitle || "General Role"}</div>
                      </div>

                      <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1 border-t">
                        <span>{app.year || app.department || "Student"}</span>
                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))}

                  {colApps.length === 0 && (
                    <div className="p-4 text-center text-[10px] text-muted-foreground border border-dashed rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <Card className="border shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Applied Role</th>
                  <th className="p-3">Department & Year</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Current Stage</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{app.applicantName}</div>
                      <div className="text-[11px] text-muted-foreground">{app.applicantEmail}</div>
                    </td>
                    <td className="p-3 font-semibold">{app.positionTitle || "General Member"}</td>
                    <td className="p-3 text-muted-foreground">
                      {app.department || "Engineering"} • {app.year || "Student"}
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={cn("text-[10px] capitalize font-bold", STAGES.find(s => s.key === app.stage)?.color)}>
                        {app.stage.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedApp(app)} className="h-7 text-xs font-bold gap-1">
                        <Eye className="h-3.5 w-3.5" /> Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Applicant Detail Dialog */}
      <Dialog open={Boolean(selectedApp)} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold flex items-center justify-between">
              <span>{selectedApp?.applicantName}</span>
              <Badge variant="outline" className="capitalize text-[11px] font-bold">
                {selectedApp?.stage.replace("_", " ")}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Candidate application submission details and stage action
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4 py-2 text-xs">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border bg-muted/30">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Email</span>
                  <div className="font-semibold">{selectedApp.applicantEmail}</div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Role Applied For</span>
                  <div className="font-semibold">{selectedApp.positionTitle || "General Member"}</div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Department</span>
                  <div className="font-semibold">{selectedApp.department || "Engineering"}</div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Academic Year</span>
                  <div className="font-semibold">{selectedApp.year || "Undergraduate"}</div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Motivation / Statement</span>
                  <div className="p-3 rounded-xl border bg-card text-muted-foreground font-normal leading-relaxed">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Portfolio Link */}
              {selectedApp.portfolioUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Portfolio / Work Sample</span>
                  <div>
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> {selectedApp.portfolioUrl}
                    </a>
                  </div>
                </div>
              )}

              {/* Stage Transition Control */}
              <div className="pt-2 border-t space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Move Stage</span>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((st) => (
                    <Button
                      key={st.key}
                      size="sm"
                      variant={selectedApp.stage === st.key ? "default" : "outline"}
                      onClick={() => handleStageMove(selectedApp.id, st.key)}
                      className={cn("text-xs font-bold h-7 capitalize", selectedApp.stage === st.key && "shadow-xs")}
                    >
                      {st.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
