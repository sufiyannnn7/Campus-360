/**
 * Global Search Service
 * 
 * Searches across events, clubs, and news in Supabase, with offline mock fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA, LATEST_NEWS_DATA } from "@/data/landing-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const searchService = {
  async globalSearch(query: string): Promise<any> {
    if (!query?.trim()) {
      return { events: [], clubs: [], news: [] };
    }

    const q = query.trim();

    if (!isSupabaseConfigured()) {
      try {
        return await apiClient.get(API_ENDPOINTS.SEARCH.GLOBAL, {
          params: { q },
        });
      } catch {
        const lowerQ = q.toLowerCase();
        const events = UPCOMING_EVENTS_DATA.filter((e) =>
          e.title.toLowerCase().includes(lowerQ) || e.venue.toLowerCase().includes(lowerQ) || e.organizer.toLowerCase().includes(lowerQ)
        );
        const clubs = FEATURED_CLUBS_DATA.filter((c) =>
          c.name.toLowerCase().includes(lowerQ) || c.category.toLowerCase().includes(lowerQ) || c.tagline.toLowerCase().includes(lowerQ)
        );
        const news = LATEST_NEWS_DATA.filter((n) =>
          n.title.toLowerCase().includes(lowerQ) || n.category.toLowerCase().includes(lowerQ) || n.excerpt.toLowerCase().includes(lowerQ)
        );
        return { events, clubs, news };
      }
    }

    try {
      const [eventsRes, clubsRes, newsRes] = await Promise.all([
        supabase.from("events").select("id, title, category, venue_name, start_datetime").ilike("title", `%${q}%`).limit(10),
        supabase.from("clubs").select("id, name, category, tagline, logo_url").ilike("name", `%${q}%`).limit(10),
        supabase.from("news_articles").select("id, title, category, summary, published_at").ilike("title", `%${q}%`).limit(10),
      ]);

      const events = (eventsRes.data || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        venue: e.venue_name || "Campus",
        date: e.start_datetime ? new Date(e.start_datetime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      }));

      const clubs = (clubsRes.data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        tagline: c.tagline,
        logoUrl: c.logo_url,
      }));

      const news = (newsRes.data || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        category: n.category,
        excerpt: n.summary,
      }));

      return { events, clubs, news };
    } catch (err) {
      console.error("Supabase search query failed:", err);
      throw err;
    }
  },
};

export default searchService;
