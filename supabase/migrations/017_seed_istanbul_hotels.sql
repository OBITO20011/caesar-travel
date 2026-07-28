-- Seed the August Istanbul hotel packages supplied by Caesar Travel.
-- Stable UUIDs make this migration safe to rerun without duplicating packages.
-- Existing rows with these IDs are intentionally preserved so later admin edits
-- are not overwritten by a migration replay.

WITH hotel_seed AS (
  SELECT *
  FROM jsonb_to_recordset(
    $hotels$
    [
      {
        "id": "c0e70000-0000-4000-8000-000000000301",
        "title": "GRAND LIZA HOTEL",
        "location": "الفاتح، إسطنبول، تركيا",
        "stars": 3,
        "price": 355,
        "features": ["قريب من المدينة القديمة", "غرف عائلية", "موقع في منطقة الفاتح"],
        "stay_options": [{"days": 4, "nights": 3, "price": 355}, {"days": 5, "nights": 4, "price": 365}, {"days": 6, "nights": 5, "price": 375}, {"days": 7, "nights": 6, "price": 385}],
        "main_image_url": "/hotels/turkey/grand-liza-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/grand-liza-hotel/gallery-01.jpg", "/hotels/turkey/grand-liza-hotel/gallery-02.jpg", "/hotels/turkey/grand-liza-hotel/gallery-03.jpg", "/hotels/turkey/grand-liza-hotel/gallery-04.jpg", "/hotels/turkey/grand-liza-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000302",
        "title": "MONOPOL HOTEL",
        "location": "تقسيم، إسطنبول، تركيا",
        "stars": 3,
        "price": 360,
        "features": ["قريب من شارع الاستقلال", "خدمة غرف", "غرف مكيّفة"],
        "stay_options": [{"days": 4, "nights": 3, "price": 360}, {"days": 5, "nights": 4, "price": 370}, {"days": 6, "nights": 5, "price": 380}, {"days": 7, "nights": 6, "price": 390}],
        "main_image_url": "/hotels/turkey/monopol-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/monopol-hotel/gallery-01.jpg", "/hotels/turkey/monopol-hotel/gallery-02.jpg", "/hotels/turkey/monopol-hotel/gallery-03.jpg", "/hotels/turkey/monopol-hotel/gallery-04.jpg", "/hotels/turkey/monopol-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000303",
        "title": "ISTANBUL DORA HOTEL",
        "location": "شيشلي، إسطنبول، تركيا",
        "stars": 4,
        "price": 375,
        "features": ["موقع في شيشلي", "مطعم", "سبا ومرافق استرخاء"],
        "stay_options": [{"days": 4, "nights": 3, "price": 375}, {"days": 5, "nights": 4, "price": 390}, {"days": 6, "nights": 5, "price": 400}, {"days": 7, "nights": 6, "price": 430}],
        "main_image_url": "/hotels/turkey/istanbul-dora-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/istanbul-dora-hotel/gallery-01.png", "/hotels/turkey/istanbul-dora-hotel/gallery-02.jpg", "/hotels/turkey/istanbul-dora-hotel/gallery-03.jpg", "/hotels/turkey/istanbul-dora-hotel/gallery-04.jpg", "/hotels/turkey/istanbul-dora-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000304",
        "title": "MARMARAY HOTEL",
        "location": "الفاتح، إسطنبول، تركيا",
        "stars": 4,
        "price": 375,
        "features": ["موقع في منطقة الفاتح", "إنترنت لاسلكي", "غرف مكيّفة"],
        "stay_options": [{"days": 4, "nights": 3, "price": 375}, {"days": 5, "nights": 4, "price": 390}, {"days": 6, "nights": 5, "price": 400}, {"days": 7, "nights": 6, "price": 430}],
        "main_image_url": "/hotels/turkey/marmaray-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/marmaray-hotel/gallery-01.jpg", "/hotels/turkey/marmaray-hotel/gallery-02.jpg", "/hotels/turkey/marmaray-hotel/gallery-03.jpg", "/hotels/turkey/marmaray-hotel/gallery-04.jpg", "/hotels/turkey/marmaray-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000305",
        "title": "BRISTOL HOTEL",
        "location": "تقسيم، إسطنبول، تركيا",
        "stars": 4,
        "price": 375,
        "features": ["قريب من شارع الاستقلال", "قريب من برج غلطة", "إفطار يومي"],
        "stay_options": [{"days": 4, "nights": 3, "price": 375}, {"days": 5, "nights": 4, "price": 390}, {"days": 6, "nights": 5, "price": 410}, {"days": 7, "nights": 6, "price": 430}],
        "main_image_url": "/hotels/turkey/bristol-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/bristol-hotel/gallery-01.jpg", "/hotels/turkey/bristol-hotel/gallery-02.jpg", "/hotels/turkey/bristol-hotel/gallery-03.jpg", "/hotels/turkey/bristol-hotel/gallery-04.jpg", "/hotels/turkey/bristol-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000306",
        "title": "VATAN ASUR HOTEL",
        "location": "الفاتح، إسطنبول، تركيا",
        "stars": 4,
        "price": 375,
        "features": ["قريب من يني كابي", "مطعم", "سبا ومركز عافية"],
        "stay_options": [{"days": 4, "nights": 3, "price": 375}, {"days": 5, "nights": 4, "price": 390}, {"days": 6, "nights": 5, "price": 410}, {"days": 7, "nights": 6, "price": 440}],
        "main_image_url": "/hotels/turkey/vatan-asur-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/vatan-asur-hotel/gallery-01.jpg", "/hotels/turkey/vatan-asur-hotel/gallery-02.jpg", "/hotels/turkey/vatan-asur-hotel/gallery-03.jpg", "/hotels/turkey/vatan-asur-hotel/gallery-04.png", "/hotels/turkey/vatan-asur-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000307",
        "title": "CRESTIUM TAKSIM HOTEL",
        "location": "تقسيم، إسطنبول، تركيا",
        "stars": 4,
        "price": 395,
        "features": ["موقع مركزي في تقسيم", "سبا", "غرف عائلية"],
        "stay_options": [{"days": 4, "nights": 3, "price": 395}, {"days": 5, "nights": 4, "price": 420}, {"days": 6, "nights": 5, "price": 450}, {"days": 7, "nights": 6, "price": 480}],
        "main_image_url": "/hotels/turkey/crestium-taksim-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/crestium-taksim-hotel/gallery-01.jpg", "/hotels/turkey/crestium-taksim-hotel/gallery-02.jpg", "/hotels/turkey/crestium-taksim-hotel/gallery-03.jpg", "/hotels/turkey/crestium-taksim-hotel/gallery-04.jpg", "/hotels/turkey/crestium-taksim-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000308",
        "title": "CARTOON TAKSIM HOTEL",
        "location": "تقسيم، إسطنبول، تركيا",
        "stars": 4,
        "price": 400,
        "features": ["موقع في تقسيم", "مطعم وبار", "إنترنت لاسلكي"],
        "stay_options": [{"days": 4, "nights": 3, "price": 400}, {"days": 5, "nights": 4, "price": 420}, {"days": 6, "nights": 5, "price": 450}, {"days": 7, "nights": 6, "price": 480}],
        "main_image_url": "/hotels/turkey/cartoon-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/cartoon-hotel/gallery-01.jpg", "/hotels/turkey/cartoon-hotel/gallery-02.jpg", "/hotels/turkey/cartoon-hotel/gallery-03.jpg", "/hotels/turkey/cartoon-hotel/gallery-04.jpg", "/hotels/turkey/cartoon-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000309",
        "title": "CHER HOTEL",
        "location": "بيوغلو، إسطنبول، تركيا",
        "stars": 5,
        "price": 410,
        "features": ["فندق 5 نجوم", "سبا ومركز لياقة", "مطعم"],
        "stay_options": [{"days": 4, "nights": 3, "price": 410}, {"days": 5, "nights": 4, "price": 430}, {"days": 6, "nights": 5, "price": 460}, {"days": 7, "nights": 6, "price": 490}],
        "main_image_url": "/hotels/turkey/cher-hotel/main.jpg",
        "additional_image_urls": ["/hotels/turkey/cher-hotel/gallery-01.jpg", "/hotels/turkey/cher-hotel/gallery-02.jpg", "/hotels/turkey/cher-hotel/gallery-03.jpg", "/hotels/turkey/cher-hotel/gallery-04.jpg", "/hotels/turkey/cher-hotel/gallery-05.jpg"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000310",
        "title": "OTTOMAN'S LIFE HOTEL DELUXE",
        "location": "الفاتح، إسطنبول، تركيا",
        "stars": 5,
        "price": 460,
        "features": ["فندق 5 نجوم", "مفهوم ضيافة حلال", "سبا ومطعم"],
        "stay_options": [{"days": 4, "nights": 3, "price": 460}, {"days": 5, "nights": 4, "price": 480}, {"days": 6, "nights": 5, "price": 520}, {"days": 7, "nights": 6, "price": 550}],
        "main_image_url": "/hotels/turkey/ottomans-life-hotel-deluxe/main.webp",
        "additional_image_urls": ["/hotels/turkey/ottomans-life-hotel-deluxe/gallery-01.webp", "/hotels/turkey/ottomans-life-hotel-deluxe/gallery-02.webp", "/hotels/turkey/ottomans-life-hotel-deluxe/gallery-03.webp", "/hotels/turkey/ottomans-life-hotel-deluxe/gallery-04.webp", "/hotels/turkey/ottomans-life-hotel-deluxe/gallery-05.webp"]
      },
      {
        "id": "c0e70000-0000-4000-8000-000000000311",
        "title": "ELITE WORLD ISTANBUL TAKSIM",
        "location": "تقسيم، إسطنبول، تركيا",
        "stars": 5,
        "price": 460,
        "features": ["فندق 5 نجوم", "مطاعم", "سبا ومركز عافية"],
        "stay_options": [{"days": 4, "nights": 3, "price": 460}, {"days": 5, "nights": 4, "price": 480}, {"days": 6, "nights": 5, "price": 520}, {"days": 7, "nights": 6, "price": 550}],
        "main_image_url": "/hotels/turkey/elite-world-istanbul-taksim/main.jpg",
        "additional_image_urls": ["/hotels/turkey/elite-world-istanbul-taksim/gallery-01.jpg", "/hotels/turkey/elite-world-istanbul-taksim/gallery-02.jpg", "/hotels/turkey/elite-world-istanbul-taksim/gallery-03.jpg", "/hotels/turkey/elite-world-istanbul-taksim/gallery-04.jpg", "/hotels/turkey/elite-world-istanbul-taksim/gallery-05.jpg"]
      }
    ]
    $hotels$::jsonb
  ) AS hotel(
    id TEXT,
    title TEXT,
    location TEXT,
    stars SMALLINT,
    price NUMERIC,
    features JSONB,
    stay_options JSONB,
    main_image_url TEXT,
    additional_image_urls JSONB
  )
),
prepared AS (
  SELECT
    id::UUID AS id,
    title,
    location,
    stars,
    price,
    ARRAY(SELECT jsonb_array_elements_text(features)) AS hotel_features,
    stay_options,
    main_image_url,
    ARRAY(SELECT jsonb_array_elements_text(additional_image_urls)) AS additional_image_urls
  FROM hotel_seed
)
INSERT INTO public.trips (
  id,
  title,
  category,
  page_key,
  description,
  schedule_label,
  start_date,
  end_date,
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
  'turkey',
  E'تذكرة طيران عمّان – إسطنبول – عمّان على متن الملكية الأردنية.\nالاستقبال والتوصيل من وإلى المطار.\nالإقامة حسب المدة التي تختارها.\nوجبة إفطار يومية في الفندق.\nرحلة صبنجة والمعشوقية مجانًا مع وجبة غداء.\nجميع الضرائب مشمولة.\nالرحلات الداخلية الأخرى اختيارية: رحلتان +15 د.أ للشخص، 3 رحلات +25 د.أ، 4 رحلات +35 د.أ، 5 رحلات +40 د.أ.\nمتابعة من فريق قيصر للسياحة والسفر.',
  'رحلات شهر 8',
  NULL,
  NULL,
  price,
  'JOD',
  'الملكية الأردنية',
  'وجبة إفطار يومية في الفندق',
  3,
  'available',
  main_image_url,
  'السعر للشخص في الغرفة المزدوجة أو الثلاثية',
  additional_image_urls,
  location,
  stars,
  hotel_features,
  stay_options,
  false,
  true
FROM prepared
ON CONFLICT (id) DO NOTHING;
