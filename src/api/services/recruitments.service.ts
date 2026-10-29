/**
 * Recruitments Service
 * 
 * Supports Supabase club recruitment listings and student application submissions.
 * Falls back to mock data when Supabase credentials are absent.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Recruitment, RecruitmentApplicationPayload } from "@/types/recruitments";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const recruitmentsService = {
  async listRecruitments(params?: any): Promise<Recruitment[]> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<Recruitment[]>(API_ENDPOINTS.RECRUITMENTS.LIST, { params });
    }

    try {
      const { data, error } = await supabase
        .from("recruitments")
        .select("*, clubs(name)")
        .eq("is_active", true)
        .order("deadline", { ascending: true });

      if (error) {
        console.error("Supabase listRecruitments error:", error);
        throw new Error(error.message);
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        clubId: row.club_id,
        clubName: row.clubs?.name || "Campus Club",
        role: row.role_title,
        department: row.department || undefined,
        description: row.description,
        requirements: row.requirements || [],
        deadline: row.deadline,
        positionsCount: row.positions_count || undefined,
        isOpen: row.status === "open" || row.status === "closing_soon",
        status: row.status,
        formFields: row.form_fields || undefined,
      }));
    } catch (err: any) {
      console.error("Failed to load recruitments from Supabase:", err);
      throw err;
    }
  },

  async applyRecruitment(id: string | number, data?: Partial<RecruitmentApplicationPayload>): Promise<any> {
    if (!isSupabaseConfigured()) {
      return apiClient.post(API_ENDPOINTS.RECRUITMENTS.APPLY(id), data);
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw new Error("You must be logged in to apply for a club recruitment.");
    }

    const numericId = Number(id);
    const { data: result, error } = await supabase
      .from("recruitment_applications")
      .insert({
        recruitment_id: numericId,
        applicant_id: user.id,
        applicant_name: data?.applicantName || user.user_metadata?.name || "Student Applicant",
        applicant_email: data?.applicantEmail || user.email || "",
        department: data?.department || null,
        year: data?.year || null,
        cover_letter: data?.statementOfPurpose || null,
        portfolio_url: data?.portfolioUrl || null,
        statement_of_purpose: data?.statementOfPurpose || null,
        answers: data?.answers || null,
        stage: "applied",
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, application: result };
  },
};

export default recruitmentsService;
