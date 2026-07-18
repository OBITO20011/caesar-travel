-- Extend the existing trips CMS to the additional public package sections.
-- No new tables or data are created by this migration.

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
