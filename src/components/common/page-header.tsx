/**
 * Standardized Page Header Component
 */

import React, { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  backHref,
  backLabel = "Back",
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-6">
      <div className="space-y-1.5">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-semibold gap-1.5 -ml-2 mb-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{title}</h1>
          {badge && (
            <Badge variant="secondary" className="font-bold text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
