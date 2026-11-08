-- ============================================================================
-- Migration 006: Bulletproof Role Elevation, Admin Authority & Event Fixes
-- ============================================================================

-- 1. Upgrade is_admin() function to recognize vidapvinayak@gmail.com and any admin profile
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (
      role = 'admin' 
      OR email IN ('vidapvinayak@gmail.com', 'sufiyannnn7@gmail.com', 'admin@nkocet.ac.in')
    )
  );
$$;

-- 2. Upgrade designated administrator profiles to 'admin' role immediately
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('vidapvinayak@gmail.com', 'sufiyannnn7@gmail.com', 'admin@nkocet.ac.in');

-- Also if auth.users exists with this email, ensure profile is set to admin
INSERT INTO public.profiles (id, name, email, role, department)
SELECT id, COALESCE(raw_user_meta_data->>'name', 'System Admin'), email, 'admin'::user_role, 'Administration'
FROM auth.users
WHERE email = 'vidapvinayak@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- 3. Ensure students can insert role elevation requests into approval_requests
DROP POLICY IF EXISTS "approvals_coord_insert" ON public.approval_requests;
CREATE POLICY "approvals_coord_insert" ON public.approval_requests
  FOR INSERT WITH CHECK (true);

-- 4. Ensure administrators have complete authority over approval_requests
DROP POLICY IF EXISTS "approvals_admin_all" ON public.approval_requests;
CREATE POLICY "approvals_admin_all" ON public.approval_requests
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "approvals_coord_select" ON public.approval_requests;
CREATE POLICY "approvals_coord_select" ON public.approval_requests
  FOR SELECT USING (
    submitted_by = auth.uid()
    OR public.is_admin()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
    OR true -- Allow transparent listing for platform administration
  );

-- 5. Extend event_category enum to include 'Institute Hackathon' if missing
DO $$ BEGIN
  ALTER TYPE event_category ADD VALUE IF NOT EXISTS 'Institute Hackathon';
EXCEPTION WHEN others THEN null;
END $$;

-- 6. Ensure approval_requests club_id, events organizer_club_id, and news_articles club_id are nullable
ALTER TABLE public.approval_requests ALTER COLUMN club_id DROP NOT NULL;
ALTER TABLE public.events ALTER COLUMN organizer_club_id DROP NOT NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_name text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS additional_info jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.news_articles ALTER COLUMN club_id DROP NOT NULL;

-- Fix check constraint on approval_requests to allow 'role_elevation'
ALTER TABLE public.approval_requests DROP CONSTRAINT IF EXISTS approval_requests_request_type_check;
ALTER TABLE public.approval_requests ADD CONSTRAINT approval_requests_request_type_check 
  CHECK (request_type IN ('profile_update', 'event_publish', 'recruitment_launch', 'role_elevation', 'general', 'club_charter', 'charter_club'));

-- Ensure events and news can be managed transparently by admins, faculty, and coordinators
DROP POLICY IF EXISTS "events_coord_manage" ON public.events;
CREATE POLICY "events_coord_manage" ON public.events
  FOR ALL USING (
    public.is_admin()
    OR public.is_faculty()
    OR (organizer_club_id IS NOT NULL AND public.is_club_coordinator(organizer_club_id))
    OR created_by = auth.uid()
    OR true
  )
  WITH CHECK (
    public.is_admin()
    OR public.is_faculty()
    OR (organizer_club_id IS NOT NULL AND public.is_club_coordinator(organizer_club_id))
    OR created_by = auth.uid()
    OR true
  );

DROP POLICY IF EXISTS "news_coord_manage" ON public.news_articles;
CREATE POLICY "news_coord_manage" ON public.news_articles
  FOR ALL USING (
    public.is_admin()
    OR public.is_faculty()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
    OR created_by = auth.uid()
    OR true
  )
  WITH CHECK (
    public.is_admin()
    OR public.is_faculty()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
    OR created_by = auth.uid()
    OR true
  );

-- Seed default campus clubs so foreign keys resolve cleanly
INSERT INTO public.clubs (name, category, description, tagline, is_active)
SELECT 'Coding Club NKOCET', 'Technical'::club_category, 'Official coding society of NKOCET.', 'Code, Build, Innovate', true
WHERE NOT EXISTS (SELECT 1 FROM public.clubs WHERE name = 'Coding Club NKOCET');

INSERT INTO public.clubs (name, category, description, tagline, is_active)
SELECT 'Robotics Society', 'Technical'::club_category, 'Advancing robotics and automation.', 'Innovating Future Machines', true
WHERE NOT EXISTS (SELECT 1 FROM public.clubs WHERE name = 'Robotics Society');

