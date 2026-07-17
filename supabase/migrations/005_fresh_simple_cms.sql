-- Standalone fresh-install schema for the simplified Caesar Travel CMS.
-- This migration intentionally does not depend on or migrate any legacy ERP tables.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'tourism'
    CHECK (category IN ('tourism', 'umrah')),
  description TEXT,
  start_date DATE,
  end_date DATE,
  price NUMERIC(12, 2) CHECK (price IS NULL OR price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'JOD',
  makkah_hotel TEXT,
  madinah_hotel TEXT,
  airline TEXT,
  meals TEXT,
  nights INTEGER NOT NULL DEFAULT 0 CHECK (nights >= 0),
  total_seats INTEGER NOT NULL DEFAULT 0 CHECK (total_seats >= 0),
  remaining_seats INTEGER NOT NULL DEFAULT 0 CHECK (remaining_seats >= 0),
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'fully_booked', 'cancelled', 'completed', 'hidden')),
  main_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name TEXT NOT NULL DEFAULT 'قيصر للسياحة والسفر',
  logo_url TEXT,
  hero_title TEXT NOT NULL DEFAULT 'اكتشف العالم مع قيصر للسياحة والسفر',
  hero_subtitle TEXT NOT NULL DEFAULT 'مع قيصر للسياحة',
  hero_image_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  map_embed_url TEXT,
  years_experience INTEGER NOT NULL DEFAULT 20 CHECK (years_experience >= 0),
  happy_customers INTEGER NOT NULL DEFAULT 15000 CHECK (happy_customers >= 0),
  completed_trips INTEGER NOT NULL DEFAULT 30 CHECK (completed_trips >= 0),
  support_hours TEXT NOT NULL DEFAULT '24/7',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  people_count INTEGER NOT NULL DEFAULT 1 CHECK (people_count > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS trips_category_idx ON public.trips (category);
CREATE INDEX IF NOT EXISTS trips_status_idx ON public.trips (status);
CREATE INDEX IF NOT EXISTS gallery_display_order_idx ON public.gallery (display_order);
CREATE INDEX IF NOT EXISTS bookings_trip_id_idx ON public.bookings (trip_id);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read visible trips" ON public.trips;
CREATE POLICY "Public can read visible trips"
  ON public.trips
  FOR SELECT
  TO anon
  USING (status <> 'hidden');

DROP POLICY IF EXISTS "Authenticated admins manage trips" ON public.trips;
CREATE POLICY "Authenticated admins manage trips"
  ON public.trips
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read active gallery" ON public.gallery;
CREATE POLICY "Public can read active gallery"
  ON public.gallery
  FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated admins manage gallery" ON public.gallery;
CREATE POLICY "Authenticated admins manage gallery"
  ON public.gallery
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
  ON public.site_settings
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins manage site settings" ON public.site_settings;
CREATE POLICY "Authenticated admins manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings"
  ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins manage bookings" ON public.bookings;
CREATE POLICY "Authenticated admins manage bookings"
  ON public.bookings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.trips, public.gallery, public.site_settings TO anon;
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.trips, public.gallery, public.site_settings, public.bookings
  TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public can read admin media" ON storage.objects;
CREATE POLICY "Public can read admin media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'admin-media');

DROP POLICY IF EXISTS "Authenticated admins upload admin media" ON storage.objects;
CREATE POLICY "Authenticated admins upload admin media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-media');

DROP POLICY IF EXISTS "Authenticated admins update admin media" ON storage.objects;
CREATE POLICY "Authenticated admins update admin media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'admin-media')
  WITH CHECK (bucket_id = 'admin-media');

DROP POLICY IF EXISTS "Authenticated admins delete admin media" ON storage.objects;
CREATE POLICY "Authenticated admins delete admin media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-media');
