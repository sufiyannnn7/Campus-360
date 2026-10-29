/**
 * Campus-360 Supabase Database Schema Definitions
 * 
 * Automatically mapped TypeScript interfaces for tables, views, enums,
 * and RPC functions defined in supabase/migrations/001_campus360_initial_schema.sql.
 * Formatted for full @supabase/supabase-js v2 type compatibility.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "faculty" | "coordinator" | "admin";
export type EventStatus = "upcoming" | "live" | "completed" | "cancelled" | "postponed";
export type EventCategory =
  | "Academic"
  | "Technical"
  | "Cultural"
  | "Sports"
  | "Club"
  | "Workshop"
  | "Hackathon"
  | "Seminar"
  | "General";
export type ClubCategory =
  | "Technical"
  | "Cultural"
  | "Sports"
  | "Literary"
  | "Social"
  | "Entrepreneurship"
  | "General";
export type RecruitmentStatus = "open" | "closing_soon" | "closed";
export type ApplicationStage =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected";
export type NotificationType =
  | "event"
  | "club"
  | "announcement"
  | "system"
  | "reminder"
  | "event_reminder"
  | "points_awarded"
  | "recruitment";
export type CertificateStatus = "valid" | "revoked" | "pending";
export type VenueCategory =
  | "Academic"
  | "Sports"
  | "Canteen"
  | "Hostel"
  | "Workshop"
  | "Administration"
  | "Other";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: UserRole;
          department: string | null;
          year: string | null;
          prn: string | null;
          roll_number: string | null;
          bio: string | null;
          avatar_url: string | null;
          points: number;
          badges_count: number;
          events_attended: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: UserRole;
          department?: string | null;
          year?: string | null;
          prn?: string | null;
          roll_number?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          points?: number;
          badges_count?: number;
          events_attended?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: UserRole;
          department?: string | null;
          year?: string | null;
          prn?: string | null;
          roll_number?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          points?: number;
          badges_count?: number;
          events_attended?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          id: number;
          name: string;
          code: string;
          address: string | null;
          building: string;
          floor: string | null;
          capacity: number | null;
          category: VenueCategory;
          facilities: string[];
          coord_x: number | null;
          coord_y: number | null;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: string;
          address?: string | null;
          building: string;
          floor?: string | null;
          capacity?: number | null;
          category?: VenueCategory;
          facilities?: string[];
          coord_x?: number | null;
          coord_y?: number | null;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: string;
          address?: string | null;
          building?: string;
          floor?: string | null;
          capacity?: number | null;
          category?: VenueCategory;
          facilities?: string[];
          coord_x?: number | null;
          coord_y?: number | null;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clubs: {
        Row: {
          id: number;
          name: string;
          slug: string;
          category: ClubCategory;
          tagline: string;
          description: string | null;
          logo_url: string | null;
          banner_url: string | null;
          member_count: number;
          established_year: number | null;
          faculty_advisor: string | null;
          social_links: {
            instagram?: string;
            linkedin?: string;
            github?: string;
            website?: string;
          } | null;
          tags: string[];
          is_active: boolean;
          status?: 'draft' | 'pending_approval' | 'published' | 'changes_requested' | 'archived';
          mission?: string | null;
          vision?: string | null;
          objectives?: string[];
          introduction?: string | null;
          meeting_frequency?: string | null;
          meeting_day_time?: string | null;
          meeting_venue?: string | null;
          campus_location?: string | null;
          contact_email?: string | null;
          recruitment_status?: string;
          profile_completion?: number;
          rejection_reason?: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          category?: ClubCategory;
          tagline: string;
          description?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          member_count?: number;
          established_year?: number | null;
          faculty_advisor?: string | null;
          social_links?: Json | null;
          tags?: string[];
          is_active?: boolean;
          status?: 'draft' | 'pending_approval' | 'published' | 'changes_requested' | 'archived';
          mission?: string | null;
          vision?: string | null;
          objectives?: string[];
          introduction?: string | null;
          meeting_frequency?: string | null;
          meeting_day_time?: string | null;
          meeting_venue?: string | null;
          campus_location?: string | null;
          contact_email?: string | null;
          recruitment_status?: string;
          profile_completion?: number;
          rejection_reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          category?: ClubCategory;
          tagline?: string;
          description?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          member_count?: number;
          established_year?: number | null;
          faculty_advisor?: string | null;
          social_links?: Json | null;
          tags?: string[];
          is_active?: boolean;
          status?: 'draft' | 'pending_approval' | 'published' | 'changes_requested' | 'archived';
          mission?: string | null;
          vision?: string | null;
          objectives?: string[];
          introduction?: string | null;
          meeting_frequency?: string | null;
          meeting_day_time?: string | null;
          meeting_venue?: string | null;
          campus_location?: string | null;
          contact_email?: string | null;
          recruitment_status?: string;
          profile_completion?: number;
          rejection_reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_members: {
        Row: {
          id: number;
          club_id: number;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: number;
          title: string;
          tagline: string | null;
          description: string | null;
          category: EventCategory;
          status: EventStatus;
          start_datetime: string;
          end_datetime: string | null;
          registration_deadline: string | null;
          venue_id: number | null;
          venue_name: string | null;
          organizer_name: string;
          organizer_club_id: number | null;
          capacity: number | null;
          registered_count: number;
          banner_url: string | null;
          poster_url: string | null;
          tags: string[];
          schedule: Array<{ time: string; title: string }> | null;
          coordinators: Array<{ name: string; contact?: string; role?: string }> | null;
          prizes: Array<{ position: string; reward: string }> | null;
          is_featured: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          tagline?: string | null;
          description?: string | null;
          category?: EventCategory;
          status?: EventStatus;
          start_datetime: string;
          end_datetime?: string | null;
          registration_deadline?: string | null;
          venue_id?: number | null;
          venue_name?: string | null;
          organizer_name: string;
          organizer_club_id?: number | null;
          capacity?: number | null;
          registered_count?: number;
          banner_url?: string | null;
          poster_url?: string | null;
          tags?: string[];
          schedule?: Json | null;
          coordinators?: Json | null;
          prizes?: Json | null;
          is_featured?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          tagline?: string | null;
          description?: string | null;
          category?: EventCategory;
          status?: EventStatus;
          start_datetime?: string;
          end_datetime?: string | null;
          registration_deadline?: string | null;
          venue_id?: number | null;
          venue_name?: string | null;
          organizer_name?: string;
          organizer_club_id?: number | null;
          capacity?: number | null;
          registered_count?: number;
          banner_url?: string | null;
          poster_url?: string | null;
          tags?: string[];
          schedule?: Json | null;
          coordinators?: Json | null;
          prizes?: Json | null;
          is_featured?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: number;
          event_id: number;
          user_id: string;
          participant_name: string | null;
          participant_email: string | null;
          department: string | null;
          year: string | null;
          roll_number: string | null;
          status: "registered" | "confirmed" | "attended" | "cancelled";
          qr_code: string | null;
          registered_at: string;
        };
        Insert: {
          id?: number;
          event_id: number;
          user_id: string;
          participant_name?: string | null;
          participant_email?: string | null;
          department?: string | null;
          year?: string | null;
          roll_number?: string | null;
          status?: "registered" | "confirmed" | "attended" | "cancelled";
          qr_code?: string | null;
          registered_at?: string;
        };
        Update: {
          id?: number;
          event_id?: number;
          user_id?: string;
          participant_name?: string | null;
          participant_email?: string | null;
          department?: string | null;
          year?: string | null;
          roll_number?: string | null;
          status?: "registered" | "confirmed" | "attended" | "cancelled";
          qr_code?: string | null;
          registered_at?: string;
        };
        Relationships: [];
      };
      news_articles: {
        Row: {
          id: number;
          club_id: number | null;
          title: string;
          summary: string | null;
          content: string | null;
          category: string | null;
          author: string | null;
          author_role: string | null;
          published_at: string;
          image_url: string | null;
          read_time: string | null;
          is_important: boolean;
          tags: string[];
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id?: number | null;
          title: string;
          summary?: string | null;
          content?: string | null;
          category?: string | null;
          author?: string | null;
          author_role?: string | null;
          published_at?: string;
          image_url?: string | null;
          read_time?: string | null;
          is_important?: boolean;
          tags?: string[];
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number | null;
          title?: string;
          summary?: string | null;
          content?: string | null;
          category?: string | null;
          author?: string | null;
          author_role?: string | null;
          published_at?: string;
          image_url?: string | null;
          read_time?: string | null;
          is_important?: boolean;
          tags?: string[];
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recruitments: {
        Row: {
          id: number;
          club_id: number;
          role_title: string;
          department: string | null;
          description: string;
          requirements: string[];
          deadline: string;
          positions_count: number | null;
          status: RecruitmentStatus;
          form_fields: Array<{
            name: string;
            label: string;
            type: "text" | "textarea" | "select";
            required?: boolean;
            options?: string[];
          }> | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          role_title: string;
          department?: string | null;
          description: string;
          requirements?: string[];
          deadline: string;
          positions_count?: number | null;
          status?: RecruitmentStatus;
          form_fields?: Json | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          role_title?: string;
          department?: string | null;
          description?: string;
          requirements?: string[];
          deadline?: string;
          positions_count?: number | null;
          status?: RecruitmentStatus;
          form_fields?: Json | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recruitment_applications: {
        Row: {
          id: number;
          recruitment_id: number;
          applicant_id: string;
          applicant_name: string;
          applicant_email: string;
          department: string | null;
          year: string | null;
          cover_letter: string | null;
          portfolio_url: string | null;
          statement_of_purpose: string | null;
          answers: Record<string, any> | null;
          stage: ApplicationStage;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          recruitment_id: number;
          applicant_id: string;
          applicant_name: string;
          applicant_email: string;
          department?: string | null;
          year?: string | null;
          cover_letter?: string | null;
          portfolio_url?: string | null;
          statement_of_purpose?: string | null;
          answers?: Json | null;
          stage?: ApplicationStage;
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          recruitment_id?: number;
          applicant_id?: string;
          applicant_name?: string;
          applicant_email?: string;
          department?: string | null;
          year?: string | null;
          cover_letter?: string | null;
          portfolio_url?: string | null;
          statement_of_purpose?: string | null;
          answers?: Json | null;
          stage?: ApplicationStage;
          applied_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          event_name: string;
          event_id: number | null;
          issuer: string;
          verification_code: string;
          category: string | null;
          description: string | null;
          status: CertificateStatus;
          download_url: string | null;
          issued_at: string;
          issued_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          event_name: string;
          event_id?: number | null;
          issuer: string;
          verification_code: string;
          category?: string | null;
          description?: string | null;
          status?: CertificateStatus;
          download_url?: string | null;
          issued_at?: string;
          issued_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          event_name?: string;
          event_id?: number | null;
          issuer?: string;
          verification_code?: string;
          category?: string | null;
          description?: string | null;
          status?: CertificateStatus;
          download_url?: string | null;
          issued_at?: string;
          issued_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          body: string;
          type: NotificationType;
          action_url: string | null;
          read_status: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          body: string;
          type?: NotificationType;
          action_url?: string | null;
          read_status?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          body?: string;
          type?: NotificationType;
          action_url?: string | null;
          read_status?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      club_coordinator_assignments: {
        Row: {
          id: number;
          club_id: number;
          user_id: string;
          assigned_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          user_id: string;
          assigned_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          user_id?: string;
          assigned_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_profile_sections: {
        Row: {
          id: number;
          club_id: number;
          section_key: string;
          title: string;
          content: string | null;
          is_enabled: boolean;
          display_order: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          section_key: string;
          title: string;
          content?: string | null;
          is_enabled?: boolean;
          display_order?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          section_key?: string;
          title?: string;
          content?: string | null;
          is_enabled?: boolean;
          display_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      recruitment_positions: {
        Row: {
          id: number;
          recruitment_id: number | null;
          club_id: number;
          title: string;
          department: string | null;
          description: string | null;
          responsibilities: string | null;
          required_skills: string[];
          preferred_skills: string[];
          openings: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          recruitment_id?: number | null;
          club_id: number;
          title: string;
          department?: string | null;
          description?: string | null;
          responsibilities?: string | null;
          required_skills?: string[];
          preferred_skills?: string[];
          openings?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          recruitment_id?: number | null;
          club_id?: number;
          title?: string;
          department?: string | null;
          description?: string | null;
          responsibilities?: string | null;
          required_skills?: string[];
          preferred_skills?: string[];
          openings?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_achievements: {
        Row: {
          id: number;
          club_id: number;
          title: string;
          description: string | null;
          organization: string | null;
          award_date: string | null;
          image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          title: string;
          description?: string | null;
          organization?: string | null;
          award_date?: string | null;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          title?: string;
          description?: string | null;
          organization?: string | null;
          award_date?: string | null;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_projects: {
        Row: {
          id: number;
          club_id: number;
          title: string;
          summary: string | null;
          description: string | null;
          tech_stack: string[];
          demo_url: string | null;
          repo_url: string | null;
          status: string;
          year: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          title: string;
          summary?: string | null;
          description?: string | null;
          tech_stack?: string[];
          demo_url?: string | null;
          repo_url?: string | null;
          status?: string;
          year?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          title?: string;
          summary?: string | null;
          description?: string | null;
          tech_stack?: string[];
          demo_url?: string | null;
          repo_url?: string | null;
          status?: string;
          year?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_gallery: {
        Row: {
          id: number;
          club_id: number;
          title: string;
          image_url: string;
          caption: string | null;
          event_tag: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          title: string;
          image_url: string;
          caption?: string | null;
          event_tag?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          title?: string;
          image_url?: string;
          caption?: string | null;
          event_tag?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      club_faqs: {
        Row: {
          id: number;
          club_id: number;
          question: string;
          answer: string;
          category: string;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          question: string;
          answer: string;
          category?: string;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          question?: string;
          answer?: string;
          category?: string;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      club_team_members: {
        Row: {
          id: number;
          club_id: number;
          user_id: string | null;
          display_name: string;
          club_role: string;
          bio: string | null;
          avatar_url: string | null;
          responsibilities: string | null;
          term_year: string | null;
          display_order: number;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id: number;
          user_id?: string | null;
          display_name: string;
          club_role: string;
          bio?: string | null;
          avatar_url?: string | null;
          responsibilities?: string | null;
          term_year?: string | null;
          display_order?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number;
          user_id?: string | null;
          display_name?: string;
          club_role?: string;
          bio?: string | null;
          avatar_url?: string | null;
          responsibilities?: string | null;
          term_year?: string | null;
          display_order?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      approval_requests: {
        Row: {
          id: number;
          club_id: number | null;
          submitted_by: string;
          request_type: string;
          status: string;
          payload: Json;
          admin_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          club_id?: number | null;
          submitted_by: string;
          request_type: string;
          status?: string;
          payload: Json;
          admin_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          club_id?: number | null;
          submitted_by?: string;
          request_type?: string;
          status?: string;
          payload?: Json;
          admin_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          actor_name: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          club_id: number | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          actor_name?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          club_id?: number | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          actor_id?: string | null;
          actor_name?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          club_id?: number | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
      verify_certificate: {
        Args: { cert_code: string };
        Returns: {
          is_valid: boolean;
          certificate_id: number;
          title: string;
          event_name: string;
          recipient_name: string;
          issuer: string;
          verification_code: string;
          category: string | null;
          description: string | null;
          status: CertificateStatus;
          issued_at: string;
          download_url: string | null;
        }[];
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_club_coordinator: {
        Args: { club: number };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      event_status: EventStatus;
      event_category: EventCategory;
      club_category: ClubCategory;
      recruitment_status: RecruitmentStatus;
      application_stage: ApplicationStage;
      notification_type: NotificationType;
      certificate_status: CertificateStatus;
      venue_category: VenueCategory;
    };
    CompositeTypes: Record<string, never>;
  };
};
