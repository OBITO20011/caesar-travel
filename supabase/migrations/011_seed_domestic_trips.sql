-- Seed the domestic-tourism packages supplied by Caesar Travel.
-- Dates are intentionally omitted because the source posters contain past dates.
-- ON CONFLICT and the title guard keep this migration safe to run more than once.

INSERT INTO public.trips (
  id,
  title,
  category,
  page_key,
  description,
  price,
  currency,
  nights,
  total_seats,
  remaining_seats,
  status,
  main_image_url,
  is_featured,
  is_visible
)
SELECT
  seed.id,
  seed.title,
  'tourism',
  'domestic',
  seed.description,
  seed.price,
  'JOD',
  seed.nights,
  0,
  0,
  'available',
  seed.main_image_url,
  false,
  true
FROM (
  VALUES
    (
      'cae50000-0000-4000-8000-000000001001'::uuid,
      'مبيت العقبة وزيارة البتراء',
      'مبيت ليلة واحدة في فندق الزيتونة بالعقبة مع وجبة إفطار، وزيارة البتراء، ورحلات بحرية اختيارية، ومندوب مرافق من الشركة. مواعيد دورية — تواصل معنا لمعرفة أقرب موعد.',
      20::numeric,
      1,
      '/images/domestic/aqaba-overnight.webp'
    ),
    (
      'cae50000-0000-4000-8000-000000001002'::uuid,
      'عجلون وجرش',
      'رحلة يوم كامل تشمل تلفريك عجلون، وقلعة الربض، وآثار جرش وسوقها الحرفي، مع نقل سياحي ودليل مرافق. مواعيد دورية — تواصل معنا لمعرفة أقرب موعد.',
      10::numeric,
      0,
      '/images/domestic/ajloun-jerash.webp'
    ),
    (
      'cae50000-0000-4000-8000-000000001003'::uuid,
      'السلط ووادي شعيب',
      'جولة في السلط ووادي شعيب تشمل شارع الحمام، ومتحف أبو جابر، ومقام النبي يوشع، وإطلالات مميزة، مع نقل سياحي ومرشد مرافق. مواعيد دورية — تواصل معنا لمعرفة أقرب موعد.',
      10::numeric,
      0,
      '/images/domestic/salt-wadi-shuaib.webp'
    ),
    (
      'cae50000-0000-4000-8000-000000001004'::uuid,
      'المثلث الذهبي: العقبة ووادي رم والبتراء',
      'يومان وليلة تشمل العقبة، والمبيت في مخيم وادي رم مع العشاء والفطور، وسهرة ومراقبة النجوم، وزيارة البتراء. تتوفر أنشطة بحرية وصحراوية اختيارية، وسعر الشخص في الغرفة الثنائية 30 دينارًا. مواعيد دورية — تواصل معنا لمعرفة أقرب موعد.',
      25::numeric,
      1,
      '/images/domestic/golden-triangle.webp'
    ),
    (
      'cae50000-0000-4000-8000-000000001005'::uuid,
      'عراق الأمير وجبل القلعة وقرية الحِجرة',
      'رحلة يوم كامل إلى عراق الأمير وجبل القلعة وقرية الحِجرة، تشمل مواصلات سياحية مريحة، ودليلًا سياحيًا مرخصًا، ووجبة غداء في مطعم سياحي. مواعيد دورية — تواصل معنا لمعرفة أقرب موعد.',
      10::numeric,
      0,
      '/images/domestic/iraq-al-amir.webp'
    )
) AS seed (id, title, description, price, nights, main_image_url)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.trips AS existing
  WHERE existing.page_key = 'domestic'
    AND existing.title = seed.title
)
ON CONFLICT (id) DO NOTHING;
