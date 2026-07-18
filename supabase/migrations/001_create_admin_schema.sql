-- Enable UUID and other extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== AUTH & USERS ====================

-- Create admin employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff', -- admin, staff, manager
  permissions JSONB DEFAULT '{"trips": true, "bookings": true, "gallery": true}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== WEBSITE SETTINGS ====================

-- Website configuration
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) DEFAULT 'قيصر للسياحة والسفر',
  logo_url VARCHAR(500),
  phone1 VARCHAR(20) DEFAULT '0795 207 900',
  phone2 VARCHAR(20) DEFAULT '0798 337 711',
  phone3 VARCHAR(20) DEFAULT '0798 691 003',
  whatsapp VARCHAR(20) DEFAULT '962795207900',
  email VARCHAR(255) DEFAULT 'info@caesar-travel.com',
  address VARCHAR(500) DEFAULT 'الرمثا، الأردن',
  map_embed_url VARCHAR(1000),
  map_directions_url VARCHAR(1000),
  facebook VARCHAR(500),
  instagram VARCHAR(500),
  tiktok VARCHAR(500),
  youtube VARCHAR(500),
  working_hours VARCHAR(255) DEFAULT '8am - 6pm',
  about_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== HERO SECTION ====================

-- Hero section content
CREATE TABLE IF NOT EXISTS hero_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) DEFAULT 'اكتشف العالم مع قيصر للسياحة والسفر',
  subtitle VARCHAR(500) DEFAULT 'مع قيصر للسياحة',
  description TEXT DEFAULT 'رحلات حج وعمرة وسياحة داخلية وخارجية، وحجوزات طيران وفنادق وتأشيرات بأفضل الأسعار وخدمة احترافية منذ أكثر من 20 عاماً.',
  background_image_url VARCHAR(500),
  cta_button_text VARCHAR(100) DEFAULT 'احجز الآن',
  cta_button_link VARCHAR(255) DEFAULT '/gallery',
  whatsapp_button_text VARCHAR(100) DEFAULT 'واتساب',
  secondary_button_text VARCHAR(100) DEFAULT 'استكشف الخدمات',
  secondary_button_link VARCHAR(255) DEFAULT '/services',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== HOMEPAGE STATISTICS ====================

-- Homepage statistics card
CREATE TABLE IF NOT EXISTS homepage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  years_experience INT DEFAULT 20,
  happy_clients INT DEFAULT 15000,
  trips_completed INT DEFAULT 30,
  support_hours VARCHAR(50) DEFAULT '24/7',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== TRIPS ====================

-- Trips/packages offered
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- umrah, hajj, tourism, flight
  description TEXT,
  start_date DATE,
  end_date DATE,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'JOD',
  makkah_hotel VARCHAR(255),
  madinah_hotel VARCHAR(255),
  nights INT,
  meals VARCHAR(100), -- breakfast, full board, etc
  airline VARCHAR(255),
  seats INT DEFAULT 0,
  remaining_seats INT DEFAULT 0,
  main_image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'available', -- available, fully_booked, cancelled, completed, hidden
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trip gallery images
CREATE TABLE IF NOT EXISTS trip_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== BOOKINGS ====================

-- Customer bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20) NOT NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  trip_name VARCHAR(255),
  people_count INT DEFAULT 1,
  room_type VARCHAR(50), -- single, double, triple, family
  notes TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, confirmed, cancelled, completed
  internal_notes TEXT,
  booking_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== GALLERY ====================

-- Gallery images with metadata
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  destination VARCHAR(255),
  description TEXT,
  display_order INT DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  link VARCHAR(255), -- Route to link to when clicked
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== TESTIMONIALS ====================

-- Customer testimonials/reviews
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  comment TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== FAQ ====================

-- Frequently asked questions
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== NOTIFICATIONS ====================

-- System notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50), -- booking_new, trip_completed, trip_cancelled
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_id UUID, -- booking_id or trip_id
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== SERVICES ====================

-- Services/offerings
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100), -- lucide icon name
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to read public data
CREATE POLICY "Allow public read" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON homepage_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON trips FOR SELECT USING (status != 'hidden');
CREATE POLICY "Allow public read" ON trip_images FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON gallery_images FOR SELECT USING (enabled = true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);

-- Create policies for admins to manage data
CREATE POLICY "Admin full access" ON website_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON hero_section FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON homepage_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON trips FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON trip_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON notifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_trips_category ON trips(category);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_gallery_order ON gallery_images(display_order);
CREATE INDEX idx_testimonials_order ON testimonials(display_order);
CREATE INDEX idx_faqs_order ON faqs(sort_order);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ==================== INITIAL DATA ====================

-- Insert default settings
INSERT INTO website_settings (
  company_name, phone1, phone2, phone3, whatsapp, email, address, working_hours
) VALUES (
  'قيصر للسياحة والسفر',
  '0795 207 900',
  '0798 337 711',
  '0798 691 003',
  '962795207900',
  'info@caesar-travel.com',
  'الرمثا، الأردن',
  '8am - 6pm'
) ON CONFLICT DO NOTHING;

-- Insert default hero section
INSERT INTO hero_section (
  title, subtitle, description, cta_button_text, secondary_button_text
) VALUES (
  'اكتشف العالم مع قيصر للسياحة والسفر',
  'مع قيصر للسياحة',
  'رحلات حج وعمرة وسياحة داخلية وخارجية، وحجوزات طيران وفنادق وتأشيرات بأفضل الأسعار وخدمة احترافية منذ أكثر من 20 عاماً.',
  'احجز الآن',
  'استكشف الخدمات'
) ON CONFLICT DO NOTHING;

-- Insert default stats
INSERT INTO homepage_stats (
  years_experience, happy_clients, trips_completed, support_hours
) VALUES (
  20, 15000, 30, '24/7'
) ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO services (title, description, icon_name, display_order) VALUES
('الحج', 'برامج حج متكاملة تشمل الإقامة القريبة والنقل والإرشاد، بتنظيم يليق بضيوف الرحمن.', 'Compass', 0),
('العمرة', 'باقات عمرة مرنة على مدار العام بأسعار تنافسية وخدمة راقية من الوصول حتى العودة.', 'Moon', 1),
('حجز الطيران', 'أفضل أسعار تذاكر الطيران لجميع الوجهات مع خطوط عالمية وإقليمية موثوقة.', 'Plane', 2),
('حجز الفنادق', 'فنادق مختارة بعناية في كل الوجهات، من الاقتصادي إلى الفاخر خمس نجوم.', 'Hotel', 3),
('السياحة الداخلية', 'اكتشف كنوز الأردن: البتراء، وادي رم، البحر الميت وجرش، ببرامج عائلية وشبابية.', 'Mountain', 4),
('السياحة الخارجية', 'رحلات عالمية إلى تركيا، دبي، مصر، أوروبا وآسيا بتجارب لا تُنسى.', 'Globe2', 5),
('خدمات التأشيرات', 'استخراج التأشيرات السياحية والعلاجية بسرعة وموثوقية ومتابعة كاملة لطلبك.', 'FileCheck', 6),
('رحلات الشركات', 'تنظيم رحلات ومؤتمرات ووفود العمل بترتيبات احترافية متكاملة.', 'Building2', 7)
ON CONFLICT DO NOTHING;
