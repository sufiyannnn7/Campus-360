/**
 * Events Service
 * 
 * Supports Supabase events query & registration, with offline mock fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { EventItem, EventFilterParams, EventRegistrationPayload } from "@/types/events";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { UPCOMING_EVENTS_DATA } from "@/data/landing-data";

function getLocalCustomEvents(): EventItem[] {
  try {
    return JSON.parse(localStorage.getItem("campus360_custom_events") || "[]");
  } catch {
    return [];
  }
}

function mapLandingEventToEventItem(e: any): EventItem {
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    category: e.category,
    venue: e.venue,
    organizer: e.organizer,
    bannerUrl: e.image,
    posterUrl: e.image,
    registeredCount: e.attendeesCount || 0,
    seatsLeft: e.spotsLeft,
    status: "upcoming",
  };
}

const DEFAULT_MOCK_EVENTS: EventItem[] = UPCOMING_EVENTS_DATA.map(mapLandingEventToEventItem);

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
    venue: row.venue_name || row.venues?.name || "Main Campus Auditorium",
    organizer: row.organizer_name || "Campus 360",
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
    galleryUrls: row.gallery_urls || [],
  };
}

export const eventsService = {
  async listEvents(params?: EventFilterParams): Promise<EventItem[]> {
    const localEvents = getLocalCustomEvents();

    if (!isSupabaseConfigured()) {
      return [...localEvents, ...DEFAULT_MOCK_EVENTS];
    }

    try {
      let query: any = supabase.from("events").select("*, venues(name, building, floor)");

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

      const res: any = await query;
      let data: any = res.data;
      let error: any = res.error;

      if (error) {
        // Fallback without venue join
        const retry: any = await supabase.from("events").select("*").order("start_datetime", { ascending: true });
        data = retry.data;
        error = retry.error;
      }

      if (error || !data || data.length === 0) {
        return [...localEvents, ...DEFAULT_MOCK_EVENTS];
      }

      // Check current user registrations to flag isRegistered
      let registeredEventIds = new Set<number>();
      try {
        const { data: { user } } = await supabase.auth.getUser();
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
      } catch {}

      const dbEvents = (data || []).map((row: any) => mapRowToEventItem(row, registeredEventIds.has(row.id)));
      const combined = [...localEvents, ...dbEvents];
      const seen = new Set<number>();
      const deduped: EventItem[] = [];

      for (const item of combined) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          deduped.push(item);
        }
      }

      return deduped.length > 0 ? deduped : DEFAULT_MOCK_EVENTS;
    } catch (err: any) {
      console.warn("Failed to load events from Supabase, returning local data:", err);
      return [...localEvents, ...DEFAULT_MOCK_EVENTS];
    }
  },

  async getEventById(id: string | number): Promise<EventItem> {
    const numericId = Number(id);

    // 1. Check local custom events first
    const localEvents = getLocalCustomEvents();
    const localFound = localEvents.find((e) => e.id === numericId || String(e.id) === String(id));
    if (localFound) return localFound;

    // 2. Check Supabase
    if (isSupabaseConfigured()) {
      try {
        const res: any = await supabase
          .from("events")
          .select("*, venues(*)")
          .eq("id", numericId)
          .maybeSingle();

        let data: any = res.data;
        let error: any = res.error;

        if (error || !data) {
          const retry: any = await supabase.from("events").select("*").eq("id", numericId).maybeSingle();
          data = retry.data;
        }

        if (data) {
          let isRegistered = false;
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: reg } = await supabase
                .from("event_registrations")
                .select("id")
                .eq("event_id", numericId)
                .eq("user_id", user.id)
                .neq("status", "cancelled")
                .maybeSingle();
              isRegistered = Boolean(reg);
            }
          } catch {}

          return mapRowToEventItem(data, isRegistered);
        }
      } catch (err) {
        console.warn("Supabase getEventById error:", err);
      }
    }

    // 3. Fallback to mock data
    const mock = DEFAULT_MOCK_EVENTS.find((e) => e.id === numericId || String(e.id) === String(id));
    if (mock) return mock;

    throw new Error(`Event #${id} not found.`);
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
