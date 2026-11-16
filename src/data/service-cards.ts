import { Compass, FileCheck, Globe2, Hotel, Moon, Mountain, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Service cards shown on the home page and /services.
 * Keep descriptions factual: no unconfirmed promises (hotel distance, "best prices",
 * corporate trips, medical visas) until the owner confirms them.
 */
export const SERVICE_CARDS: ServiceCard[] = [
  {
    icon: Compass,
    title: "الحج",
    description: "التسجيل والحجز في برامج الحج، مع تفاصيل كل برنامج قبل التسجيل.",
  },
  {
    icon: Moon,
    title: "العمرة",
    description: "برامج عمرة بالطيران، وتفاصيل وأسعار كل برنامج على الموقع وعلى واتساب.",
  },
  {
    icon: Plane,
    title: "حجز الطيران",
    description: "حجز تذاكر الطيران لوجهتك، وبنبعتلك الخيارات المتاحة على واتساب.",
  },
  {
    icon: Hotel,
    title: "حجز الفنادق",
    description: "حجز فنادق حسب الوجهة والميزانية.",
  },
  {
    icon: Mountain,
    title: "السياحة الداخلية",
    description: "رحلات داخل الأردن، مثل البتراء ووادي رم والعقبة وجرش.",
  },
  {
    icon: Globe2,
    title: "السياحة الخارجية",
    description: "رحلات وباقات خارجية، مثل تركيا ومصر ودبي.",
  },
  {
    icon: FileCheck,
    title: "خدمات التأشيرات",
    description: "المساعدة في طلبات التأشيرات السياحية ومتابعة الطلب.",
  },
];
