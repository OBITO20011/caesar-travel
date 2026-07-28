-- Replace the old Egypt demo cards with the real Sharm El Sheikh hotel collection.
-- Existing admin edits are preserved once stay options have been populated.

UPDATE public.trips
SET
  is_visible = false,
  status = 'hidden',
  updated_at = now()
WHERE id IN (
  'c0e50000-0000-4000-8000-000000000202',
  'c0e50000-0000-4000-8000-000000000203',
  'c0e50000-0000-4000-8000-000000000204'
)
  AND page_key = 'egypt'
  AND title IN ('Address Sky View', 'Armani Hotel', 'JW Marriott Marquis');

WITH hotel_seed AS (
  SELECT *
  FROM jsonb_to_recordset(
    $hotels$
    [
      {
        "id": "c0e50000-0000-4000-8000-000000000201",
        "title": "AMARINA SUN RESORT AND AQUA PARK",
        "slug": "amarina-sun-resort-aqua-park",
        "meals": "SOFT ALL",
        "price": 380,
        "features": ["منتجع 5 نجوم", "أكوا بارك", "مناسب للعائلات", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 380}, {"days": 5, "nights": 4, "price": 420}, {"days": 6, "nights": 5, "price": 460}, {"days": 7, "nights": 6, "price": 490}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000210",
        "title": "AMWAJ RESORT HOTEL",
        "slug": "amwaj-resort-hotel",
        "meals": "SOFT ALL",
        "price": 400,
        "features": ["منتجع 5 نجوم", "مسابح ومساحات خارجية", "مناسب للعائلات", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 400}, {"days": 5, "nights": 4, "price": 450}, {"days": 6, "nights": 5, "price": 490}, {"days": 7, "nights": 6, "price": 540}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000211",
        "title": "AURORA ORIENTAL RESORT",
        "slug": "aurora-oriental-resort",
        "meals": "SOFT ALL",
        "price": 430,
        "features": ["منتجع 5 نجوم", "أجواء شرقية هادئة", "مسابح ومساحات خضراء", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 430}, {"days": 5, "nights": 4, "price": 470}, {"days": 6, "nights": 5, "price": 525}, {"days": 7, "nights": 6, "price": 580}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000212",
        "title": "DREAMS BEACH RESORT",
        "slug": "dreams-beach-resort",
        "meals": "SOFT ALL",
        "price": 430,
        "features": ["منتجع 5 نجوم", "إطلالات بحرية", "مسابح ومرافق ترفيهية", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 430}, {"days": 5, "nights": 4, "price": 470}, {"days": 6, "nights": 5, "price": 525}, {"days": 7, "nights": 6, "price": 580}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000213",
        "title": "JAZ SHARM DREAMS",
        "slug": "jaz-sharm-dreams",
        "meals": "SOFT ALL",
        "price": 430,
        "features": ["منتجع 5 نجوم", "موقع مميز في شرم الشيخ", "مسابح ومساحات خارجية", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 430}, {"days": 5, "nights": 4, "price": 470}, {"days": 6, "nights": 5, "price": 525}, {"days": 7, "nights": 6, "price": 580}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000214",
        "title": "CLEOPATRA LUXURY RESORT ADULTS ONLY +16",
        "slug": "cleopatra-luxury-adults-only",
        "meals": "SOFT ALL",
        "price": 440,
        "features": ["للبالغين +16", "منتجع 5 نجوم", "أجواء هادئة", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 440}, {"days": 5, "nights": 4, "price": 499}, {"days": 6, "nights": 5, "price": 560}, {"days": 7, "nights": 6, "price": 620}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000215",
        "title": "XPERIENCE KIROSEIZ PREMIER",
        "slug": "xperience-kiroseiz-premier",
        "meals": "SOFT ALL",
        "price": 470,
        "features": ["منتجع 5 نجوم", "مرافق ترفيهية متنوعة", "مسابح ومساحات خارجية", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 470}, {"days": 5, "nights": 4, "price": 530}, {"days": 6, "nights": 5, "price": 599}, {"days": 7, "nights": 6, "price": 670}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000216",
        "title": "CHARMILLION GARDENS AQUA PARK",
        "slug": "charmillion-gardens-aqua-park",
        "meals": "SOFT ALL",
        "price": 480,
        "features": ["منتجع 5 نجوم", "أكوا بارك", "مناسب للعائلات", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 480}, {"days": 5, "nights": 4, "price": 540}, {"days": 6, "nights": 5, "price": 610}, {"days": 7, "nights": 6, "price": 680}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000217",
        "title": "MÖVENPICK RESORT SHARM EL SHEIKH",
        "slug": "movenpick-sharm-el-sheikh",
        "meals": "SOFT ALL",
        "price": 490,
        "features": ["منتجع 5 نجوم", "إطلالات على البحر", "مسابح وشاطئ", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 490}, {"days": 5, "nights": 4, "price": 550}, {"days": 6, "nights": 5, "price": 620}, {"days": 7, "nights": 6, "price": 690}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000218",
        "title": "CORAL SEA HOLIDAY RESORT",
        "slug": "coral-sea-holiday-resort",
        "meals": "SOFT ALL",
        "price": 490,
        "features": ["منتجع 5 نجوم", "مناسب للعائلات", "مسابح ومرافق ترفيهية", "نظام Soft All"],
        "stay_options": [{"days": 4, "nights": 3, "price": 490}, {"days": 5, "nights": 4, "price": 550}, {"days": 6, "nights": 5, "price": 620}, {"days": 7, "nights": 6, "price": 690}]
      },
      {
        "id": "c0e50000-0000-4000-8000-000000000219",
        "title": "BARON RESORT SHARM EL SHEIKH",
        "slug": "baron-resort",
        "meals": "PREMIUM ALL-INCLUSIVE",
        "price": 550,
        "features": ["منتجع 5 نجوم", "Premium All Inclusive", "إطلالات بحرية", "خدمة فاخرة"],
        "stay_options": [{"days": 4, "nights": 3, "price": 550}, {"days": 5, "nights": 4, "price": 640}, {"days": 6, "nights": 5, "price": 730}, {"days": 7, "nights": 6, "price": 820}]
      }
    ]
    $hotels$::jsonb
  ) AS hotel(
    id TEXT,
    title TEXT,
    slug TEXT,
    meals TEXT,
    price NUMERIC,
    features JSONB,
    stay_options JSONB
  )
),
prepared AS (
  SELECT
    id::UUID AS id,
    title,
    slug,
    meals,
    price,
    ARRAY(SELECT jsonb_array_elements_text(features)) AS hotel_features,
    stay_options
  FROM hotel_seed
)
INSERT INTO public.trips AS existing (
  id,
  title,
  category,
  page_key,
  description,
  price,
  currency,
  airline,
  meals,
  nights,
  status,
  main_image_url,
  room_type,
  additional_image_urls,
  hotel_location,
  hotel_stars,
  hotel_features,
  stay_options,
  is_featured,
  is_visible
)
SELECT
  id,
  title,
  'tourism',
  'egypt',
  E'تذاكر طيران ذهابًا وإيابًا على متن الملكية الأردنية.\nالاستقبال والتوديع من وإلى المطار.\nالإقامة حسب المدة التي تختارها.\nجميع الوجبات والمشروبات حسب نظام الفندق.\nمتابعة من فريق قيصر للسياحة والسفر.',
  price,
  'JOD',
  'الملكية الأردنية',
  meals,
  3,
  'available',
  format('/hotels/egypt/%s/main.jpg', slug),
  'السعر للشخص في الغرفة الثنائية أو الثلاثية',
  ARRAY(
    SELECT format(
      '/hotels/egypt/%s/gallery-%s.jpg',
      slug,
      to_char(image_number, 'FM00')
    )
    FROM generate_series(1, 6) AS image_number
  ),
  'شرم الشيخ، مصر',
  5,
  hotel_features,
  stay_options,
  false,
  true
FROM prepared
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  page_key = EXCLUDED.page_key,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  airline = EXCLUDED.airline,
  meals = EXCLUDED.meals,
  nights = EXCLUDED.nights,
  status = EXCLUDED.status,
  main_image_url = EXCLUDED.main_image_url,
  room_type = EXCLUDED.room_type,
  additional_image_urls = EXCLUDED.additional_image_urls,
  hotel_location = EXCLUDED.hotel_location,
  hotel_stars = EXCLUDED.hotel_stars,
  hotel_features = EXCLUDED.hotel_features,
  stay_options = EXCLUDED.stay_options,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  updated_at = now()
WHERE existing.page_key = 'egypt'
  AND existing.stay_options = '[]'::jsonb;
