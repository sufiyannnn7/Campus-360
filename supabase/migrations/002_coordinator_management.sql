-- ============================================================
-- Campus 360: Club Coordinator Management System Migration
-- File: supabase/migrations/002_coordinator_management.sql
-- Additive migration: Preserves all existing tables and data.
-- Do not drop existing tables. All statements are safe to run.
-- ============================================================

-- ------------------------------------
-- 1. Custom Types & Enums for Coordinator System
-- ------------------------------------
DO $$ BEGIN
  CREATE TYPE club_status AS ENUM (
    'draft', 'pending_approval', 'published', 'changes_requested', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE club_recruitment_mode AS ENUM ('online', 'offline', 'hybrid');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------
-- 2. Extend public.clubs with profile, meeting & approval fields
-- ------------------------------------
ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS status club_status NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS mission text,
  ADD COLUMN IF NOT EXISTS vision text,
  ADD COLUMN IF NOT EXISTS objectives text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS introduction text,
  ADD COLUMN IF NOT EXISTS meeting_frequency text DEFAULT 'Weekly',
  ADD COLUMN IF NOT EXISTS meeting_day_time text DEFAULT 'Saturdays, 4:00 PM',
  ADD COLUMN IF NOT EXISTS meeting_venue text DEFAULT 'Campus Tech Lab',
  ADD COLUMN IF NOT EXISTS campus_location text DEFAULT 'Main Building, Block B',
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS recruitment_status text NOT NULL DEFAULT 'closed'
    CHECK (recruitment_status IN ('closed', 'coming_soon', 'open', 'paused')),
  ADD COLUMN IF NOT EXISTS profile_completion integer NOT NULL DEFAULT 60
    CHECK (profile_completion >= 0 AND profile_completion <= 100),
  ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE INDEX IF NOT EXISTS idx_clubs_status ON public.clubs(status);
CREATE INDEX IF NOT EXISTS idx_clubs_recruitment_status ON public.clubs(recruitment_status);

-- ------------------------------------
-- 3. Extend public.news_articles with club_id
-- ------------------------------------
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS club_id bigint REFERENCES public.clubs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_news_club_id ON public.news_articles(club_id);

-- ------------------------------------
-- 4. CLUB COORDINATOR ASSIGNMENTS
-- Dedicated mapping table managed by Administrators
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_coordinator_assignments (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id     bigint NOT NULL REFERENCES public.clubs(id)    ON DELETE CASCADE,
  user_id     uuid   NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by uuid   REFERENCES public.profiles(id)          ON DELETE SET NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cca_club ON public.club_coordinator_assignments(club_id);
CREATE INDEX IF NOT EXISTS idx_cca_user ON public.club_coordinator_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_cca_active ON public.club_coordinator_assignments(is_active);

CREATE OR REPLACE TRIGGER trg_cca_updated_at
  BEFORE UPDATE ON public.club_coordinator_assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 5. UPGRADE HELPER FUNCTION: is_club_coordinator
-- Checks both club_coordinator_assignments AND club_members (role = 'lead')
-- ------------------------------------
CREATE OR REPLACE FUNCTION public.is_club_coordinator(club bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (
    -- User is admin
    public.is_admin()
    OR
    -- Or user is actively assigned via club_coordinator_assignments
    EXISTS (
      SELECT 1 FROM public.club_coordinator_assignments cca
      WHERE cca.user_id = auth.uid()
        AND cca.club_id = club
        AND cca.is_active = true
    )
    OR
    -- Or user is registered in club_members as lead
    EXISTS (
      SELECT 1 FROM public.club_members cm
      WHERE cm.user_id = auth.uid()
        AND cm.club_id = club
        AND cm.role = 'lead'
    )
  );
$$;

-- ------------------------------------
-- 6. CLUB PROFILE SECTIONS
-- Granular customizable sections on public club detail pages
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_profile_sections (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id       bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  section_key   text   NOT NULL, -- 'overview', 'about', 'mission', 'activities', 'recruitment', 'team', 'achievements', 'gallery', 'faqs', 'contact'
  title         text   NOT NULL,
  content       text,
  is_enabled    boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_cps_club ON public.club_profile_sections(club_id);

-- ------------------------------------
-- 7. RECRUITMENT POSITIONS
-- Specific openings configured per recruitment campaign
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.recruitment_positions (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recruitment_id     bigint REFERENCES public.recruitments(id) ON DELETE CASCADE,
  club_id            bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  title              text NOT NULL,
  department         text,
  description        text,
  responsibilities   text,
  required_skills    text[] NOT NULL DEFAULT '{}',
  preferred_skills   text[] NOT NULL DEFAULT '{}',
  openings           integer NOT NULL DEFAULT 1 CHECK (openings >= 0),
  is_active          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rec_pos_club ON public.recruitment_positions(club_id);
CREATE INDEX IF NOT EXISTS idx_rec_pos_recruitment ON public.recruitment_positions(recruitment_id);

CREATE OR REPLACE TRIGGER trg_rec_pos_updated_at
  BEFORE UPDATE ON public.recruitment_positions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 8. CLUB ACHIEVEMENTS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_achievements (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id      bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  title        text   NOT NULL,
  description  text,
  organization text,
  award_date   date,
  image_url    text,
  is_published boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_achieve_club ON public.club_achievements(club_id);

-- ------------------------------------
-- 9. CLUB PROJECTS & INITIATIVES
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_projects (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id     bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  title       text   NOT NULL,
  summary     text,
  description text,
  tech_stack  text[] NOT NULL DEFAULT '{}',
  demo_url    text,
  repo_url    text,
  status      text NOT NULL DEFAULT 'Active',
  year        text,
  is_published boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_proj_club ON public.club_projects(club_id);

-- ------------------------------------
-- 10. CLUB GALLERY MEDIA
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_gallery (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id       bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  title         text   NOT NULL,
  image_url     text   NOT NULL,
  caption       text,
  event_tag     text,
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_gallery_club ON public.club_gallery(club_id);

-- ------------------------------------
-- 11. CLUB FAQS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_faqs (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id       bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  question      text   NOT NULL,
  answer        text   NOT NULL,
  category      text   NOT NULL DEFAULT 'General',
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_faqs_club ON public.club_faqs(club_id);

-- ------------------------------------
-- 12. CLUB TEAM & LEADERSHIP ROSTER
-- Separate from platform user roles
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_team_members (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id          bigint NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id          uuid   REFERENCES public.profiles(id)       ON DELETE SET NULL,
  display_name     text   NOT NULL,
  club_role        text   NOT NULL, -- 'President', 'Vice President', 'Technical Lead', etc.
  bio              text,
  avatar_url       text,
  responsibilities text,
  term_year        text   DEFAULT '2026-2027',
  display_order    integer NOT NULL DEFAULT 0,
  is_public        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_team_club ON public.club_team_members(club_id);

-- ------------------------------------
-- 13. APPROVAL REQUESTS
-- Coordinator submissions awaiting Administrator review
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id       bigint REFERENCES public.clubs(id) ON DELETE CASCADE,
  submitted_by  uuid   NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_type  text   NOT NULL CHECK (request_type IN ('profile_update', 'event_publish', 'recruitment_launch', 'role_elevation', 'general')),
  status        text   NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  payload       jsonb  NOT NULL,
  admin_notes   text,
  reviewed_by   uuid   REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_approvals_club ON public.approval_requests(club_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approval_requests(status);

-- ------------------------------------
-- 14. AUDIT LOGS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name  text,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   text NOT NULL,
  club_id     bigint REFERENCES public.clubs(id) ON DELETE CASCADE,
  details     jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_club ON public.audit_logs(club_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- ------------------------------------
-- 15. ROW LEVEL SECURITY POLICIES
-- ------------------------------------
ALTER TABLE public.club_coordinator_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_profile_sections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_positions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_achievements            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_projects                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_gallery                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_faqs                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_team_members            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs                   ENABLE ROW LEVEL SECURITY;

-- 15.1 CLUBS POLICY UPDATE: allow coordinators to update their assigned club
DROP POLICY IF EXISTS "clubs_coord_update" ON public.clubs;
CREATE POLICY "clubs_coord_update" ON public.clubs
  FOR UPDATE USING (public.is_club_coordinator(id))
  WITH CHECK (public.is_club_coordinator(id));

-- 15.2 COORDINATOR ASSIGNMENTS: Admin all, user can see their own
DROP POLICY IF EXISTS "cca_admin_all" ON public.club_coordinator_assignments;
CREATE POLICY "cca_admin_all" ON public.club_coordinator_assignments
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "cca_select_own" ON public.club_coordinator_assignments;
CREATE POLICY "cca_select_own" ON public.club_coordinator_assignments
  FOR SELECT USING (user_id = auth.uid());

-- 15.3 CLUB PROFILE SECTIONS
DROP POLICY IF EXISTS "cps_public_read" ON public.club_profile_sections;
CREATE POLICY "cps_public_read" ON public.club_profile_sections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "cps_coord_manage" ON public.club_profile_sections;
CREATE POLICY "cps_coord_manage" ON public.club_profile_sections
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.4 RECRUITMENT POSITIONS
DROP POLICY IF EXISTS "rec_pos_public_read" ON public.recruitment_positions;
CREATE POLICY "rec_pos_public_read" ON public.recruitment_positions
  FOR SELECT USING (is_active = true OR public.is_club_coordinator(club_id));

DROP POLICY IF EXISTS "rec_pos_coord_manage" ON public.recruitment_positions;
CREATE POLICY "rec_pos_coord_manage" ON public.recruitment_positions
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.5 CLUB ACHIEVEMENTS
DROP POLICY IF EXISTS "achieve_public_read" ON public.club_achievements;
CREATE POLICY "achieve_public_read" ON public.club_achievements
  FOR SELECT USING (is_published = true OR public.is_club_coordinator(club_id));

DROP POLICY IF EXISTS "achieve_coord_manage" ON public.club_achievements;
CREATE POLICY "achieve_coord_manage" ON public.club_achievements
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.6 CLUB PROJECTS
DROP POLICY IF EXISTS "proj_public_read" ON public.club_projects;
CREATE POLICY "proj_public_read" ON public.club_projects
  FOR SELECT USING (is_published = true OR public.is_club_coordinator(club_id));

DROP POLICY IF EXISTS "proj_coord_manage" ON public.club_projects;
CREATE POLICY "proj_coord_manage" ON public.club_projects
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.7 CLUB GALLERY
DROP POLICY IF EXISTS "gallery_public_read" ON public.club_gallery;
CREATE POLICY "gallery_public_read" ON public.club_gallery
  FOR SELECT USING (is_published = true OR public.is_club_coordinator(club_id));

DROP POLICY IF EXISTS "gallery_coord_manage" ON public.club_gallery;
CREATE POLICY "gallery_coord_manage" ON public.club_gallery
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.8 CLUB FAQS
DROP POLICY IF EXISTS "faqs_public_read" ON public.club_faqs;
CREATE POLICY "faqs_public_read" ON public.club_faqs
  FOR SELECT USING (is_published = true OR public.is_club_coordinator(club_id));

DROP POLICY IF EXISTS "faqs_coord_manage" ON public.club_faqs;
CREATE POLICY "faqs_coord_manage" ON public.club_faqs
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.9 CLUB TEAM MEMBERS
DROP POLICY IF EXISTS "team_public_read" ON public.club_team_members;
CREATE POLICY "team_public_read" ON public.club_team_members
  FOR SELECT USING (is_public = true OR public.is_club_coordinator(club_id));

DROP POLICY IF EXISTS "team_coord_manage" ON public.club_team_members;
CREATE POLICY "team_coord_manage" ON public.club_team_members
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

-- 15.10 APPROVAL REQUESTS
DROP POLICY IF EXISTS "approvals_coord_select" ON public.approval_requests;
CREATE POLICY "approvals_coord_select" ON public.approval_requests
  FOR SELECT USING (
    submitted_by = auth.uid()
    OR public.is_admin()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
  );

DROP POLICY IF EXISTS "approvals_coord_insert" ON public.approval_requests;
CREATE POLICY "approvals_coord_insert" ON public.approval_requests
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "approvals_admin_all" ON public.approval_requests;
CREATE POLICY "approvals_admin_all" ON public.approval_requests
  FOR ALL USING (public.is_admin());

-- 15.11 AUDIT LOGS
DROP POLICY IF EXISTS "audit_admin_all" ON public.audit_logs;
CREATE POLICY "audit_admin_all" ON public.audit_logs
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "audit_coord_read" ON public.audit_logs;
CREATE POLICY "audit_coord_read" ON public.audit_logs
  FOR SELECT USING (public.is_club_coordinator(club_id));

-- 15.11B Helper: check if current user is faculty
CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'faculty'
  );
$$;

-- 15.12 EVENTS: allow admins, faculty, and coordinators to manage events
DROP POLICY IF EXISTS "events_coord_manage" ON public.events;
CREATE POLICY "events_coord_manage" ON public.events
  FOR ALL USING (
    public.is_admin()
    OR public.is_faculty()
    OR (organizer_club_id IS NOT NULL AND public.is_club_coordinator(organizer_club_id))
  )
  WITH CHECK (
    public.is_admin()
    OR public.is_faculty()
    OR (organizer_club_id IS NOT NULL AND public.is_club_coordinator(organizer_club_id))
  );

-- 15.13 NEWS: allow admins, faculty, and coordinators to manage news
DROP POLICY IF EXISTS "news_coord_manage" ON public.news_articles;
CREATE POLICY "news_coord_manage" ON public.news_articles
  FOR ALL USING (
    public.is_admin()
    OR public.is_faculty()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
  )
  WITH CHECK (
    public.is_admin()
    OR public.is_faculty()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
  );

-- 15.14 CLUB MEMBERS: allow coordinators to update roles and remove members
DROP POLICY IF EXISTS "club_members_coord_manage" ON public.club_members;
CREATE POLICY "club_members_coord_manage" ON public.club_members
  FOR ALL USING (
    public.is_admin()
    OR public.is_club_coordinator(club_id)
  )
  WITH CHECK (
    public.is_admin()
    OR public.is_club_coordinator(club_id)
  );

-- 15.15 Extended Profiles & Events fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS division text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS additional_info jsonb DEFAULT '{}'::jsonb;

-- 15.16 Set default designated admin role (allow direct SQL editor execution)
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL 
     OR current_user IN ('postgres', 'service_role', 'dashboard_user', 'supabase_admin')
     OR session_user IN ('postgres', 'service_role', 'dashboard_user', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can modify user roles';
  END IF;
  RETURN NEW;
END;
$$;

UPDATE public.profiles SET role = 'admin' WHERE email IN ('sufiyannnn7@gmail.com', 'admin@nkocet.ac.in');

-- 15.17 Explicit Table and Routine Grants for anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

