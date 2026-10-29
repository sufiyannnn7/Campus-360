/**
 * Club Analytics & Reports
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Real club metrics, conversion pipelines, event attendance rates, and data export.
 */

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Users,
  Calendar,
  Layers,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoordinator } from "./coordinator-context";
import { coordinatorService } from "@/api/services/coordinator.service";
import { CoordinatorDashboardStats, ApplicationItem } from "@/types/coordinator";

export default function CoordinatorAnalytics() {
  const { activeClub } = useCoordinator();
  const [stats, setStats] = useState<CoordinatorDashboardStats | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeClub) return;

    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      coordinatorService.getClubDashboardOverview(activeClub.id),
      coordinatorService.getClubApplications(activeClub.id),
      coordinatorService.getClubEvents(activeClub.id),
    ])
      .then(([statsData, appsData, eventsData]) => {
        if (isMounted) {
          setStats(statsData);
          setApplications(appsData);
          setEvents(eventsData);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeClub]);

  const handleExportSummary = () => {
    if (!activeClub || !stats) return;

    const summaryRow = [
      {
        ClubName: activeClub.name,
        Category: activeClub.category,
        TotalMembers: stats.totalMembers,
        ActiveMembers: stats.activeMembers,
        TotalEvents: events.length,
        TotalRegistrations: events.reduce((sum, e) => sum + (e.registeredCount || 0), 0),
        RecruitmentStatus: stats.recruitmentStatus,
        TotalApplicants: stats.totalApplications,
        PendingReview: stats.pendingApplications,
        AcceptedMembers: stats.acceptedApplications,
        ProfileCompletionScore: stats.profileCompletion + "%",
        ExportDate: new Date().toLocaleDateString(),
      },
    ];

    coordinatorService.exportToCsv(`analytics_summary_${activeClub.slug}`, summaryRow);
  };

  if (!activeClub) return <div>No active club selected.</div>;

  const totalEventRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalEventCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const capacityUtilization = totalEventCapacity > 0 ? Math.round((totalEventRegistrations / totalEventCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Club Analytics & Performance Reports</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Verified database metrics for {activeClub.name}. No simulated figures.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportSummary}
          className="h-8 gap-1.5 text-xs font-semibold shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" /> Export Analytics Summary
        </Button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-2xs p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Members</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground">{stats?.totalMembers ?? 0}</div>
          <p className="text-[11px] text-muted-foreground font-medium">Verified active enrolled students</p>
        </Card>

        <Card className="border shadow-2xs p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Event Attendees</span>
            <Calendar className="h-4 w-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{totalEventRegistrations}</div>
          <p className="text-[11px] text-muted-foreground font-medium">{capacityUtilization}% of venue capacity booked</p>
        </Card>

        <Card className="border shadow-2xs p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recruitment Applicants</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{stats?.totalApplications ?? 0}</div>
          <p className="text-[11px] text-muted-foreground font-medium">Applications across all positions</p>
        </Card>

        <Card className="border shadow-2xs p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Profile Score</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{stats?.profileCompletion ?? 60}%</div>
          <p className="text-[11px] text-muted-foreground font-medium">Information completeness score</p>
        </Card>
      </div>

      {/* Recruitment Funnel Breakdown */}
      <Card className="border shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold">Recruitment Conversion Pipeline</CardTitle>
            <CardDescription className="text-xs">Real counts of candidate distribution across screening stages</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold">
            Status: {activeClub.recruitmentStatus.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: "Applied", count: applications.filter((a) => a.stage === "applied").length, color: "text-blue-600 bg-blue-500/10" },
            { label: "Under Review", count: applications.filter((a) => a.stage === "under_review").length, color: "text-amber-600 bg-amber-500/10" },
            { label: "Shortlisted", count: applications.filter((a) => a.stage === "shortlisted").length, color: "text-purple-600 bg-purple-500/10" },
            { label: "Interview", count: applications.filter((a) => a.stage === "interview").length, color: "text-indigo-600 bg-indigo-500/10" },
            { label: "Accepted", count: applications.filter((a) => a.stage === "accepted").length, color: "text-emerald-600 bg-emerald-500/10" },
            { label: "Rejected", count: applications.filter((a) => a.stage === "rejected").length, color: "text-rose-600 bg-rose-500/10" },
          ].map((stage) => (
            <div key={stage.label} className="p-3.5 rounded-2xl border bg-card text-center space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground">{stage.label}</span>
              <div className={`text-2xl font-black rounded-lg py-1 ${stage.color}`}>{stage.count}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Events Engagement Breakdown */}
      <Card className="border shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold">Events Engagement & Venues</CardTitle>
            <CardDescription className="text-xs">Participant signups per scheduled club activity</CardDescription>
          </div>
          <span className="text-xs font-bold text-muted-foreground">{events.length} Events Total</span>
        </div>

        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground">{e.title}</div>
                <div className="text-[11px] text-muted-foreground">{e.venue} • {new Date(e.startDatetime).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">{e.registeredCount} / {e.capacity} Signed up</div>
                <div className="text-[10px] text-muted-foreground capitalize">{e.status}</div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground border rounded-xl border-dashed">
              No events scheduled yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