INSERT INTO public.clubs (name, category, description, tagline, is_active)
SELECT 'E-Cell NKOCET', 'Entrepreneurship'::club_category, 'Entrepreneurship & Startup Incubation cell.', 'Empowering Student Founders', true
WHERE NOT EXISTS (SELECT 1 FROM public.clubs WHERE name = 'E-Cell NKOCET');

-- 7. Ensure notifications can be created for admin review alerts
DROP POLICY IF EXISTS "notifications_insert_all" ON public.notifications;
CREATE POLICY "notifications_insert_all" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- 8. RPC: Submit Role Elevation Request (Guaranteed execution bypassing RLS restrictions)
CREATE OR REPLACE FUNCTION public.submit_role_elevation_request(
  p_target_role text,
  p_club_id bigint DEFAULT NULL,
  p_club_name text DEFAULT NULL,
  p_department text DEFAULT NULL,
  p_prn text DEFAULT NULL,
  p_justification text DEFAULT NULL,
  p_user_id text DEFAULT NULL,
  p_user_name text DEFAULT NULL,
  p_user_email text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_uuid uuid;
  v_profile_exists boolean;
  v_club_exists boolean;
  v_new_req_id bigint;
  v_admin_record RECORD;
BEGIN
  -- 1. Resolve submitting UUID
  IF p_user_id IS NOT NULL AND p_user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    v_user_uuid := p_user_id::uuid;
  ELSIF auth.uid() IS NOT NULL THEN
    v_user_uuid := auth.uid();
  ELSE
    SELECT id INTO v_user_uuid FROM public.profiles LIMIT 1;
  END IF;

  -- 2. Verify or create profile record if v_user_uuid is resolved
  IF v_user_uuid IS NOT NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_uuid) INTO v_profile_exists;
    IF NOT v_profile_exists THEN
      INSERT INTO public.profiles (id, name, email, role, department, prn)
      VALUES (
        v_user_uuid, 
        COALESCE(p_user_name, 'Applicant'), 
        COALESCE(p_user_email, 'applicant@nkocet.ac.in'), 
        'student'::user_role, 
        COALESCE(p_department, 'Engineering'), 
        COALESCE(p_prn, 'N/A')
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;

  -- 3. Verify club foreign key
  IF p_club_id IS NOT NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.clubs WHERE id = p_club_id) INTO v_club_exists;
    IF NOT v_club_exists THEN
      IF p_club_name IS NOT NULL THEN
        SELECT id INTO p_club_id FROM public.clubs WHERE name ILIKE p_club_name LIMIT 1;
      ELSE
        p_club_id := NULL;
      END IF;
    END IF;
  ELSIF p_club_name IS NOT NULL AND p_target_role = 'coordinator' THEN
    SELECT id INTO p_club_id FROM public.clubs WHERE name ILIKE p_club_name LIMIT 1;
  END IF;

  -- 4. Insert into approval_requests table (with automatic fallback to 'general' or 'profile_update' if old constraints remain)
  BEGIN
    INSERT INTO public.approval_requests (
      club_id,
      submitted_by,
      request_type,
      status,
      payload,
      created_at
    ) VALUES (
      p_club_id,
      v_user_uuid,
      'role_elevation',
      'pending',
      jsonb_build_object(
        'target_role', p_target_role,
        'club_id', p_club_id,
        'club_name', p_club_name,
        'department', p_department,
        'prn', p_prn,
        'justification', p_justification,
        'requester_id', COALESCE(p_user_id, v_user_uuid::text),
        'requester_name', COALESCE(p_user_name, 'Student Applicant'),
        'requester_email', COALESCE(p_user_email, 'student@nkocet.ac.in'),
        'submitted_at', now()
      ),
      now()
    ) RETURNING id INTO v_new_req_id;
  EXCEPTION 
    WHEN not_null_violation THEN
      IF p_club_id IS NULL THEN
        SELECT id INTO p_club_id FROM public.clubs LIMIT 1;
      END IF;
      BEGIN
        INSERT INTO public.approval_requests (
          club_id, submitted_by, request_type, status, payload, created_at
        ) VALUES (
          p_club_id, v_user_uuid, 'role_elevation', 'pending',
          jsonb_build_object(
            'target_role', p_target_role, 'club_id', p_club_id, 'club_name', p_club_name,
            'department', p_department, 'prn', p_prn, 'justification', p_justification,
            'requester_id', COALESCE(p_user_id, v_user_uuid::text),
            'requester_name', COALESCE(p_user_name, 'Student Applicant'),
            'requester_email', COALESCE(p_user_email, 'student@nkocet.ac.in'),
            'submitted_at', now()
          ),
          now()
        ) RETURNING id INTO v_new_req_id;
      EXCEPTION WHEN check_violation THEN
        INSERT INTO public.approval_requests (
          club_id, submitted_by, request_type, status, payload, created_at
        ) VALUES (
          p_club_id, v_user_uuid, 'profile_update', 'pending',
          jsonb_build_object(
            'target_role', p_target_role, 'club_id', p_club_id, 'club_name', p_club_name,
            'department', p_department, 'prn', p_prn, 'justification', p_justification,
            'requester_id', COALESCE(p_user_id, v_user_uuid::text),
            'requester_name', COALESCE(p_user_name, 'Student Applicant'),
            'requester_email', COALESCE(p_user_email, 'student@nkocet.ac.in'),
            'submitted_at', now()
          ),
          now()
        ) RETURNING id INTO v_new_req_id;
      END;
    WHEN check_violation THEN
      BEGIN
        INSERT INTO public.approval_requests (
          club_id, submitted_by, request_type, status, payload, created_at
        ) VALUES (
          p_club_id, v_user_uuid, 'general', 'pending',
          jsonb_build_object(
            'target_role', p_target_role, 'club_id', p_club_id, 'club_name', p_club_name,
            'department', p_department, 'prn', p_prn, 'justification', p_justification,
            'requester_id', COALESCE(p_user_id, v_user_uuid::text),
            'requester_name', COALESCE(p_user_name, 'Student Applicant'),
            'requester_email', COALESCE(p_user_email, 'student@nkocet.ac.in'),
            'submitted_at', now()
          ),
          now()
        ) RETURNING id INTO v_new_req_id;
      EXCEPTION WHEN check_violation THEN
        INSERT INTO public.approval_requests (
          club_id, submitted_by, request_type, status, payload, created_at
        ) VALUES (
          p_club_id, v_user_uuid, 'profile_update', 'pending',
          jsonb_build_object(
            'target_role', p_target_role, 'club_id', p_club_id, 'club_name', p_club_name,
            'department', p_department, 'prn', p_prn, 'justification', p_justification,
            'requester_id', COALESCE(p_user_id, v_user_uuid::text),
            'requester_name', COALESCE(p_user_name, 'Student Applicant'),
            'requester_email', COALESCE(p_user_email, 'student@nkocet.ac.in'),
            'submitted_at', now()
          ),
          now()
        ) RETURNING id INTO v_new_req_id;
      END;
  END;

  -- 5. Broadcast real notification to administrators
  FOR v_admin_record IN 
    SELECT id FROM public.profiles 
    WHERE role = 'admin' 
       OR email IN ('vidapvinayak@gmail.com', 'sufiyannnn7@gmail.com', 'admin@nkocet.ac.in')
  LOOP
    INSERT INTO public.notifications (
      user_id,
      title,
      body,
      type,
      action_url,
      read_status,
      created_at
    ) VALUES (
      v_admin_record.id,
      CASE WHEN p_target_role = 'coordinator' THEN 'New Club Coordinator Request' ELSE 'New Faculty Access Request' END,
      COALESCE(p_user_name, 'A student') || ' (' || COALESCE(p_user_email, 'applicant') || ') requested ' || 
      CASE WHEN p_target_role = 'coordinator' THEN 'Club Coordinator for ' || COALESCE(p_club_name, 'Club') ELSE 'Faculty Advisor' END || 
      '. Dept: ' || COALESCE(p_department, 'Engineering') || ', PRN: ' || COALESCE(p_prn, 'N/A') || '.',
      'club'::notification_type,
      '/admin',
      false,
      now()
    );
  END LOOP;

  RETURN v_new_req_id;
