import type { LucideIcon } from "lucide-react";
import {
  Building2,
  FileCheck2,
  Hotel,
  Landmark,
  Map,
  Mountain,
  Palmtree,
  Plane,
  PlaneTakeoff,
  Sparkles,
  Waves,
} from "lucide-react";

import type { TripPageKey } from "@/types/admin";

export type AssistantServiceId = "packages" | "domestic" | "umrah" | "visas" | "flights" | "hajj";

export interface AssistantChoice {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface AssistantDestination extends AssistantChoice {
  pageKey: TripPageKey;
  path: string;
}

export const serviceChoices: AssistantChoice[] = [
  {
    id: "packages",
    label: "فنادق وباقات خارجية",
    description: "اختر الوجهة والمدة والميزانية",
    icon: Hotel,
  },
  {
    id: "domestic",
    label: "سياحة داخل الأردن",
    description: "رحلات يومية ومبيت داخل المملكة",
    icon: Mountain,
  },
  {
    id: "umrah",
    label: "رحلات العمرة",
    description: "اعثر على برنامج العمرة الأنسب",
    icon: Landmark,
  },
  {
    id: "visas",
    label: "التأشيرات",
    description: "الدول والمتطلبات والأسعار",
    icon: FileCheck2,
  },
  {
    id: "flights",
    label: "تذاكر الطيران",
    description: "عروض رحلات جوية متاحة",
    icon: PlaneTakeoff,
  },
  {
    id: "hajj",
    label: "رحلات الحج",
    description: "البرامج المتاحة وخدمة الاستفسار",
    icon: Sparkles,
  },
];

export const destinationChoices: AssistantDestination[] = [
  {
    id: "egypt",
    pageKey: "egypt",
    path: "/egypt",
    label: "مصر",
    description: "شرم الشيخ والمنتجعات",
    icon: Waves,
  },
  {
    id: "turkey",
    pageKey: "turkey",
    path: "/turkey-trip",
    label: "تركيا",
    description: "فنادق وبرامج سياحية",
    icon: Building2,
  },
  {
    id: "dubai",
    pageKey: "dubai",
    path: "/dubai",
    label: "دبي",
    description: "إقامات وتجارب عائلية",
    icon: Palmtree,
  },
  {
    id: "switzerland",
    pageKey: "switzerland",
    path: "/packages/switzerland",
    label: "سويسرا",
    description: "جبال وبحيرات ومدن أوروبية",
    icon: Mountain,
  },
  {
    id: "maldives",
    pageKey: "maldives",
    path: "/packages/maldives",
    label: "المالديف",
    description: "جزر ومنتجعات بحرية",
    icon: Waves,
  },
  {
    id: "georgia",
    pageKey: "georgia",
    path: "/packages/georgia",
    label: "جورجيا",
    description: "طبيعة وبرامج متنوعة",
    icon: Map,
  },
  {
    id: "hotels",
    pageKey: "hotels",
    path: "/packages/hotels",
    label: "فنادق أخرى",
    description: "خيارات إقامة في وجهات متعددة",
    icon: Hotel,
  },
];

export const directPageByService: Partial<
  Record<AssistantServiceId, { pageKey?: TripPageKey; path: string; title: string }>
> = {
  domestic: {
    pageKey: "domestic",
    path: "/packages/domestic",
    title: "السياحة الداخلية",
  },
  umrah: { pageKey: "umrah", path: "/umrah", title: "رحلات العمرة" },
  visas: { path: "/visa", title: "التأشيرات" },
  flights: {
    pageKey: "flights",
    path: "/packages/flights",
    title: "عروض الطيران",
  },
  hajj: { pageKey: "hajj", path: "/hajj", title: "رحلات الحج" },
};

export function getDestination(pageKey: TripPageKey) {
  return destinationChoices.find((destination) => destination.pageKey === pageKey);
}

export function getServiceChoice(id: AssistantServiceId) {
  return serviceChoices.find((service) => service.id === id);
}

export const budgetChoices = [
  { value: 400, label: "حتى ٤٠٠ د.أ" },
  { value: 500, label: "حتى ٥٠٠ د.أ" },
  { value: 700, label: "حتى ٧٠٠ د.أ" },
  { value: null, label: "بدون حد" },
] as const;

export const durationChoices = [4, 5, 6, 7] as const;

export const assistantFallbackIcon = Plane;
