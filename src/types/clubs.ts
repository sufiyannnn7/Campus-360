/**
 * Clubs Domain Models
 */

export type ClubCategory =
  | "Technical"
  | "Cultural"
  | "Sports"
  | "Literary"
  | "Social"
  | "Entrepreneurship"
  | "General";

export interface ClubMember {
  id: number | string;
  name: string;
  role: string;
  avatarUrl?: string;
  department?: string;
}

export interface ClubItem {
  id: number;
  name: string;
  slug?: string;
  category: string;
  tagline: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  memberCount: number;
  establishedYear?: number;
  facultyAdvisor?: string;
  leads?: ClubMember[];
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  tags?: string[];
  isJoined?: boolean;
}

export interface ClubFilterParams {
  q?: string;
  category?: string;
  limit?: number;
  page?: number;
}
