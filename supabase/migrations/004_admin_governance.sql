-- ============================================================================
-- Migration 004: Admin Governance, Live Approvals & RLS Resilience
-- Guarantees administrators full authority over approval_requests & notifications
-- ============================================================================

-- 1. Helper function: check if current user is admin (by role OR designated email)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR email IN ('sufiyannnn7@gmail.com', 'admin@nkocet.ac.in'))
  );
$$;

-- 2. Upgrade designated administrator profiles to 'admin' role
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('sufiyannnn7@gmail.com', 'admin@nkocet.ac.in');

-- 3. APPROVAL REQUESTS: allow admins full SELECT, UPDATE, and DELETE
DROP POLICY IF EXISTS "approvals_admin_all" ON public.approval_requests;
CREATE POLICY "approvals_admin_all" ON public.approval_requests
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "approvals_coord_select" ON public.approval_requests;
CREATE POLICY "approvals_coord_select" ON public.approval_requests
  FOR SELECT USING (
    submitted_by = auth.uid()
    OR public.is_admin()
    OR (club_id IS NOT NULL AND public.is_club_coordinator(club_id))
  );

-- 4. NOTIFICATIONS: allow users to delete their own notifications and admins to manage all
DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

