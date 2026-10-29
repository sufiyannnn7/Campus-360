/**
 * Dashboard Service
 * 
 * Aggregates role-specific metrics from Supabase, with offline fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dashboardService = {
  async getStudentDashboard(): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.get(API_ENDPOINTS.DASHBOARD.STUDENT);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return apiClient.get(API_ENDPOINTS.DASHBOARD.STUDENT);
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("points, badges_count, events_attended")
        .eq("id", user.id)
        .maybeSingle();

      // Fetch recent registered events
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("event_id, events(*)")
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .limit(3);

      const registeredEvents = (regs || [])
        .map((r: any) => r.events)
        .filter(Boolean)
        .map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.start_datetime ? new Date(e.start_datetime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
          venue: e.venue_name || "Campus",
          category: e.category,
        }));

      // Fetch joined clubs
      const { data: memberships } = await supabase
        .from("club_members")
        .select("club_id, clubs(*)")
        .eq("user_id", user.id)
        .limit(3);

      const joinedClubs = (memberships || [])
        .map((m: any) => m.clubs)
        .filter(Boolean)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          memberCount: c.member_count,
        }));

      // Fetch certificates count
      const { count: certCount } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      return {
        registeredEvents,
        joinedClubs,
        points: profile?.points ?? 0,
        certificatesCount: certCount ?? 0,
        attendanceRate: profile?.events_attended ? "95%" : "N/A",
      };
    } catch (err) {
      console.error("Supabase student dashboard error, using fallback:", err);
      return apiClient.get(API_ENDPOINTS.DASHBOARD.STUDENT);
    }
  },

  async getAdminDashboard(): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN);
    }

    try {
      const [studentsRes, clubsRes, eventsRes, appsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("clubs").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("recruitment_applications").select("*", { count: "exact", head: true }).eq("stage", "applied"),
      ]);

      return {
        totalStudents: studentsRes.count ?? 0,
        activeClubs: clubsRes.count ?? 0,
        upcomingEvents: eventsRes.count ?? 0,
        pendingApprovals: appsRes.count ?? 0,
      };
    } catch (err) {
      console.error("Supabase admin dashboard error, using fallback:", err);
      return apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN);
    }
  },
};

export default dashboardService;
