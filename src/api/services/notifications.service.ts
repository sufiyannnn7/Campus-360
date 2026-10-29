/**
 * Notifications Service
 * 
 * Supports Supabase notifications query, single read update, and bulk mark-all-read RPC.
 * Falls back to mock data when Supabase credentials are not present.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { CampusNotification, NotificationType } from "@/types/notifications";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return isoString;
  }
}

function mapRowToNotification(row: any): CampusNotification {
  return {
    id: row.id,
    title: row.title,
    message: row.body,
    type: (row.type as NotificationType) || "system",
    timestamp: formatTimestamp(row.created_at),
    isRead: Boolean(row.read_status),
    actionUrl: row.action_url || undefined,
  };
}

export const notificationsService = {
  async listNotifications(params?: any): Promise<CampusNotification[]> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<CampusNotification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase listNotifications error:", error);
        throw new Error(error.message);
      }

      return (data || []).map(mapRowToNotification);
    } catch (err: any) {
      console.error("Failed to load notifications from Supabase:", err);
      throw err;
    }
  },

  async markNotificationRead(id: string | number): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("Must be logged in to update notifications.");
    }

    const numericId = Number(id);
    const { error } = await supabase
      .from("notifications")
      .update({ read_status: true })
      .eq("id", numericId)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },

  async markAllNotificationsRead(): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("Must be logged in to mark all notifications read.");
    }

    const { error } = await supabase.rpc("mark_all_notifications_read");

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },
};

export default notificationsService;
