/**
 * Certificates Service
 * 
 * Supports Supabase certificates list and secure public RPC verification.
 * Falls back to mock data when Supabase credentials are absent.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Certificate, CertificateVerification } from "@/types/certificates";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function formatDate(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return !isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : isoString;
  } catch {
    return isoString;
  }
}

export const certificatesService = {
  async listCertificates(params?: any): Promise<Certificate[]> {
    if (!isSupabaseConfigured()) {
      return apiClient.get<Certificate[]>(API_ENDPOINTS.CERTIFICATES.LIST, { params });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("certificates")
        .select("*, profiles(name)")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (error) {
        console.error("Supabase listCertificates error:", error);
        throw new Error(error.message);
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        eventName: row.event_name,
        issueDate: formatDate(row.issued_at),
        recipientName: row.profiles?.name || user.user_metadata?.name || "Student",
        verificationCode: row.verification_code,
        issuer: row.issuer,
        category: row.category || undefined,
        description: row.description || undefined,
        status: row.status,
        downloadUrl: row.download_url || undefined,
      }));
    } catch (err: any) {
      console.error("Failed to load certificates from Supabase:", err);
      throw err;
    }
  },

  async verifyCertificate(code: string): Promise<CertificateVerification> {
    const normalizedCode = (code || "").trim().toUpperCase();

    if (!isSupabaseConfigured()) {
      // Mock verification fallback
      if (normalizedCode && (normalizedCode.startsWith("CERT-C360") || normalizedCode.startsWith("CAMPUS-"))) {
        return {
          isValid: true,
          certificate: {
            id: 1,
            title: "Verified Event Certificate",
            eventName: "National Code-A-Thon 2026",
            issueDate: "2026-03-15",
            recipientName: "Sufiyan Shaikh",
            verificationCode: normalizedCode,
            issuer: "NKOCET Solapur / CSESA",
            status: "valid",
          },
        };
      }
      return {
        isValid: false,
        message: "Certificate with this verification code could not be verified on the campus ledger.",
      };
    }

    try {
      const { data, error } = await supabase.rpc("verify_certificate", {
        cert_code: normalizedCode,
      });

      if (error) {
        console.error("Supabase verify_certificate error:", error);
        throw new Error(error.message);
      }

      const result = data && data.length > 0 ? data[0] : null;

      if (!result || !result.is_valid) {
        return {
          isValid: false,
          message: "Certificate with this verification code could not be verified on the campus ledger.",
        };
      }

      return {
        isValid: true,
        certificate: {
          id: result.certificate_id,
          title: result.title,
          eventName: result.event_name,
          issueDate: formatDate(result.issued_at),
          recipientName: result.recipient_name,
          verificationCode: result.verification_code,
          issuer: result.issuer,
          category: result.category || undefined,
          description: result.description || undefined,
          status: result.status,
          downloadUrl: result.download_url || undefined,
        },
      };
    } catch (err: any) {
      console.error("Certificate verification query failed:", err);
      throw err;
    }
  },
};

export default certificatesService;
