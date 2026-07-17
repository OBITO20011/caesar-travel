-- Complete the entities and policies required by the existing admin routes.
-- This migration intentionally extends 001 without modifying its published history.

-- ==================== HOTELS ====================

CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  description TEXT,
  star_rating INT NOT NULL DEFAULT 3 CHECK (star_rating BETWEEN 1 AND 5),
  price_per_night DECIMAL(10, 2),
  currency VARCHAR(3) NOT NULL DEFAULT 'JOD',
  image_url VARCHAR(500),
  facilities TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== VISAS ====================

CREATE TABLE IF NOT EXISTS visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  processing_time VARCHAR(255),
  price DECIMAL(10, 2),
  currency VARCHAR(3) NOT NULL DEFAULT 'JOD',
  image_url VARCHAR(500),
  enabled BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON hotels
  FOR SELECT USING (enabled = true);
CREATE POLICY "Allow public read" ON visas
  FOR SELECT USING (enabled = true);
CREATE POLICY "Admin full access" ON hotels
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON visas
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON employees
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public booking requests" ON bookings
  FOR INSERT WITH CHECK (status = 'new' AND internal_notes IS NULL);

CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_enabled ON hotels(enabled);
CREATE INDEX IF NOT EXISTS idx_visas_country ON visas(country);
CREATE INDEX IF NOT EXISTS idx_visas_enabled ON visas(enabled);

-- ==================== ADMIN MEDIA STORAGE ====================

INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

CREATE POLICY "Public admin media read" ON storage.objects
  FOR SELECT USING (bucket_id = 'admin-media');
CREATE POLICY "Authenticated admin media insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admin-media');
CREATE POLICY "Authenticated admin media update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'admin-media');
CREATE POLICY "Authenticated admin media delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'admin-media');
