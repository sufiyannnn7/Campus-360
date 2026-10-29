/**
 * Authentication and User Session State Management
 * 
 * Provides centralized context for user session, active roles,
 * authentication mutations, and demo role switching.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, LoginCredentials, SignupPayload } from "@/types/auth";
import { authService } from "@/api/services/auth.service";
import { STORAGE_KEYS, USER_ROLES } from "@/config/constants";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem("campus360_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const cached = localStorage.getItem("campus360_user");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.role) return parsed.role as UserRole;
      }
    } catch {}
    return (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole) || USER_ROLES.STUDENT;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getMe();
      if (currentUser) {
        setUser(currentUser);
        setRole(currentUser.role || USER_ROLES.STUDENT);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user session:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchCurrentUser();
        } else {
          setUser(null);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [role]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const res = await authService.login(credentials);
      if (res?.user) {
        setUser(res.user);
        setRole(res.user.role);
      } else {
        await fetchCurrentUser();
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast.success("Successfully logged in!");
    } catch (err: any) {
      toast.error(err.message || "Failed to log in");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: SignupPayload) => {
    try {
      setIsLoading(true);
      const res = await authService.signup(payload);
      if (res?.emailConfirmationRequired) {
        toast.info("Account created! Please check your email to confirm your account before logging in.");
        return;
      }
      if (res?.user) {
        setUser(res.user);
        setRole(res.user.role);
      } else {
        await fetchCurrentUser();
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast.success("Account created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries();
      toast.info("Logged out successfully");
    } catch (err: any) {
      toast.error(err.message || "Logout encountered an error");
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, newRole);
    setRole(newRole);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    toast.info(`Switched view to: ${newRole.toUpperCase()}`);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchDemoRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
