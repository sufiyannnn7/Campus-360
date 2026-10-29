/**
 * User Profile & Role Switcher Menu Component
 */

import React from "react";
import { Link, useLocation } from "wouter";
import { User, LogOut, Shield, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { USER_ROLES, ROLE_LABELS, UserRoleType } from "@/config/constants";
import { User as UserType } from "@/types/auth";

export interface UserMenuProps {
  user: UserType;
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout, switchDemoRole, role: activeRole } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2.5 hover:bg-sidebar-accent h-12 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-2.5 overflow-hidden text-left">
            <Avatar className="h-8 w-8 rounded-lg border">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-black rounded-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs overflow-hidden">
              <span className="font-bold truncate text-foreground leading-tight">{user.name}</span>
              <span className="text-[10px] text-muted-foreground truncate capitalize">
                {ROLE_LABELS[user.role as UserRoleType] || user.role}
              </span>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-transform" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl">
        <div className="p-2 space-y-1">
          <p className="font-black text-xs text-foreground leading-none">{user.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 text-xs font-semibold cursor-pointer rounded-lg px-2 py-1.5">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold text-destructive focus:text-destructive cursor-pointer rounded-lg px-2 py-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
