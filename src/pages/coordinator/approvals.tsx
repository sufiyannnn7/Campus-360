/**
 * Coordinator Approval Submissions & Decision History
 * Campus 360 - NKOCET, Team NEXUS
 *
 * View status of submitted profile and event approval requests with Administrator feedback.
 */

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Building2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoordinator } from "./coordinator-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ApprovalRequestItem } from "@/types/coordinator";

export default function CoordinatorApprovals() {
  const { activeClub } = useCoordinator();
  const [requests, setRequests] = useState<ApprovalRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeClub) return;

    if (!isSupabaseConfigured()) {
      setRequests([
        {
          id: 1,
          clubId: activeClub.id,
          submittedBy: "Coordinator",
          requestType: "profile_update",
          status: "pending",
          payload: { summary: "Updated club mission statement and meeting venue to IT Block" },
          adminNotes: undefined,
          createdAt: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
      return;
    }

    supabase
      .from("approval_requests")
      .select("*")
      .eq("club_id", activeClub.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setRequests(
            data.map((r: any) => ({
              id: r.id,
              clubId: r.club_id,
              submittedBy: r.submitted_by,
              requestType: r.request_type,
              status: r.status,
              payload: r.payload,
              adminNotes: r.admin_notes || undefined,
              reviewedBy: r.reviewed_by || undefined,
              reviewedAt: r.reviewed_at || undefined,
              createdAt: r.created_at,
            }))
          );
        }
        setIsLoading(false);
      });
  }, [activeClub]);

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">Admin Approval Submissions</h2>
        <p className="text-xs text-muted-foreground font-medium">
          Track the status of submitted profile adjustments and event launches awaiting Administrator review.
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <Card key={req.id} className="border shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-bold uppercase">
                  {req.requestType.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Submitted {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>

              <Badge
                className={
                  req.status === "approved"
                    ? "bg-emerald-600 text-white font-bold text-[10px]"
                    : req.status === "rejected"
                    ? "bg-destructive text-white font-bold text-[10px]"
                    : req.status === "changes_requested"
                    ? "bg-amber-500 text-white font-bold text-[10px]"
                    : "bg-muted text-muted-foreground font-bold text-[10px]"
                }
              >
                {req.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            <div className="p-3 rounded-xl border bg-muted/20 text-xs text-foreground font-mono">
              {typeof req.payload === "object" ? JSON.stringify(req.payload, null, 2) : String(req.payload)}
            </div>

            {req.adminNotes && (
              <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-200 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Admin Feedback: </span>
                {req.adminNotes}
              </div>
            )}
          </Card>
        ))}

        {requests.length === 0 && !isLoading && (
          <div className="p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
            <FileCheck2 className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="font-bold text-sm">No pending approval requests</div>
            <p>Major profile updates submitted from the editor will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
