-- ============================================================================
-- Migration 003: Storage Buckets for Campus 360 Assets
-- Enables Supabase Storage bucket 'club-assets' with RLS policies
-- ============================================================================

-- Create public bucket for club assets (logos, banners) if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'club-assets',
  'club-assets',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml'];

-- 1. Anyone can view/read club assets
CREATE POLICY "Public read access on club-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'club-assets');

-- 2. Authenticated users (coordinators, admins) can upload club assets
CREATE POLICY "Authenticated users can upload club-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'club-assets');

-- 3. Authenticated users can update/replace existing club assets (needed for upsert)
CREATE POLICY "Authenticated users can update club-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'club-assets');

-- 4. Authenticated users can delete club assets
CREATE POLICY "Authenticated users can delete club-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'club-assets');

