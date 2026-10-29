/**
 * Events Service
 * 
 * Supports Supabase events query & registration, with offline mock fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { EventItem, EventFilterParams, EventRegistrationPayload } from "@/types/events";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function mapRowToEventItem(row: any, isRegistered = false): EventItem {
  const startDate = row.start_datetime ? new Date(row.start_datetime) : new Date();
  const dateFormatted = !isNaN(startDate.getTime())
    ? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  const timeFormatted = !isNaN(startDate.getTime())
    ? startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "";

  return {
    id: row.id,
    title: row.title,
    tagline: row.tagline || undefined,
    description: row.description || undefined,
    date: dateFormatted,
    time: timeFormatted,
    startDatetime: row.start_datetime,
    endDatetime: row.end_datetime || undefined,
    category: row.category,
    venue: row.venue_name || row.venues?.name || "Campus Main Hall",
    organizer: row.organizer_name,
    organizerClubId: row.organizer_club_id || undefined,
    bannerUrl: row.banner_url || undefined,
    posterUrl: row.poster_url || undefined,
    capacity: row.capacity || undefined,
    registeredCount: row.registered_count ?? 0,
    seatsLeft: row.capacity ? Math.max(0, row.capacity - (row.registered_count ?? 0)) : undefined,
    isRegistered,
    registrationDeadline: row.registration_deadline || undefined,
    tags: row.tags || [],
    schedule: row.schedule || [],
    coordinators: row.coordinators || [],
    prizes: row.prizes || [],
    status: row.status,
  };
}

export const eventsService = {
  async listEvents(params?: EventFilterParams): Promise<EventItem[]> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<EventItem[]>(API_ENDPOINTS.EVENTS.LIST, { params });
    }

    try {
      let query = supabase.from("events").select("*, venues(name, building, floor)");

      if (params?.category && params.category !== "All") {
        query = query.eq("category", params.category as any);
      }
      if (params?.status) {
        query = query.eq("status", params.status as any);
      }
      if (params?.q) {
        query = query.ilike("title", `%${params.q}%`);
      }
      if (params?.limit) {
        query = query.limit(params.limit);
      }

      query = query.order("start_datetime", { ascending: true });

      const { data, error } = await query;
      if (error) {
        console.error("Supabase listEvents error:", error);
        throw new Error(error.message);
      }

      // Check current user registrations to flag isRegistered
      const { data: { user } } = await supabase.auth.getUser();
      let registeredEventIds = new Set<number>();

      if (user) {
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", user.id)
          .neq("status", "cancelled");

        if (regs) {
          registeredEventIds = new Set(regs.map((r) => r.event_id));
        }
      }

      return (data || []).map((row) => mapRowToEventItem(row, registeredEventIds.has(row.id)));
    } catch (err: any) {
      console.error("Failed to load events from Supabase:", err);
      throw err;
    }
  },

  async getEventById(id: string | number): Promise<EventItem> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<EventItem>(API_ENDPOINTS.EVENTS.DETAIL(id));
    }

    const numericId = Number(id);
    const { data, error } = await supabase
      .from("events")
      .select("*, venues(*)")
      .eq("id", numericId)
      .single();

    if (error || !data) {
      throw new Error(error?.message || `Event #${id} not found.`);
    }

    const { data: { user } } = await supabase.auth.getUser();
    let isRegistered = false;

    if (user) {
      const { data: reg } = await supabase
        .from("event_registrations")
        .select("id, status")
        .eq("event_id", numericId)
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .maybeSingle();

      isRegistered = Boolean(reg);
    }

    return mapRowToEventItem(data, isRegistered);
  },

  async registerEvent(id: string | number, payload?: EventRegistrationPayload): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.EVENTS.REGISTER(id), payload);
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("You must be logged in to register for this event.");
    }

    const numericId = Number(id);
    const verificationCode = `CAMPUS-${numericId}-${user.id.slice(0, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from("event_registrations")
      .upsert(
        {
          event_id: numericId,
          user_id: user.id,
          participant_name: payload?.participantName || user.user_metadata?.name || null,
          participant_email: payload?.participantEmail || user.email || null,
          department: payload?.department || null,
          year: payload?.year || null,
          roll_number: payload?.rollNumber || null,
          status: "registered",
          qr_code: verificationCode,
        },
        { onConflict: "event_id,user_id" }
      )
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, registration: data };
  },

  async cancelRegistration(id: string | number): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.EVENTS.CANCEL(id));
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("Must be logged in to cancel registration.");
    }

    const numericId = Number(id);
    const { data, error } = await supabase
      .from("event_registrations")
      .update({ status: "cancelled" })
      .eq("event_id", numericId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Registration cancelled." };
  },
};

export default eventsService;
