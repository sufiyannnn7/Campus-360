/**
 * News Service
 * 
 * Supports Supabase news query with offline mock fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { NewsArticle, NewsFilterParams } from "@/types/news";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
    if (!isSupabaseConfigured()) {
      return apiClient.get<NewsArticle[]>(API_ENDPOINTS.NEWS.LIST, { params });
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
        console.error("Supabase listNews error:", error);
        throw new Error(error.message);
      }

      return (data || []).map(mapRowToNewsArticle);
    } catch (err: any) {
      console.error("Failed to load news from Supabase:", err);
      throw err;
    }
  },

  async getNewsById(id: string | number): Promise<NewsArticle> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<NewsArticle>(API_ENDPOINTS.NEWS.DETAIL(id));
    }

    const numericId = Number(id);
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("id", numericId)
      .eq("is_published", true)
      .single();

    if (error || !data) {
      throw new Error(error?.message || `Article #${id} not found.`);
    }

    return mapRowToNewsArticle(data);
  },
};

export default newsService;
