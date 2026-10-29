/**
 * Clubs Service
 * 
 * Supports Supabase club exploration and membership, with offline mock fallback.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ClubItem, ClubFilterParams, ClubMember } from "@/types/clubs";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function mapRowToClubItem(row: any, isJoined = false, leads: ClubMember[] = []): ClubItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    tagline: row.tagline,
    description: row.description || undefined,
    logoUrl: row.logo_url || undefined,
    bannerUrl: row.banner_url || undefined,
    memberCount: row.member_count ?? 0,
    establishedYear: row.established_year || undefined,
    facultyAdvisor: row.faculty_advisor || undefined,
    socialLinks: row.social_links || undefined,
    tags: row.tags || [],
    isJoined,
    leads: leads.length > 0 ? leads : undefined,
  };
}

export const clubsService = {
  async listClubs(params?: ClubFilterParams): Promise<ClubItem[]> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<ClubItem[]>(API_ENDPOINTS.CLUBS.LIST, { params });
    }

    try {
      let query = supabase.from("clubs").select("*").eq("is_active", true);

      if (params?.category && params.category !== "All") {
        query = query.eq("category", params.category as any);
      }
      if (params?.q) {
        query = query.ilike("name", `%${params.q}%`);
      }
      if (params?.limit) {
        query = query.limit(params.limit);
      }

      query = query.order("member_count", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("Supabase listClubs error:", error);
        throw new Error(error.message);
      }

      const { data: { user } } = await supabase.auth.getUser();
      let joinedClubIds = new Set<number>();

      if (user) {
        const { data: memberships } = await supabase
          .from("club_members")
          .select("club_id")
          .eq("user_id", user.id);

        if (memberships) {
          joinedClubIds = new Set(memberships.map((m) => m.club_id));
        }
      }

      const customClubs: ClubItem[] = JSON.parse(localStorage.getItem("campus360_custom_clubs") || "[]");
      const dbClubs = (data || []).map((row) => mapRowToClubItem(row, joinedClubIds.has(row.id)));
      
      const all = [...customClubs, ...dbClubs];
      const seen = new Set<string>();
      return all.filter((c) => {
        if (seen.has(c.name.toLowerCase())) return false;
        seen.add(c.name.toLowerCase());
        return true;
      });
    } catch (err: any) {
      console.warn("Failed to load clubs from Supabase, using mock clubs + custom clubs:", err);
      const mockList = await apiClient.get<ClubItem[]>(API_ENDPOINTS.CLUBS.LIST, { params });
      const customClubs: ClubItem[] = JSON.parse(localStorage.getItem("campus360_custom_clubs") || "[]");
      return [...customClubs, ...mockList];
    }
  },

  async getClubById(id: string | number): Promise<ClubItem> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<ClubItem>(API_ENDPOINTS.CLUBS.DETAIL(id));
    }

    const numericId = Number(id);
    const { data: club, error: clubErr } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", numericId)
      .single();

    if (clubErr || !club) {
      throw new Error(clubErr?.message || `Club #${id} not found.`);
    }

    // Fetch leads
    const { data: leadRows } = await supabase
      .from("club_members")
      .select("id, role, profiles(id, name, department, avatar_url)")
      .eq("club_id", numericId)
      .eq("role", "lead");

    const leads: ClubMember[] = (leadRows || []).map((lr: any) => ({
      id: lr.profiles?.id || lr.id,
      name: lr.profiles?.name || "Lead Member",
      role: lr.role,
      avatarUrl: lr.profiles?.avatar_url || undefined,
      department: lr.profiles?.department || undefined,
    }));

    // Check if current user joined
    const { data: { user } } = await supabase.auth.getUser();
    let isJoined = false;

    if (user) {
      const { data: membership } = await supabase
        .from("club_members")
        .select("id")
        .eq("club_id", numericId)
        .eq("user_id", user.id)
        .maybeSingle();

      isJoined = Boolean(membership);
    }

    return mapRowToClubItem(club, isJoined, leads);
  },

  async joinClub(id: string | number): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.CLUBS.JOIN(id));
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("You must be logged in to join a club.");
    }

    const numericId = Number(id);
    const { data, error } = await supabase
      .from("club_members")
      .insert({
        club_id: numericId,
        user_id: user.id,
        role: "member",
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, membership: data };
  },

  async leaveClub(id: string | number): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.CLUBS.LEAVE(id));
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("Must be logged in to leave a club.");
    }

    const numericId = Number(id);
    const { error } = await supabase
      .from("club_members")
      .delete()
      .eq("club_id", numericId)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Left club successfully." };
  },

  async createClub(payload: {
    name: string;
    category: string;
    tagline?: string;
    description?: string;
    facultyAdvisor?: string;
    bannerUrl?: string;
    logoUrl?: string;
  }): Promise<ClubItem> {
    const slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const localNewClub: ClubItem = {
      id: Date.now(),
      name: payload.name,
      slug,
      category: payload.category as any,
      tagline: payload.tagline || `${payload.name} at NKOCET`,
      description: payload.description || "Active student organization at NKOCET.",
      memberCount: 1,
      facultyAdvisor: payload.facultyAdvisor,
      bannerUrl: payload.bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",
      logoUrl: payload.logoUrl || "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200",
      isJoined: true,
    };

    const stored: ClubItem[] = JSON.parse(localStorage.getItem("campus360_custom_clubs") || "[]");
    stored.unshift(localNewClub);
    localStorage.setItem("campus360_custom_clubs", JSON.stringify(stored));

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("clubs")
          .insert({
            name: payload.name,
            slug,
            category: payload.category as any,
            tagline: payload.tagline || `${payload.name} at NKOCET`,
            description: payload.description || "",
            faculty_advisor: payload.facultyAdvisor || null,
            banner_url: payload.bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",
            logo_url: payload.logoUrl || "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200",
            member_count: 1,
            is_active: true,
          })
          .select()
          .maybeSingle();

        if (!error && data) {
          return mapRowToClubItem(data, true);
        }
      } catch (err) {
        console.warn("Supabase createClub insert warning, using local club:", err);
      }
    }

    return localNewClub;
  },
};

export default clubsService;
