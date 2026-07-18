import galleryFlight from "@/assets/gallery-flight.jpg";
import galleryGeorgia from "@/assets/gallery-georgia.jpg";
import galleryHotel from "@/assets/gallery-hotel.jpg";
import galleryMaldives from "@/assets/gallery-maldives.jpg";
import galleryPetra from "@/assets/gallery-petra.jpg";
import gallerySwitzerland from "@/assets/gallery-switzerland.jpg";
import type { TripPageKey } from "@/types/admin";

export type PackageDestinationSlug =
  "switzerland" | "maldives" | "georgia" | "domestic" | "flights" | "hotels";

export interface PackageDestination {
  slug: PackageDestinationSlug;
  pageKey: TripPageKey;
  title: string;
  adminTitle: string;
  description: string;
  image: string;
  icon: string;
}

export const packageDestinations: PackageDestination[] = [
  {
    slug: "switzerland",
    pageKey: "switzerland",
    title: "رحلات سويسرا",
    adminTitle: "باقات سويسرا",
    description: "تجارب ساحرة بين جبال الألب والبحيرات والمدن الأوروبية الأنيقة.",
    image: gallerySwitzerland,
    icon: "🇨🇭",
  },
  {
    slug: "maldives",
    pageKey: "maldives",
    title: "رحلات المالديف",
    adminTitle: "باقات المالديف",
    description: "استجمام فاخر وشواطئ استثنائية في أجمل جزر المحيط الهندي.",
    image: galleryMaldives,
    icon: "🏝️",
  },
  {
    slug: "georgia",
    pageKey: "georgia",
    title: "رحلات جورجيا",
    adminTitle: "باقات جورجيا",
    description: "طبيعة خضراء ومدن تاريخية وبرامج تناسب العائلات والشباب.",
    image: galleryGeorgia,
    icon: "🇬🇪",
  },
  {
    slug: "domestic",
    pageKey: "domestic",
    title: "السياحة الداخلية",
    adminTitle: "باقات السياحة الداخلية",
    description: "اكتشف جمال الأردن من البتراء ووادي رم إلى البحر الميت وجرش.",
    image: galleryPetra,
    icon: "🇯🇴",
  },
  {
    slug: "flights",
    pageKey: "flights",
    title: "عروض الطيران",
    adminTitle: "باقات وعروض الطيران",
    description: "عروض مختارة على تذاكر الطيران إلى وجهات عربية وعالمية.",
    image: galleryFlight,
    icon: "✈️",
  },
  {
    slug: "hotels",
    pageKey: "hotels",
    title: "عروض حجز الفنادق",
    adminTitle: "باقات حجز الفنادق",
    description: "إقامات مختارة بعناية تناسب مختلف الميزانيات والوجهات.",
    image: galleryHotel,
    icon: "🏨",
  },
];

export function getPackageDestination(slug: string) {
  return packageDestinations.find((destination) => destination.slug === slug);
}

export const galleryPackagePaths: Record<string, string> = {
  سويسرا: "/packages/switzerland",
  المالديف: "/packages/maldives",
  جورجيا: "/packages/georgia",
  "السياحة الداخلية": "/packages/domestic",
  الطيران: "/packages/flights",
  "حجز الفنادق": "/packages/hotels",
  "حجز الفنادق ": "/packages/hotels",
};
