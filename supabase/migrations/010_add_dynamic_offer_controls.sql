-- Optional dynamic offer controls for every trip/package.

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS old_price NUMERIC(12, 2)
    CHECK (old_price IS NULL OR old_price >= 0),
  ADD COLUMN IF NOT EXISTS offer_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;

UPDATE public.trips
SET is_visible = false
WHERE status = 'hidden';

CREATE INDEX IF NOT EXISTS trips_public_offer_idx
  ON public.trips (is_visible, offer_ends_at);

DROP POLICY IF EXISTS "Public can read visible trips" ON public.trips;
CREATE POLICY "Public can read visible trips"
  ON public.trips
  FOR SELECT
  TO anon
  USING (
    status <> 'hidden'
    AND is_visible = true
    AND (offer_ends_at IS NULL OR offer_ends_at > now())
  );
