/**
 * Reusable Empty State View Component
 */

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { Link } from "wouter";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-3xl bg-card/40 my-6">
      <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon || <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-black tracking-tight text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="font-bold text-xs shadow-sm">
            {actionLabel}
          </Button>
        </Link>
      )}

      {actionLabel && onAction && !actionHref && (
        <Button size="sm" onClick={onAction} className="font-bold text-xs shadow-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
