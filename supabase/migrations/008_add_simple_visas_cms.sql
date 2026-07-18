-- Add the public visa content section to the simplified CMS.
-- This migration is standalone, idempotent, and does not reference legacy ERP tables.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.visas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(12, 2) CHECK (price IS NULL OR price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'JOD',
  card_image_url TEXT,
  banner_image_url TEXT,
  visa_types JSONB NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(visa_types) = 'array'),
  requirements TEXT[] NOT NULL DEFAULT '{}',
  processing_time TEXT NOT NULL DEFAULT '1 - 3 أيام عمل',
  validity TEXT NOT NULL DEFAULT 'حسب النوع',
  availability TEXT NOT NULL DEFAULT 'متاحة لمعظم الجنسيات',
  notice TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS visas_display_order_idx
  ON public.visas (display_order);
CREATE INDEX IF NOT EXISTS visas_is_active_idx
  ON public.visas (is_active);

ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active visas" ON public.visas;
CREATE POLICY "Public can read active visas"
  ON public.visas
  FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated admins manage visas" ON public.visas;
CREATE POLICY "Authenticated admins manage visas"
  ON public.visas
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.visas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visas TO authenticated;

WITH seed (
  id,
  country_name,
  slug,
  headline,
  summary,
  description,
  card_image_url,
  banner_image_url,
  first_icon,
  first_title,
  first_description,
  transit_description,
  notice,
  display_order
) AS (
  VALUES
    (
      'c0e50000-0000-4000-8000-000000000401'::uuid,
      'السعودية',
      'saudi',
      'تأشيرة المملكة العربية السعودية',
      'تأشيرات سياحية وزيارة وأعمال',
      'نوفر إصدار تأشيرات السعودية السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-saudi.jpg',
      '/images/saudi-banner.jpg',
      '🕌',
      'تأشيرة العمرة',
      'إصدار تأشيرات العمرة بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر السعودية.',
      NULL,
      1
    ),
    (
      'c0e50000-0000-4000-8000-000000000402'::uuid,
      'الإمارات',
      'uae',
      'تأشيرة الإمارات العربية المتحدة',
      'تأشيرات سياحية وتجارية',
      'نوفر إصدار تأشيرات الإمارات العربية المتحدة السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-uae.jpg',
      '/images/uae-banner.png',
      '🕌',
      'تأشيرة الإمارات العربية المتحدة',
      'إصدار تأشيرات الإمارات العربية المتحدة بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر الإمارات.',
      NULL,
      2
    ),
    (
      'c0e50000-0000-4000-8000-000000000403'::uuid,
      'قطر',
      'qatar',
      'تأشيرة قطر',
      'تأشيرات سياحية وزيارة',
      'نوفر إصدار تأشيرات قطر السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-qatar.jpg',
      '/images/qatar-banner.png',
      '🕌',
      'تأشيرة قطر',
      'إصدار تأشيرات قطر بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر قطر.',
      NULL,
      3
    ),
    (
      'c0e50000-0000-4000-8000-000000000404'::uuid,
      'سوريا',
      'syria',
      'تأشيرة سوريا',
      'تأشيرات سياحية',
      'نوفر إصدار تأشيرات سوريا السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-syria.jpg',
      '/images/syria-banner.png',
      '🕌',
      'تأشيرة سوريا',
      'إصدار تأشيرات سوريا بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر سوريا.',
      'بشرى للسوريين — أصبح بإمكان المواطنين السوريين التقديم على التأشيرة السياحية للمملكة العربية السعودية.',
      4
    ),
    (
      'c0e50000-0000-4000-8000-000000000405'::uuid,
      'شنغن',
      'schengen',
      'تأشيرة شنغن',
      'دول الاتحاد الأوروبي',
      'نوفر إصدار تأشيرات شنغن السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-schengen.jpg',
      '/images/schengen-banner.png',
      '🕌',
      'تأشيرة شنغن',
      'إصدار تأشيرات شنغن بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر دول شنغن.',
      NULL,
      5
    ),
    (
      'c0e50000-0000-4000-8000-000000000406'::uuid,
      'بريطانيا',
      'uk',
      'تأشيرة المملكة المتحدة',
      'تأشيرات زيارة وسياحة',
      'نوفر إصدار تأشيرات المملكة المتحدة السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-uk.jpg',
      '/images/uk-banner.png',
      '🕌',
      'تأشيرة المملكة المتحدة',
      'إصدار تأشيرات المملكة المتحدة بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر المملكة المتحدة.',
      NULL,
      6
    ),
    (
      'c0e50000-0000-4000-8000-000000000407'::uuid,
      'أمريكا',
      'usa',
      'تأشيرة الولايات المتحدة الأمريكية',
      'تأشيرات سياحية وأعمال',
      'نوفر إصدار تأشيرات الولايات المتحدة الأمريكية السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.',
      '/images/visa-usa.jpg',
      '/images/usa-banner.png',
      '🕌',
      'تأشيرة الولايات المتحدة الأمريكية',
      'إصدار تأشيرات الولايات المتحدة الأمريكية بسرعة مع متابعة كاملة حتى صدورها.',
      'تأشيرة عبور للمسافرين عبر الولايات المتحدة الأمريكية.',
      NULL,
      7
    )
)
INSERT INTO public.visas (
  id,
  country_name,
  slug,
  headline,
  summary,
  description,
  currency,
  card_image_url,
  banner_image_url,
  visa_types,
  requirements,
  processing_time,
  validity,
  availability,
  notice,
  display_order,
  is_active
)
SELECT
  id,
  country_name,
  slug,
  headline,
  summary,
  description,
  'JOD',
  card_image_url,
  banner_image_url,
  jsonb_build_array(
    jsonb_build_object('icon', first_icon, 'title', first_title, 'description', first_description),
    jsonb_build_object('icon', '🧳', 'title', 'التأشيرة السياحية', 'description', 'تأشيرات سياحية متعددة أو مفردة حسب المتطلبات.'),
    jsonb_build_object('icon', '👨‍👩‍👧', 'title', 'تأشيرة الزيارة', 'description', 'زيارة عائلية أو شخصية مع تجهيز كامل للملف.'),
    jsonb_build_object('icon', '💼', 'title', 'تأشيرة الأعمال', 'description', 'إصدار تأشيرات رجال الأعمال والشركات.'),
    jsonb_build_object('icon', '✈️', 'title', 'ترانزيت', 'description', transit_description),
    jsonb_build_object('icon', '📋', 'title', 'استشارة مجانية', 'description', 'تواصل معنا لمعرفة أفضل نوع تأشيرة يناسبك.')
  ),
  ARRAY[
    'جواز سفر ساري لمدة 6 أشهر.',
    'صورة شخصية بخلفية بيضاء.',
    'تعبئة نموذج الطلب.',
    'حجز فندقي (عند الحاجة).',
    'حجز طيران مبدئي.'
  ],
  '1 - 3 أيام عمل',
  'حسب النوع',
  'متاحة لمعظم الجنسيات',
  notice,
  display_order,
  true
FROM seed
ON CONFLICT (slug) DO NOTHING;
