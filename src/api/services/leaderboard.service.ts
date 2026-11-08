/**
 * Leaderboard Service
 * 
 * Queries Supabase profiles ranked by gamification points, with offline fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { LeaderboardEntry } from "@/types/leaderboard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const leaderboardService = {
  async getLeaderboard(params?: any): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<LeaderboardEntry[]>(API_ENDPOINTS.LEADERBOARD.LIST, { params });
    }

    try {
      const limit = params?.limit || 50;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, department, year, points, events_attended, badges_count, avatar_url")
        .order("points", { ascending: false })
        .limit(limit);

      if (error) {
        console.warn("Supabase getLeaderboard error, using fallback:", error.message);
        return apiClient.get<LeaderboardEntry[]>(API_ENDPOINTS.LEADERBOARD.LIST, { params });
      }

      if (!data || data.length === 0) {
        return apiClient.get<LeaderboardEntry[]>(API_ENDPOINTS.LEADERBOARD.LIST, { params });
      }

      return (data || []).map((row, index) => ({
        rank: index + 1,
        userId: row.id,
        name: row.name,
        department: row.department || "General",
        year: row.year || undefined,
        points: row.points ?? 0,
        totalPoints: row.points ?? 0,
        eventsAttended: row.events_attended ?? 0,
        badgesCount: row.badges_count ?? 0,
        badgeCount: row.badges_count ?? 0,
        avatarUrl: row.avatar_url || undefined,
        change: "same",
      }));
    } catch (err: any) {
      console.warn("Failed to load leaderboard from Supabase, using fallback:", err?.message);
      return apiClient.get<LeaderboardEntry[]>(API_ENDPOINTS.LEADERBOARD.LIST, { params });
    }
  },
};

export default leaderboardService;
