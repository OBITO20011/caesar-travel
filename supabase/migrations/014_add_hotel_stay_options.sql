-- Store multiple stay lengths and per-person prices on one hotel package.
-- This keeps one public card per hotel while making every option editable in admin.

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS stay_options JSONB NOT NULL DEFAULT '[]'::JSONB;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.trips'::regclass
      AND conname = 'trips_stay_options_array_check'
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_stay_options_array_check
      CHECK (jsonb_typeof(stay_options) = 'array');
  END IF;
END
$$;

COMMENT ON COLUMN public.trips.stay_options IS
  'Array of hotel package options: [{days, nights, price}]';
