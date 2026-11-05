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
    message: row.body || row.message,
    body: row.body || row.message,
    type: (row.type as NotificationType) || "system",
    timestamp: row.created_at ? formatTimestamp(row.created_at) : (row.timestamp || "Just now"),
    createdAt: row.created_at || new Date().toISOString(),
    isRead: Boolean(row.read_status ?? row.isRead),
    readStatus: Boolean(row.read_status ?? row.isRead),
    actionUrl: row.action_url || row.actionUrl || undefined,
  };
}

export const notificationsService = {
  async listNotifications(params?: any): Promise<CampusNotification[]> {
    let localNotifs: any[] = [];
    try {
      const cached = localStorage.getItem("campus360_user");
      const user = cached ? JSON.parse(cached) : null;
      const isAdmin = user?.role === "admin" || user?.email?.toLowerCase().trim() === "sufiyannnn7@gmail.com" || user?.email?.toLowerCase().trim() === "admin@nkocet.ac.in";
      if (isAdmin) {
        const adminList = JSON.parse(localStorage.getItem("campus360_admin_notifications") || "[]");
        localNotifs = [...localNotifs, ...adminList];
      }
      if (user?.id) {
        const userList = JSON.parse(localStorage.getItem(`campus360_user_notifications_${user.id}`) || "[]");
        localNotifs = [...localNotifs, ...userList];
      }
      if (user?.email) {
        const userListByEmail = JSON.parse(localStorage.getItem(`campus360_user_notifications_${user.email}`) || "[]");
        localNotifs = [...localNotifs, ...userListByEmail];
      }
      const genericStudent = JSON.parse(localStorage.getItem("campus360_student_notifications") || "[]");
      localNotifs = [...localNotifs, ...genericStudent];
    } catch {}

    const mappedLocal = localNotifs.map(mapRowToNotification);

    if (!isSupabaseConfigured()) {
      const remote = await apiClient.get<CampusNotification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params }).catch(() => []);
      const merged = [...mappedLocal, ...(Array.isArray(remote) ? remote.map(mapRowToNotification) : [])];
      const deletedIds: (string | number)[] = JSON.parse(localStorage.getItem("campus360_deleted_notifications") || "[]");
      const seen = new Set();
      return merged.filter(n => {
        if (deletedIds.includes(n.id) || seen.has(n.id)) return false;
        seen.add(n.id);
        return true;
      });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return mappedLocal;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase listNotifications error:", error);
        return mappedLocal;
      }

      const dbMapped = (data || []).map(mapRowToNotification);
      const merged = [...mappedLocal, ...dbMapped];
      const deletedIds: (string | number)[] = JSON.parse(localStorage.getItem("campus360_deleted_notifications") || "[]");
      const seen = new Set();
      return merged.filter(n => {
        if (deletedIds.includes(n.id) || seen.has(n.id)) return false;
        seen.add(n.id);
        return true;
      });
    } catch (err: any) {
      console.error("Failed to load notifications from Supabase:", err);
      return mappedLocal;
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

  async deleteNotification(id: string | number): Promise<void> {
    const numId = Number(id);

    try {
      const cached = localStorage.getItem("campus360_user");
      const user = cached ? JSON.parse(cached) : null;
      if (user?.role === "admin") {
        const adminList = JSON.parse(localStorage.getItem("campus360_admin_notifications") || "[]");
        localStorage.setItem("campus360_admin_notifications", JSON.stringify(adminList.filter((n: any) => n.id !== numId && n.id !== id)));
      }
      if (user?.id) {
        const userList = JSON.parse(localStorage.getItem(`campus360_user_notifications_${user.id}`) || "[]");
        localStorage.setItem(`campus360_user_notifications_${user.id}`, JSON.stringify(userList.filter((n: any) => n.id !== numId && n.id !== id)));
      }
      if (user?.email) {
        const userListEmail = JSON.parse(localStorage.getItem(`campus360_user_notifications_${user.email}`) || "[]");
        localStorage.setItem(`campus360_user_notifications_${user.email}`, JSON.stringify(userListEmail.filter((n: any) => n.id !== numId && n.id !== id)));
      }
      const genericStudent = JSON.parse(localStorage.getItem("campus360_student_notifications") || "[]");
      localStorage.setItem("campus360_student_notifications", JSON.stringify(genericStudent.filter((n: any) => n.id !== numId && n.id !== id)));

      const deletedIds: (string | number)[] = JSON.parse(localStorage.getItem("campus360_deleted_notifications") || "[]");
      deletedIds.push(id);
      localStorage.setItem("campus360_deleted_notifications", JSON.stringify(deletedIds));
    } catch {}

    if (isSupabaseConfigured() && Number.isInteger(numId) && numId < 1000000000) {
      try {
        await supabase.from("notifications").delete().eq("id", numId);
      } catch (err) {
        console.warn("Supabase delete notification error:", err);
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("campus360_notification_deleted", { detail: { id } }));
    }
  },

  async clearAllNotifications(): Promise<void> {
    try {
      localStorage.setItem("campus360_admin_notifications", "[]");
      localStorage.setItem("campus360_student_notifications", "[]");
      const cached = localStorage.getItem("campus360_user");
      const user = cached ? JSON.parse(cached) : null;
      if (user?.id) {
        localStorage.setItem(`campus360_user_notifications_${user.id}`, "[]");
      }
      if (user?.email) {
        localStorage.setItem(`campus360_user_notifications_${user.email}`, "[]");
      }
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("notifications").delete().eq("user_id", user.id);
        }
      } catch (err) {
        console.warn("Supabase clearAllNotifications error:", err);
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("campus360_notification_deleted", { detail: { id: "all" } }));
    }
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
