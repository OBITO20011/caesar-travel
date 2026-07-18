-- Populate blank CMS settings with the values already used by the public website.
-- Existing non-blank admin values are always preserved.

INSERT INTO public.site_settings (
  id,
  company_name,
  logo_url,
  hero_title,
  hero_subtitle,
  hero_image_url,
  phone,
  whatsapp,
  email,
  address,
  map_embed_url,
  years_experience,
  happy_customers,
  completed_trips,
  support_hours
)
VALUES (
  1,
  'قيصر للسياحة والسفر',
  '/assets/caesar-mark.png',
  'اكتشف العالم مع قيصر للسياحة والسفر',
  'مع قيصر للسياحة',
  '/assets/hero-hajj.jpg',
  '0795 207 900, 0798 337 711, 0798 691 003',
  '962795207900',
  'info@caesar-travel.com',
  'الرمثا، الأردن — Plus Code: H268+P7',
  'https://maps.google.com/maps?q=H268%2BP7%20Ramtha%20Jordan&z=16&output=embed',
  20,
  15000,
  30,
  '24/7'
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.site_settings
SET
  company_name = COALESCE(NULLIF(BTRIM(company_name), ''), 'قيصر للسياحة والسفر'),
  logo_url = COALESCE(NULLIF(BTRIM(logo_url), ''), '/assets/caesar-mark.png'),
  hero_title = COALESCE(
    NULLIF(BTRIM(hero_title), ''),
    'اكتشف العالم مع قيصر للسياحة والسفر'
  ),
  hero_subtitle = COALESCE(NULLIF(BTRIM(hero_subtitle), ''), 'مع قيصر للسياحة'),
  hero_image_url = COALESCE(NULLIF(BTRIM(hero_image_url), ''), '/assets/hero-hajj.jpg'),
  phone = COALESCE(
    NULLIF(BTRIM(phone), ''),
    '0795 207 900, 0798 337 711, 0798 691 003'
  ),
  whatsapp = COALESCE(NULLIF(BTRIM(whatsapp), ''), '962795207900'),
  email = COALESCE(NULLIF(BTRIM(email), ''), 'info@caesar-travel.com'),
  address = COALESCE(
    NULLIF(BTRIM(address), ''),
    'الرمثا، الأردن — Plus Code: H268+P7'
  ),
  map_embed_url = COALESCE(
    NULLIF(BTRIM(map_embed_url), ''),
    'https://maps.google.com/maps?q=H268%2BP7%20Ramtha%20Jordan&z=16&output=embed'
  ),
  years_experience = COALESCE(years_experience, 20),
  happy_customers = COALESCE(happy_customers, 15000),
  completed_trips = COALESCE(completed_trips, 30),
  support_hours = COALESCE(NULLIF(BTRIM(support_hours), ''), '24/7'),
  updated_at = now()
WHERE id = 1
  AND (
    NULLIF(BTRIM(company_name), '') IS NULL
    OR NULLIF(BTRIM(logo_url), '') IS NULL
    OR NULLIF(BTRIM(hero_title), '') IS NULL
    OR NULLIF(BTRIM(hero_subtitle), '') IS NULL
    OR NULLIF(BTRIM(hero_image_url), '') IS NULL
    OR NULLIF(BTRIM(phone), '') IS NULL
    OR NULLIF(BTRIM(whatsapp), '') IS NULL
    OR NULLIF(BTRIM(email), '') IS NULL
    OR NULLIF(BTRIM(address), '') IS NULL
    OR NULLIF(BTRIM(map_embed_url), '') IS NULL
    OR years_experience IS NULL
    OR happy_customers IS NULL
    OR completed_trips IS NULL
    OR NULLIF(BTRIM(support_hours), '') IS NULL
  );