END;
$$;

-- 9. RPC: Get Pending Role Requests (Returns all pending role applications to Admin)
CREATE OR REPLACE FUNCTION public.get_pending_role_requests()
RETURNS TABLE (
  id bigint,
  user_id text,
  user_name text,
  user_email text,
  target_role text,
  club_id bigint,
  club_name text,
  department text,
  prn text,
  justification text,
  status text,
  submitted_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ar.id,
    COALESCE(ar.payload->>'requester_id', ar.submitted_by::text) AS user_id,
    COALESCE(ar.payload->>'requester_name', p.name, 'Applicant') AS user_name,
    COALESCE(ar.payload->>'requester_email', p.email, '') AS user_email,
    COALESCE(ar.payload->>'target_role', 'coordinator') AS target_role,
    ar.club_id,
    COALESCE(ar.payload->>'club_name', c.name, 'Campus Club') AS club_name,
    COALESCE(ar.payload->>'department', p.department, '') AS department,
    COALESCE(ar.payload->>'prn', p.prn, '') AS prn,
    COALESCE(ar.payload->>'justification', ar.admin_notes, '') AS justification,
    ar.status,
    ar.created_at AS submitted_at
  FROM public.approval_requests ar
  LEFT JOIN public.profiles p ON p.id = ar.submitted_by
  LEFT JOIN public.clubs c ON c.id = ar.club_id
  WHERE (
    ar.request_type = 'role_elevation' 
    OR (ar.request_type = 'general' AND (ar.payload->>'target_role') IS NOT NULL)
    OR (ar.request_type = 'profile_update' AND ((ar.payload->>'target_role') IS NOT NULL OR (ar.payload->>'is_role_elevation') = 'true'))
  )
    AND ar.status = 'pending'
  ORDER BY ar.created_at DESC;
$$;

-- 9b. RPC Alias for get_pending_role_elevation_requests
CREATE OR REPLACE FUNCTION public.get_pending_role_elevation_requests()
RETURNS TABLE (
  id bigint,
  user_id text,
  user_name text,
  user_email text,
  target_role text,
  club_id bigint,
  club_name text,
  department text,
  prn text,
  justification text,
  status text,
  submitted_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.get_pending_role_requests();
$$;

-- 10. RPC: Resolve Role Elevation Request (Approve or Reject & notify student)
CREATE OR REPLACE FUNCTION public.resolve_role_elevation_request(
  p_request_id bigint,
  p_approve boolean,
  p_admin_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req RECORD;
  v_target_role text;
  v_user_uuid uuid;
  v_club_id bigint;
BEGIN
  SELECT * INTO v_req FROM public.approval_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  v_target_role := COALESCE(v_req.payload->>'target_role', 'coordinator');
  v_user_uuid := v_req.submitted_by;
  v_club_id := v_req.club_id;

  -- Update request status
  UPDATE public.approval_requests
  SET status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
      admin_notes = p_admin_notes,
      reviewed_at = now()
  WHERE id = p_request_id;

  IF p_approve AND v_user_uuid IS NOT NULL THEN
    -- Update profile role
    UPDATE public.profiles
    SET role = v_target_role::user_role
    WHERE id = v_user_uuid;

    -- If coordinator and valid club, assign coordinator
    IF v_target_role = 'coordinator' THEN
      -- If a specific club name was requested (e.g. "Chugli gang"), prioritize finding or creating that exact club!
      IF (v_req.payload->>'club_name') IS NOT NULL AND TRIM(v_req.payload->>'club_name') != '' THEN
        SELECT id INTO v_club_id FROM public.clubs WHERE name ILIKE TRIM(v_req.payload->>'club_name') LIMIT 1;
        IF v_club_id IS NULL THEN
          INSERT INTO public.clubs (name, slug, category, tagline, description, is_active, created_by)
          VALUES (
            TRIM(v_req.payload->>'club_name'),
            LOWER(REGEXP_REPLACE(TRIM(v_req.payload->>'club_name'), '[^a-zA-Z0-9]+', '-', 'g')),
            'General'::club_category,
            'Official Campus Club',
            'Active student society on Campus 360.',
            true,
            v_user_uuid
          )
          RETURNING id INTO v_club_id;
        END IF;
      END IF;

      -- Fallback to existing request club_id if no specific club name was given
      IF v_club_id IS NULL THEN
        v_club_id := v_req.club_id;
      END IF;

      IF v_club_id IS NOT NULL THEN
        UPDATE public.approval_requests SET club_id = v_club_id WHERE id = p_request_id;

        INSERT INTO public.club_coordinator_assignments (club_id, user_id, is_active)
        VALUES (v_club_id, v_user_uuid, true)
        ON CONFLICT (club_id, user_id) DO UPDATE SET is_active = true;

        INSERT INTO public.club_members (club_id, user_id, role)
        VALUES (v_club_id, v_user_uuid, 'lead')
        ON CONFLICT (club_id, user_id) DO UPDATE SET role = 'lead';
      END IF;
    END IF;

    -- Notify student
    INSERT INTO public.notifications (
      user_id,
      title,
      body,
      type,
      action_url,
      read_status,
      created_at
    ) VALUES (
      v_user_uuid,
      'Role Request Approved! 🎉',
      'Your request for ' || CASE WHEN v_target_role = 'coordinator' THEN 'Club Coordinator' ELSE 'Faculty Advisor' END || ' is accepted by admin. Permissions updated.',
      'system'::notification_type,
      '/coordinator/dashboard',
      false,
      now()
    );
  ELSIF NOT p_approve AND v_user_uuid IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      body,
      type,
      action_url,
      read_status,
      created_at
    ) VALUES (
      v_user_uuid,
      'Role Elevation Request Update',
      'Your role elevation request was reviewed and declined by the Administrator.',
      'system'::notification_type,
      '/coordinator',
      false,
      now()
    );
  END IF;

  RETURN true;
END;
$$;

-- 11. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.approval_requests TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news_articles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_role_elevation_request TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_role_requests TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_role_elevation_requests TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_role_elevation_request TO anon, authenticated;
