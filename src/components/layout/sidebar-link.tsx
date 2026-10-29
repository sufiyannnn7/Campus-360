/**
 * Reusable Sidebar Navigation Link
 */

import React from "react";
import { Link, useLocation } from "wouter";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  badge?: string | number;
}

export function SidebarLink({ href, icon: Icon, label, onClick, badge }: SidebarLinkProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/dashboard" && location.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl px-3 py-2 transition-all text-xs font-semibold group",
        isActive
          ? "bg-primary text-primary-foreground shadow-xs font-bold"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary-foreground")} />
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
            isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export default SidebarLink;
