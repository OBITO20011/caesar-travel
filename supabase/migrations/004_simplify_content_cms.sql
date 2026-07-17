-- Reduce the admin database to the tables used by the public website CMS.
-- Existing gallery and website settings are copied before legacy tables are removed.

-- ==================== MINIMAL GALLERY ====================

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO public.gallery (id, image_url, title, display_order, created_at, updated_at)
SELECT id, image_url, title, COALESCE(display_order, 0), created_at, updated_at
FROM public.gallery_images
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public gallery read" ON public.gallery
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated gallery management" ON public.gallery
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==================== CONSOLIDATED SITE SETTINGS ====================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title VARCHAR(500) NOT NULL,
  hero_subtitle VARCHAR(500) NOT NULL,
  hero_background_image_url VARCHAR(500),
  logo_url VARCHAR(500),
  whatsapp VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  address VARCHAR(500),
  years_experience INT NOT NULL DEFAULT 20,
  happy_clients INT NOT NULL DEFAULT 15000,
  trips_completed INT NOT NULL DEFAULT 30,
  support_hours VARCHAR(50) NOT NULL DEFAULT '24/7',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_settings (
  id,
  hero_title,
  hero_subtitle,
  hero_background_image_url,
  logo_url,
  whatsapp,
  phone,
  email,
  address,
  years_experience,
  happy_clients,
  trips_completed,
  support_hours
)
VALUES (
  1,
  COALESCE(
    (SELECT title FROM public.hero_section ORDER BY created_at LIMIT 1),
    'اكتشف العالم مع قيصر للسياحة والسفر'
  ),
  COALESCE(
    (SELECT subtitle FROM public.hero_section ORDER BY created_at LIMIT 1),
    'مع قيصر للسياحة'
  ),
  (SELECT background_image_url FROM public.hero_section ORDER BY created_at LIMIT 1),
  (SELECT logo_url FROM public.website_settings ORDER BY created_at LIMIT 1),
  (SELECT whatsapp FROM public.website_settings ORDER BY created_at LIMIT 1),
  (SELECT phone1 FROM public.website_settings ORDER BY created_at LIMIT 1),
  (SELECT email FROM public.website_settings ORDER BY created_at LIMIT 1),
  (SELECT address FROM public.website_settings ORDER BY created_at LIMIT 1),
  COALESCE((SELECT years_experience FROM public.homepage_stats ORDER BY created_at LIMIT 1), 20),
  COALESCE((SELECT happy_clients FROM public.homepage_stats ORDER BY created_at LIMIT 1), 15000),
  COALESCE((SELECT trips_completed FROM public.homepage_stats ORDER BY created_at LIMIT 1), 30),
  COALESCE((SELECT support_hours FROM public.homepage_stats ORDER BY created_at LIMIT 1), '24/7')
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public site settings read" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated site settings management" ON public.site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==================== SIMPLE TRIPS ====================

UPDATE public.trips
SET category = 'trip'
WHERE category IS DISTINCT FROM 'umrah';

DROP TABLE IF EXISTS public.trip_images;

ALTER TABLE public.trips
  DROP COLUMN IF EXISTS nights,
  DROP COLUMN IF EXISTS remaining_seats,
  DROP COLUMN IF EXISTS featured;

ALTER TABLE public.trips
  ALTER COLUMN category SET DEFAULT 'trip';

ALTER TABLE public.trips
  ADD CONSTRAINT trips_category_check CHECK (category IN ('trip', 'umrah'));

-- ==================== PUBLIC BOOKING INBOX ONLY ====================

DROP TRIGGER IF EXISTS bookings_notify_admin ON public.bookings;
DROP FUNCTION IF EXISTS public.notify_admin_on_booking();
DROP TRIGGER IF EXISTS trips_notify_admin_on_status ON public.trips;
DROP FUNCTION IF EXISTS public.notify_admin_on_trip_status();

DROP POLICY IF EXISTS "Allow public booking requests" ON public.bookings;
DROP POLICY IF EXISTS "Admin full access" ON public.bookings;

ALTER TABLE public.bookings
  DROP COLUMN IF EXISTS customer_email,
  DROP COLUMN IF EXISTS trip_id,
  DROP COLUMN IF EXISTS room_type,
  DROP COLUMN IF EXISTS internal_notes,
  DROP COLUMN IF EXISTS booking_date,
  DROP COLUMN IF EXISTS updated_at;

CREATE POLICY "Public booking insert" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');

-- ==================== REMOVE ERP TABLES ====================

DROP TABLE IF EXISTS public.employees;
DROP TABLE IF EXISTS public.hotels;
DROP TABLE IF EXISTS public.visas;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.testimonials;
DROP TABLE IF EXISTS public.faqs;
DROP TABLE IF EXISTS public.gallery_images;
DROP TABLE IF EXISTS public.website_settings;
DROP TABLE IF EXISTS public.hero_section;
DROP TABLE IF EXISTS public.homepage_stats;

CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON public.gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_trips_category ON public.trips(category);
