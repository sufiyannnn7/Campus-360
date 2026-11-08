-- CAMPUS 360: MIGRATION 005 - CERTIFICATE MANAGEMENT

-- 1. Extend Events
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS certificate_settings JSONB DEFAULT '{}'::JSONB;

-- 2. Extend Event Registrations
ALTER TABLE public.event_registrations
ADD COLUMN IF NOT EXISTS team_name TEXT,
ADD COLUMN IF NOT EXISTS registration_type TEXT DEFAULT 'individual';

-- 3. Extend Certificates
ALTER TABLE public.certificates
ADD COLUMN IF NOT EXISTS club_id BIGINT REFERENCES public.clubs(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS club_name TEXT,
ADD COLUMN IF NOT EXISTS club_logo_url TEXT,
ADD COLUMN IF NOT EXISTS body_text TEXT,
ADD COLUMN IF NOT EXISTS signatories JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS recipient_name TEXT,
ADD COLUMN IF NOT EXISTS team_name TEXT,
ADD COLUMN IF NOT EXISTS revocation_reason TEXT,
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS revoked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;

CREATE INDEX IF NOT EXISTS idx_certificates_club
ON public.certificates(club_id);

CREATE INDEX IF NOT EXISTS idx_certificates_status
ON public.certificates(status);

-- 4. Check and prevent duplicate certificates
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.certificates
    WHERE event_id IS NOT NULL
    GROUP BY user_id, event_id
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate certificates exist for the same user and event. Resolve duplicates before creating the unique index.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_user_event
ON public.certificates(user_id, event_id)
WHERE event_id IS NOT NULL;

-- 5. Replace the existing verification function
DROP FUNCTION IF EXISTS public.verify_certificate(TEXT);

CREATE FUNCTION public.verify_certificate(cert_code TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  certificate_id BIGINT,
  title TEXT,
  event_name TEXT,
  recipient_name TEXT,
  issuer TEXT,
  verification_code TEXT,
  category TEXT,
  description TEXT,
  status certificate_status,
  issued_at TIMESTAMPTZ,
  download_url TEXT,
  club_name TEXT,
  club_logo_url TEXT,
  body_text TEXT,
  signatories JSONB,
  team_name TEXT,
  revocation_reason TEXT,
  revoked_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (c.status = 'valid') AS is_valid,
    c.id AS certificate_id,
    c.title,
    c.event_name,
    COALESCE(c.recipient_name, p.name, 'Recipient') AS recipient_name,
    c.issuer,
    c.verification_code,
    c.category,
    c.description,
    c.status,
    c.issued_at,
    c.download_url,
    c.club_name,
    c.club_logo_url,
    c.body_text,
    c.signatories,
    c.team_name,
    c.revocation_reason,
    c.revoked_at
  FROM public.certificates c
  LEFT JOIN public.profiles p ON p.id = c.user_id
  WHERE UPPER(c.verification_code) = UPPER(cert_code)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(TEXT) TO anon, authenticated;

-- 6. Certificate RLS policies
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certs_coord_insert" ON public.certificates;
CREATE POLICY "certs_coord_insert"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  OR (
    club_id IS NOT NULL
    AND public.is_club_coordinator(club_id)
  )
);

DROP POLICY IF EXISTS "certs_coord_select" ON public.certificates;
CREATE POLICY "certs_coord_select"
ON public.certificates
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_admin()
  OR (
    club_id IS NOT NULL
    AND public.is_club_coordinator(club_id)
  )
);

DROP POLICY IF EXISTS "certs_admin_all" ON public.certificates;
CREATE POLICY "certs_admin_all"
ON public.certificates
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Table permissions
REVOKE ALL ON TABLE public.certificates FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.certificates TO authenticated;

-- 8. Verification
SELECT
  'Migration 005 certificate schema applied' AS result;