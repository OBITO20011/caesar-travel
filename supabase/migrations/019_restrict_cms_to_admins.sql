-- Restrict CMS management to an explicit admin list.
--
-- Before this migration every authenticated account had full access to trips,
-- gallery, site settings, visas, bookings (customer names and phones) and the
-- admin-media storage bucket. If public sign-up was enabled in Supabase Auth,
-- anyone could create an account and use that access.
--
-- After this migration:
--   * visitors (anon) read published content and submit booking requests only
--   * a signed-in account has management access only if listed in public.admin_users
--
-- BEFORE RUNNING on an existing project, register the agency account(s):
--   CREATE TABLE IF NOT EXISTS public.admin_users (
--     user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
--   );
--   INSERT INTO public.admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = 'agency-login@example.com'
--   ON CONFLICT DO NOTHING;
-- The migration aborts without changes if no admin is registered.
-- Keep public sign-up disabled in Supabase Auth settings.

BEGIN;

-- ==================== ADMIN LIST ====================

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Managed from the SQL editor only: RLS on, no policies, no API grants.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_users FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    RAISE EXCEPTION 'public.admin_users is empty. Register the agency account first (see header).';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ==================== RESET CMS TABLE POLICIES ====================
-- Drop every policy on the CMS tables, including permissive leftovers from
-- 004 ("Authenticated gallery management", ...), then recreate the final set.

DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('trips', 'gallery', 'site_settings', 'bookings', 'visas')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

-- Public read (same conditions as 005/008/010)
CREATE POLICY "Public can read visible trips" ON public.trips
  FOR SELECT TO anon, authenticated
  USING (
    status <> 'hidden'
    AND is_visible = true
    AND (offer_ends_at IS NULL OR offer_ends_at > now())
  );

CREATE POLICY "Public can read active gallery" ON public.gallery
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read active visas" ON public.visas
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Visitors can submit a booking request but never read, edit or delete one
CREATE POLICY "Public can create bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admin management
CREATE POLICY "Admins manage trips" ON public.trips
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage gallery" ON public.gallery
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage visas" ON public.visas
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage bookings" ON public.bookings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==================== STORAGE (admin-media) ====================
-- Public read stays; only admins may upload, replace or delete files.

DROP POLICY IF EXISTS "Authenticated admins upload admin media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins update admin media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins delete admin media" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload admin media" ON storage.objects;
DROP POLICY IF EXISTS "Admins update admin media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete admin media" ON storage.objects;

CREATE POLICY "Admins upload admin media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admin-media' AND public.is_admin());

CREATE POLICY "Admins update admin media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'admin-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'admin-media' AND public.is_admin());

CREATE POLICY "Admins delete admin media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'admin-media' AND public.is_admin());

COMMIT;
