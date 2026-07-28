-- Allow hotel and package offers to use a flexible monthly schedule such as
-- "رحلات شهر 8 و9 و10" instead of requiring one exact departure date.

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS schedule_label TEXT;

COMMENT ON COLUMN public.trips.schedule_label IS
  'Optional public-facing schedule text. When present it replaces the exact start date in public views.';

UPDATE public.trips
SET
  schedule_label = 'رحلات شهر 8 و9 و10',
  start_date = NULL,
  end_date = NULL,
  updated_at = NOW()
WHERE page_key = 'egypt'
  AND stay_options <> '[]'::jsonb;
