-- Connect Turkey to the shared trip/package CMS and add reusable hotel details.
-- The migration is idempotent so it can be safely applied after the existing schema.

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS hotel_location TEXT,
  ADD COLUMN IF NOT EXISTS hotel_stars SMALLINT
    CHECK (hotel_stars IS NULL OR hotel_stars BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS hotel_features TEXT[] NOT NULL DEFAULT '{}';

DO $$
BEGIN
  IF to_regclass('public.trips') IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'trips'
        AND column_name = 'page_key'
    )
  THEN
    ALTER TABLE public.trips
      DROP CONSTRAINT IF EXISTS trips_page_key_check;

    ALTER TABLE public.trips
      ADD CONSTRAINT trips_page_key_check
      CHECK (
        page_key IN (
          'general',
          'umrah',
          'hajj',
          'egypt',
          'turkey',
          'dubai',
          'switzerland',
          'maldives',
          'georgia',
          'domestic',
          'flights',
          'hotels'
        )
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS trips_hotel_package_idx
  ON public.trips (page_key, hotel_stars, created_at DESC);
