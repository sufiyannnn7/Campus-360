-- ============================================================
-- Campus-360: Initial Supabase Schema Migration
-- File: supabase/migrations/001_campus360_initial_schema.sql
-- Run once in Supabase SQL Editor on a clean project.
-- All statements are safe to execute top-to-bottom.
-- ============================================================

-- ------------------------------------
-- 1. Extensions
-- ------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search with ilike index

-- ------------------------------------
-- 2. Custom Types / Enums
-- ------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'faculty', 'coordinator', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('upcoming', 'live', 'completed', 'cancelled', 'postponed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE event_category AS ENUM (
    'Academic', 'Technical', 'Cultural', 'Sports', 'Club',
    'Workshop', 'Hackathon', 'Seminar', 'General'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE club_category AS ENUM (
    'Technical', 'Cultural', 'Sports', 'Literary',
    'Social', 'Entrepreneurship', 'General'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE recruitment_status AS ENUM ('open', 'closing_soon', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE application_stage AS ENUM (
    'applied', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'event', 'club', 'announcement', 'system', 'reminder',
    'event_reminder', 'points_awarded', 'recruitment'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE certificate_status AS ENUM ('valid', 'revoked', 'pending');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE venue_category AS ENUM (
    'Academic', 'Sports', 'Canteen', 'Hostel', 'Workshop', 'Administration', 'Other'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------
-- 3. updated_at trigger function
-- ------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ------------------------------------
-- 4. PROFILES (extends auth.users)
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text        NOT NULL,
  email           text        NOT NULL UNIQUE,
  role            user_role   NOT NULL DEFAULT 'student',
  department      text,
  year            text,
  prn             text,
  roll_number     text,
  bio             text,
  avatar_url      text,
  points          integer     NOT NULL DEFAULT 0 CHECK (points >= 0),
  badges_count    integer     NOT NULL DEFAULT 0 CHECK (badges_count >= 0),
  events_attended integer     NOT NULL DEFAULT 0 CHECK (events_attended >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX        IF NOT EXISTS idx_profiles_role  ON public.profiles(role);
CREATE INDEX        IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, department, year, prn)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(COALESCE(NEW.email, 'user'), '@', 1), 'Campus User'),
    COALESCE(NEW.email, NEW.id::text || '@campus360.local'),
    COALESCE(
      CASE WHEN NEW.raw_user_meta_data->>'role' IN ('student', 'faculty', 'coordinator')
           THEN (NEW.raw_user_meta_data->>'role')::user_role
           ELSE 'student'::user_role
      END,
      'student'::user_role
    ),
    NULLIF(NEW.raw_user_meta_data->>'department', ''),
    NULLIF(NEW.raw_user_meta_data->>'year', ''),
    NULLIF(NEW.raw_user_meta_data->>'prn', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = COALESCE(EXCLUDED.department, public.profiles.department),
    year = COALESCE(EXCLUDED.year, public.profiles.year),
    prn = COALESCE(EXCLUDED.prn, public.profiles.prn),
    updated_at = now();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Prevent non-admins from changing their own user role
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Allow direct DB administrative updates, SQL Editor, postgres superusers, and service_role
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

DROP TRIGGER IF EXISTS trg_prevent_profile_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();

-- ------------------------------------
-- 5. VENUES (Campus Map)
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.venues (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         text         NOT NULL,
  code         text         NOT NULL UNIQUE,
  address      text,
  building     text         NOT NULL,
  floor        text,
  capacity     integer      CHECK (capacity > 0),
  category     venue_category NOT NULL DEFAULT 'Academic',
  facilities   text[]       NOT NULL DEFAULT '{}',
  coord_x      numeric,
  coord_y      numeric,
  description  text,
  image_url    text,
  created_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at   timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_name_trgm ON public.venues USING gin(name gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 6. CLUBS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.clubs (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name              text          NOT NULL,
  slug              text          NOT NULL UNIQUE,
  category          club_category NOT NULL DEFAULT 'General',
  tagline           text          NOT NULL,
  description       text,
  logo_url          text,
  banner_url        text,
  member_count      integer       NOT NULL DEFAULT 0 CHECK (member_count >= 0),
  established_year  integer,
  faculty_advisor   text,
  social_links      jsonb,   -- {instagram, linkedin, github, website}
  tags              text[]   NOT NULL DEFAULT '{}',
  is_active         boolean  NOT NULL DEFAULT true,
  created_by        uuid     REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clubs_category ON public.clubs(category);
CREATE INDEX IF NOT EXISTS idx_clubs_name_trgm ON public.clubs USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_clubs_active ON public.clubs(is_active);

CREATE OR REPLACE TRIGGER trg_clubs_updated_at
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 7. CLUB MEMBERS (junction)
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.club_members (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id    bigint NOT NULL REFERENCES public.clubs(id)    ON DELETE CASCADE,
  user_id    uuid   NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       text   NOT NULL DEFAULT 'member',  -- 'lead', 'member', 'advisor'
  joined_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_club_members_club ON public.club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user ON public.club_members(user_id);

-- ------------------------------------
-- 8. EVENTS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title                 text           NOT NULL,
  tagline               text,
  description           text,
  category              event_category NOT NULL DEFAULT 'General',
  status                event_status   NOT NULL DEFAULT 'upcoming',
  start_datetime        timestamptz    NOT NULL,
  end_datetime          timestamptz,
  registration_deadline timestamptz,
  venue_id              bigint         REFERENCES public.venues(id) ON DELETE SET NULL,
  venue_name            text,          -- denormalized for display without join
  organizer_name        text           NOT NULL,
  organizer_club_id     bigint         REFERENCES public.clubs(id) ON DELETE SET NULL,
  capacity              integer        CHECK (capacity > 0),
  registered_count      integer        NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
  banner_url            text,
  poster_url            text,
  tags                  text[]         NOT NULL DEFAULT '{}',
  schedule              jsonb,         -- [{time, title}]
  coordinators          jsonb,         -- [{name, contact, role}]
  prizes                jsonb,         -- [{position, reward}]
  is_featured           boolean        NOT NULL DEFAULT false,
  created_by            uuid           REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at            timestamptz    NOT NULL DEFAULT now(),
  updated_at            timestamptz    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_status       ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_category     ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_start        ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_club         ON public.events(organizer_club_id);
CREATE INDEX IF NOT EXISTS idx_events_title_trgm   ON public.events USING gin(title gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 9. EVENT REGISTRATIONS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id            bigint      NOT NULL REFERENCES public.events(id)   ON DELETE CASCADE,
  user_id             uuid        NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  participant_name    text,
  participant_email   text,
  department          text,
  year                text,
  roll_number         text,
  status              text        NOT NULL DEFAULT 'registered'
                      CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled')),
  qr_code             text        UNIQUE,   -- generated verification token
  registered_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reg_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_user  ON public.event_registrations(user_id);

-- Keep registered_count in sync
CREATE OR REPLACE FUNCTION sync_event_registration_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status != 'cancelled' THEN
    UPDATE public.events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
    UPDATE public.events SET registered_count = GREATEST(registered_count - 1, 0) WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    UPDATE public.events SET registered_count = GREATEST(registered_count - 1, 0) WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    UPDATE public.events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_event_reg_count ON public.event_registrations;
CREATE TRIGGER trg_event_reg_count
  AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION sync_event_registration_count();

-- Also keep events_attended on profile in sync on attendance mark
CREATE OR REPLACE FUNCTION sync_profile_events_attended()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != 'attended' AND NEW.status = 'attended' THEN
    UPDATE public.profiles
    SET events_attended = events_attended + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profile_events_attended ON public.event_registrations;
CREATE TRIGGER trg_profile_events_attended
  AFTER UPDATE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION sync_profile_events_attended();

-- ------------------------------------
-- 10. NEWS ARTICLES
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.news_articles (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title         text        NOT NULL,
  summary       text,
  content       text,
  category      text,
  author        text,
  author_role   text,
  published_at  timestamptz NOT NULL DEFAULT now(),
  image_url     text,
  read_time     text,
  is_important  boolean     NOT NULL DEFAULT false,
  tags          text[]      NOT NULL DEFAULT '{}',
  is_published  boolean     NOT NULL DEFAULT true,
  created_by    uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category     ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_important    ON public.news_articles(is_important);
CREATE INDEX IF NOT EXISTS idx_news_title_trgm   ON public.news_articles USING gin(title gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_news_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 11. RECRUITMENTS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.recruitments (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id          bigint             NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  role_title       text               NOT NULL,
  department       text,
  description      text               NOT NULL,
  requirements     text[]             NOT NULL DEFAULT '{}',
  deadline         date               NOT NULL,
  positions_count  integer            CHECK (positions_count > 0),
  status           recruitment_status NOT NULL DEFAULT 'open',
  form_fields      jsonb,             -- [{name, label, type, required, options}]
  is_active        boolean            NOT NULL DEFAULT true,
  created_by       uuid               REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       timestamptz        NOT NULL DEFAULT now(),
  updated_at       timestamptz        NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitments_club   ON public.recruitments(club_id);
CREATE INDEX IF NOT EXISTS idx_recruitments_status ON public.recruitments(status);

CREATE OR REPLACE TRIGGER trg_recruitments_updated_at
  BEFORE UPDATE ON public.recruitments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 12. RECRUITMENT APPLICATIONS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.recruitment_applications (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recruitment_id       bigint           NOT NULL REFERENCES public.recruitments(id) ON DELETE CASCADE,
  applicant_id         uuid             NOT NULL REFERENCES public.profiles(id)     ON DELETE CASCADE,
  applicant_name       text             NOT NULL,
  applicant_email      text             NOT NULL,
  department           text,
  year                 text,
  cover_letter         text,
  portfolio_url        text,
  statement_of_purpose text,
  answers              jsonb,           -- custom form field answers
  stage                application_stage NOT NULL DEFAULT 'applied',
  applied_at           timestamptz      NOT NULL DEFAULT now(),
  updated_at           timestamptz      NOT NULL DEFAULT now(),
  UNIQUE (recruitment_id, applicant_id)
);

CREATE INDEX IF NOT EXISTS idx_app_recruitment ON public.recruitment_applications(recruitment_id);
CREATE INDEX IF NOT EXISTS idx_app_applicant   ON public.recruitment_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_app_stage       ON public.recruitment_applications(stage);

CREATE OR REPLACE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.recruitment_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 13. CERTIFICATES
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id           uuid               NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             text               NOT NULL,
  event_name        text               NOT NULL,
  event_id          bigint             REFERENCES public.events(id) ON DELETE SET NULL,
  issuer            text               NOT NULL,
  verification_code text               NOT NULL UNIQUE,
  category          text,
  description       text,
  status            certificate_status NOT NULL DEFAULT 'valid',
  download_url      text,
  issued_at         timestamptz        NOT NULL DEFAULT now(),
  issued_by         uuid               REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at        timestamptz        NOT NULL DEFAULT now(),
  updated_at        timestamptz        NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(verification_code);
CREATE INDEX        IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX        IF NOT EXISTS idx_certificates_event ON public.certificates(event_id);

CREATE OR REPLACE TRIGGER trg_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------
-- 14. NOTIFICATIONS
-- ------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     uuid              NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text              NOT NULL,
  body        text              NOT NULL,
  type        notification_type NOT NULL DEFAULT 'system',
  action_url  text,
  read_status boolean           NOT NULL DEFAULT false,
  created_at  timestamptz       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user      ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread    ON public.notifications(user_id, read_status) WHERE NOT read_status;
CREATE INDEX IF NOT EXISTS idx_notifications_created   ON public.notifications(created_at DESC);

-- Mark all notifications read for current user (called via RPC from frontend)
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.notifications
  SET read_status = true
  WHERE user_id = auth.uid() AND read_status = false;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_all_notifications_read() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read() TO authenticated;

-- ------------------------------------
-- 15. ROW LEVEL SECURITY
-- ------------------------------------

ALTER TABLE public.profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications            ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Helper: check if current user is coordinator of a given club
CREATE OR REPLACE FUNCTION public.is_club_coordinator(club bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.club_members cm ON cm.user_id = p.id
    WHERE p.id = auth.uid()
      AND p.role = 'coordinator'
      AND cm.club_id = club
      AND cm.role = 'lead'
  );
$$;

-- ---------- PROFILES policies ----------
DROP POLICY IF EXISTS "profiles_select_own"    ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"    ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"    ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"     ON public.profiles;
DROP POLICY IF EXISTS "profiles_leaderboard"   ON public.profiles;

-- Anyone authenticated can view all profiles (needed for leaderboard)
CREATE POLICY "profiles_leaderboard" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Own profile update (role modification guarded by trg_prevent_profile_role_change)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin can do everything
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- ---------- VENUES policies ----------
DROP POLICY IF EXISTS "venues_public_read"  ON public.venues;
DROP POLICY IF EXISTS "venues_admin_write"  ON public.venues;

CREATE POLICY "venues_public_read"  ON public.venues FOR SELECT USING (true);
CREATE POLICY "venues_admin_write"  ON public.venues FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- CLUBS policies ----------
DROP POLICY IF EXISTS "clubs_public_read"  ON public.clubs;
DROP POLICY IF EXISTS "clubs_admin_write"  ON public.clubs;

CREATE POLICY "clubs_public_read" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "clubs_admin_write" ON public.clubs FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- CLUB MEMBERS policies ----------
DROP POLICY IF EXISTS "club_members_read_authenticated" ON public.club_members;
DROP POLICY IF EXISTS "club_members_join_self"          ON public.club_members;
DROP POLICY IF EXISTS "club_members_leave_self"         ON public.club_members;
DROP POLICY IF EXISTS "club_members_admin_all"          ON public.club_members;

CREATE POLICY "club_members_read_authenticated" ON public.club_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "club_members_join_self" ON public.club_members
  FOR INSERT WITH CHECK (user_id = auth.uid() AND role = 'member');

CREATE POLICY "club_members_leave_self" ON public.club_members
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "club_members_admin_all" ON public.club_members
  FOR ALL USING (public.is_admin());

-- ---------- EVENTS policies ----------
DROP POLICY IF EXISTS "events_public_read"  ON public.events;
DROP POLICY IF EXISTS "events_admin_write"  ON public.events;

CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_admin_write" ON public.events FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- EVENT REGISTRATIONS policies ----------
DROP POLICY IF EXISTS "event_reg_select_own"        ON public.event_registrations;
DROP POLICY IF EXISTS "event_reg_insert_auth"       ON public.event_registrations;
DROP POLICY IF EXISTS "event_reg_cancel_own"        ON public.event_registrations;
DROP POLICY IF EXISTS "event_reg_admin_all"         ON public.event_registrations;

CREATE POLICY "event_reg_select_own" ON public.event_registrations
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "event_reg_insert_auth" ON public.event_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow user to update their own registration (e.g. re-register or cancel)
DROP POLICY IF EXISTS "event_reg_cancel_own" ON public.event_registrations;
DROP POLICY IF EXISTS "event_reg_update_own" ON public.event_registrations;
CREATE POLICY "event_reg_update_own" ON public.event_registrations
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND status IN ('registered', 'cancelled'));

CREATE POLICY "event_reg_admin_all" ON public.event_registrations
  FOR ALL USING (public.is_admin());

-- ---------- NEWS ARTICLES policies ----------
DROP POLICY IF EXISTS "news_public_read"  ON public.news_articles;
DROP POLICY IF EXISTS "news_admin_write"  ON public.news_articles;

CREATE POLICY "news_public_read"  ON public.news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "news_admin_write"  ON public.news_articles FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- RECRUITMENTS policies ----------
DROP POLICY IF EXISTS "recruitments_public_read"   ON public.recruitments;
DROP POLICY IF EXISTS "recruitments_coord_manage"  ON public.recruitments;
DROP POLICY IF EXISTS "recruitments_admin_all"     ON public.recruitments;

CREATE POLICY "recruitments_public_read" ON public.recruitments
  FOR SELECT USING (is_active = true);

CREATE POLICY "recruitments_coord_manage" ON public.recruitments
  FOR ALL USING (public.is_club_coordinator(club_id))
  WITH CHECK (public.is_club_coordinator(club_id));

CREATE POLICY "recruitments_admin_all" ON public.recruitments
  FOR ALL USING (public.is_admin());

-- ---------- RECRUITMENT APPLICATIONS policies ----------
DROP POLICY IF EXISTS "app_select_own_or_coord"  ON public.recruitment_applications;
DROP POLICY IF EXISTS "app_insert_auth"          ON public.recruitment_applications;
DROP POLICY IF EXISTS "app_update_coord"         ON public.recruitment_applications;
DROP POLICY IF EXISTS "app_admin_all"            ON public.recruitment_applications;

CREATE POLICY "app_select_own_or_coord" ON public.recruitment_applications
  FOR SELECT USING (
    applicant_id = auth.uid()
    OR public.is_admin()
    OR public.is_club_coordinator((SELECT r.club_id FROM public.recruitments r WHERE r.id = public.recruitment_applications.recruitment_id))
  );

CREATE POLICY "app_insert_auth" ON public.recruitment_applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "app_update_coord" ON public.recruitment_applications
  FOR UPDATE USING (
    public.is_admin()
    OR public.is_club_coordinator((SELECT r.club_id FROM public.recruitments r WHERE r.id = public.recruitment_applications.recruitment_id))
  );

CREATE POLICY "app_admin_all" ON public.recruitment_applications
  FOR ALL USING (public.is_admin());

-- ---------- CERTIFICATES policies ----------
DROP POLICY IF EXISTS "certs_select_own"         ON public.certificates;
DROP POLICY IF EXISTS "certs_verify_public"      ON public.certificates;
DROP POLICY IF EXISTS "certs_admin_all"          ON public.certificates;

-- Authenticated users see their own certs
CREATE POLICY "certs_select_own" ON public.certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "certs_admin_all" ON public.certificates
  FOR ALL USING (public.is_admin());

-- Secure certificate verification RPC function (accessible to public and authenticated)
CREATE OR REPLACE FUNCTION public.verify_certificate(cert_code text)
RETURNS TABLE (
  is_valid boolean,
  certificate_id bigint,
  title text,
  event_name text,
  recipient_name text,
  issuer text,
  verification_code text,
  category text,
  description text,
  status certificate_status,
  issued_at timestamptz,
  download_url text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT 
    (c.status = 'valid') AS is_valid,
    c.id AS certificate_id,
    c.title,
    c.event_name,
    COALESCE(p.name, 'Recipient') AS recipient_name,
    c.issuer,
    c.verification_code,
    c.category,
    c.description,
    c.status,
    c.issued_at,
    c.download_url
  FROM public.certificates c
  LEFT JOIN public.profiles p ON p.id = c.user_id
  WHERE c.verification_code = cert_code
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;

-- ---------- NOTIFICATIONS policies ----------
DROP POLICY IF EXISTS "notif_select_own"  ON public.notifications;
DROP POLICY IF EXISTS "notif_update_own"  ON public.notifications;
DROP POLICY IF EXISTS "notif_admin_all"   ON public.notifications;

CREATE POLICY "notif_select_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notif_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notif_admin_all" ON public.notifications
  FOR ALL USING (public.is_admin());

-- ------------------------------------
-- 16. Seed: Venue data (campus map)
-- ------------------------------------
INSERT INTO public.venues (name, code, building, floor, capacity, category, facilities, coord_x, coord_y, description)
VALUES
  ('Main Seminar Hall',       'MSH-01', 'Main Building',  'Ground Floor', 500, 'Academic',   ARRAY['Projector','AC','Mic'], 120, 200, 'Primary seminar and event hall'),
  ('Computer Lab A',          'LAB-A',  'IT Block',       'First Floor',  60,  'Academic',   ARRAY['PCs','AC','Projector'],  200, 150, 'Programming lab'),
  ('Sports Ground',           'SPG-01', 'Sports Complex', 'Ground',       2000,'Sports',     ARRAY['Lights','Scoreboard'],   350, 400, 'Main sports ground'),
  ('Central Canteen',         'CAN-01', 'Canteen Block',  'Ground Floor', 200, 'Canteen',    ARRAY['WiFi','Seating'],        100, 350, 'Main campus canteen'),
  ('Boys Hostel A',           'HOS-A',  'Hostel Block A', 'Multi-floor',  300, 'Hostel',     ARRAY['WiFi','Laundry'],        400, 100, 'Boys hostel block A'),
  ('Workshop Hall',           'WRK-01', 'Workshop Block', 'Ground Floor', 100, 'Workshop',   ARRAY['Machines','Ventilation'],300, 250, 'Mechanical workshop')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------
-- END OF MIGRATION
-- ------------------------------------
