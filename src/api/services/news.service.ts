/**
 * News Service
 * 
 * Supports Supabase news query with offline mock fallback.
 */

import { NewsArticle, NewsFilterParams } from "@/types/news";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LATEST_NEWS_DATA } from "@/data/landing-data";

function getLocalCustomNews(): NewsArticle[] {
  try {
    return JSON.parse(localStorage.getItem("campus360_custom_news") || "[]");
  } catch {
    return [];
  }
}

function saveLocalCustomNews(articles: NewsArticle[]) {
  try {
    localStorage.setItem("campus360_custom_news", JSON.stringify(articles));
  } catch {}
}

function mapRowToNewsArticle(row: any): NewsArticle {
  const pubDate = row.published_at ? new Date(row.published_at) : new Date();
  const dateFormatted = !isNaN(pubDate.getTime())
    ? pubDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return {
    id: row.id,
    title: row.title,
    summary: row.summary || undefined,
    excerpt: row.summary || undefined,
    content: row.content || undefined,
    body: row.content || undefined,
    category: row.category || undefined,
    author: row.author || undefined,
    authorRole: row.author_role || undefined,
    authorAvatar: row.author_avatar || undefined,
    clubId: row.club_id || undefined,
    clubName: row.club_name || undefined,
    createdBy: row.created_by || undefined,
    publishedAt: row.published_at,
    date: dateFormatted,
    imageUrl: row.image_url || undefined,
    readTime: row.read_time || "3 min read",
    isImportant: row.is_important ?? false,
    tags: row.tags || [],
  };
}

export const newsService = {
  async listNews(params?: NewsFilterParams): Promise<NewsArticle[]> {
    const localCustom = getLocalCustomNews();

    if (!isSupabaseConfigured()) {
      return [...localCustom, ...LATEST_NEWS_DATA];
    }

    try {
      let query = supabase.from("news_articles").select("*").eq("is_published", true);

      if (params?.category && params.category !== "All") {
        query = query.eq("category", params.category);
      }
      if (params?.isImportant !== undefined) {
        query = query.eq("is_important", params.isImportant);
      }
      if (params?.q) {
        query = query.ilike("title", `%${params.q}%`);
      }
      if (params?.limit) {
        query = query.limit(params.limit);
      }

      query = query.order("published_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.warn("Supabase listNews error, returning local cache:", error.message);
        return [...localCustom, ...LATEST_NEWS_DATA];
      }

      const dbArticles = (data || []).map(mapRowToNewsArticle);
      const combined = [...localCustom, ...dbArticles];
      const seen = new Set<number>();
      const deduped: NewsArticle[] = [];

      for (const item of combined) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          deduped.push(item);
        }
      }

      return deduped.length > 0 ? deduped : LATEST_NEWS_DATA;
    } catch (err: any) {
      console.warn("Failed to load news from Supabase, returning local cache:", err?.message);
      return [...localCustom, ...LATEST_NEWS_DATA];
    }
  },

  async getNewsById(id: string | number): Promise<NewsArticle> {
    const numericId = Number(id);

    // 1. Check local custom news first
    const localCustom = getLocalCustomNews();
    const foundLocal = localCustom.find(a => a.id === numericId || String(a.id) === String(id));
    if (foundLocal) return foundLocal;

    // 2. Check Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("news_articles")
          .select("*")
          .eq("id", numericId)
          .eq("is_published", true)
          .maybeSingle();

        if (data && !error) {
          return mapRowToNewsArticle(data);
        }
      } catch (err) {
        console.warn("Supabase getNewsById fallback:", err);
      }
    }

    // 3. Check mock news data
    const mock = LATEST_NEWS_DATA.find((n) => n.id === numericId || String(n.id) === String(id));
    if (mock) return mock;

    throw new Error(`News article #${id} not found.`);
  },

  async deleteNews(id: string | number): Promise<void> {
    const numericId = Number(id);

    // Remove from local storage
    const current = getLocalCustomNews();
    saveLocalCustomNews(current.filter(n => n.id !== numericId && String(n.id) !== String(id)));

    // Remove from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from("news_articles").delete().eq("id", numericId);
        if (error) {
          console.warn("Supabase deleteNews notice:", error.message);
        }
      } catch (err) {
        console.warn("Error deleting news from Supabase:", err);
      }
    }
  },
};

export default newsService;
