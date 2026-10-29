/**
 * Semantic Status Badge Component
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
  showIndicator?: boolean;
}

export function StatusBadge({ status, className, showIndicator = true }: StatusBadgeProps) {
  const s = (status || "").toLowerCase();

  let colorClasses = "bg-muted text-muted-foreground border-border";
  let isPulse = false;

  if (s === "live" || s === "active" || s === "open") {
    colorClasses = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    isPulse = s === "live";
  } else if (s === "upcoming" || s === "scheduled") {
    colorClasses = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  } else if (s === "filling fast" || s === "closing_soon") {
    colorClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  } else if (s === "completed" || s === "closed") {
    colorClasses = "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  } else if (s === "cancelled" || s === "revoked") {
    colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
  }

  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 gap-1.5", colorClasses, className)}
    >
      {showIndicator && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            s === "live" || s === "active" || s === "open"
              ? "bg-emerald-500"
              : s === "upcoming"
              ? "bg-blue-500"
              : s === "filling fast" || s === "closing_soon"
              ? "bg-amber-500"
              : s === "cancelled"
              ? "bg-destructive"
              : "bg-slate-400",
            isPulse && "animate-ping"
          )}
        />
      )}
      {status}
    </Badge>
  );
}

export default StatusBadge;
