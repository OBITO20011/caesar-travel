import type { Visa, VisaTypeOption } from "@/types/admin";

const requirements = [
  "جواز سفر ساري لمدة 6 أشهر.",
  "صورة شخصية بخلفية بيضاء.",
  "تعبئة نموذج الطلب.",
  "حجز فندقي (عند الحاجة).",
  "حجز طيران مبدئي.",
];

const sharedTypes: VisaTypeOption[] = [
  {
    icon: "🧳",
    title: "التأشيرة السياحية",
    description: "تأشيرات سياحية متعددة أو مفردة حسب المتطلبات.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "تأشيرة الزيارة",
    description: "زيارة عائلية أو شخصية مع تجهيز كامل للملف.",
  },
  {
    icon: "💼",
    title: "تأشيرة الأعمال",
    description: "إصدار تأشيرات رجال الأعمال والشركات.",
  },
];

function visa(
  id: string,
  slug: string,
  countryName: string,
  headline: string,
  summary: string,
  description: string,
  cardImageUrl: string,
  bannerImageUrl: string,
  firstType: VisaTypeOption,
  order: number,
  notice?: string,
): Visa {
  return {
    id,
    slug,
    country_name: countryName,
    headline,
    summary,
    description,
    currency: "JOD",
    card_image_url: cardImageUrl,
    banner_image_url: bannerImageUrl,
    visa_types: [
      firstType,
      ...sharedTypes,
      {
        icon: "✈️",
        title: "ترانزيت",
        description: `تأشيرة عبور للمسافرين عبر ${countryName}.`,
      },
      {
        icon: "📋",
        title: "استشارة مجانية",
        description: "تواصل معنا لمعرفة أفضل نوع تأشيرة يناسبك.",
      },
    ],
    requirements: [...requirements],
    processing_time: "1 - 3 أيام عمل",
    validity: "حسب النوع",
    availability: "متاحة لمعظم الجنسيات",
    notice,
    display_order: order,
    is_active: true,
    created_at: "",
    updated_at: "",
  };
}

export const fallbackVisas: Visa[] = [
  visa(
    "visa-fallback-saudi",
    "saudi",
    "السعودية",
    "تأشيرة المملكة العربية السعودية",
    "تأشيرات سياحية وزيارة وأعمال",
    "نوفر إصدار تأشيرات السعودية السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-saudi.jpg",
    "/images/saudi-banner.jpg",
    {
      icon: "🕌",
      title: "تأشيرة العمرة",
      description: "إصدار تأشيرات العمرة بسرعة مع متابعة كاملة حتى صدورها.",
    },
    1,
  ),
  visa(
    "visa-fallback-uae",
    "uae",
    "الإمارات",
    "تأشيرة الإمارات العربية المتحدة",
    "تأشيرات سياحية وتجارية",
    "نوفر إصدار تأشيرات الإمارات العربية المتحدة السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-uae.jpg",
    "/images/uae-banner.png",
    {
      icon: "🕌",
      title: "تأشيرة الإمارات العربية المتحدة",
      description: "إصدار تأشيرات الإمارات العربية المتحدة بسرعة مع متابعة كاملة حتى صدورها.",
    },
    2,
  ),
  visa(
    "visa-fallback-qatar",
    "qatar",
    "قطر",
    "تأشيرة قطر",
    "تأشيرات سياحية وزيارة",
    "نوفر إصدار تأشيرات قطر السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-qatar.jpg",
    "/images/qatar-banner.png",
    {
      icon: "🕌",
      title: "تأشيرة قطر",
      description: "إصدار تأشيرات قطر بسرعة مع متابعة كاملة حتى صدورها.",
    },
    3,
  ),
  visa(
    "visa-fallback-syria",
    "syria",
    "سوريا",
    "تأشيرة سوريا",
    "تأشيرات سياحية",
    "نوفر إصدار تأشيرات سوريا السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-syria.jpg",
    "/images/syria-banner.png",
    {
      icon: "🕌",
      title: "تأشيرة سوريا",
      description: "إصدار تأشيرات سوريا بسرعة مع متابعة كاملة حتى صدورها.",
    },
    4,
    "بشرى للسوريين — أصبح بإمكان المواطنين السوريين التقديم على التأشيرة السياحية للمملكة العربية السعودية.",
  ),
  visa(
    "visa-fallback-schengen",
    "schengen",
    "شنغن",
    "تأشيرة شنغن",
    "دول الاتحاد الأوروبي",
    "نوفر إصدار تأشيرات شنغن السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-schengen.jpg",
    "/images/schengen-banner.png",
    {
      icon: "🕌",
      title: "تأشيرة شنغن",
      description: "إصدار تأشيرات شنغن بسرعة مع متابعة كاملة حتى صدورها.",
    },
    5,
  ),
  visa(
    "visa-fallback-uk",
    "uk",
    "بريطانيا",
    "تأشيرة المملكة المتحدة",
    "تأشيرات زيارة وسياحة",
    "نوفر إصدار تأشيرات المملكة المتحدة السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-uk.jpg",
    "/images/uk-banner.png",
    {
      icon: "🕌",
      title: "تأشيرة المملكة المتحدة",
      description: "إصدار تأشيرات المملكة المتحدة بسرعة مع متابعة كاملة حتى صدورها.",
    },
    6,
  ),
  visa(
    "visa-fallback-usa",
    "usa",
    "أمريكا",
    "تأشيرة الولايات المتحدة الأمريكية",
    "تأشيرات سياحية وأعمال",
    "نوفر إصدار تأشيرات الولايات المتحدة الأمريكية السياحية والزيارة والأعمال بسرعة وسهولة مع متابعة كاملة حتى صدور التأشيرة.",
    "/images/visa-usa.jpg",
    "/images/usa-banner.png",
    {
      icon: "🕌",
      title: "تأشيرة الولايات المتحدة الأمريكية",
      description: "إصدار تأشيرات الولايات المتحدة الأمريكية بسرعة مع متابعة كاملة حتى صدورها.",
    },
    7,
  ),
];

export function getFallbackVisa(slug: string) {
  return fallbackVisas.find((item) => item.slug === slug);
}
