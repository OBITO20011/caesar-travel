// Minimal type definitions for the public website CMS.

export type TripCategory = "tourism" | "umrah";
export type TripPageKey =
  | "general"
  | "umrah"
  | "hajj"
  | "egypt"
  | "dubai"
  | "switzerland"
  | "maldives"
  | "georgia"
  | "domestic"
  | "flights"
  | "hotels";
export type TripStatus = "available" | "fully_booked" | "cancelled" | "completed" | "hidden";

export interface Trip {
  id: string;
  title: string;
  category: TripCategory;
  page_key: TripPageKey;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  old_price?: number | null;
  currency: string;
  makkah_hotel?: string;
  madinah_hotel?: string;
  meals?: string;
  airline?: string;
  nights: number;
  total_seats: number;
  remaining_seats: number;
  main_image_url?: string;
  room_type?: string;
  double_price?: number;
  triple_price?: number;
  quad_price?: number;
  additional_image_urls: string[];
  madinah_image_url?: string;
  status: TripStatus;
  is_featured: boolean;
  is_visible: boolean;
  offer_ends_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface VisaTypeOption {
  icon: string;
  title: string;
  description: string;
}

export interface Visa {
  id: string;
  country_name: string;
  slug: string;
  headline: string;
  summary: string;
  description: string;
  price?: number;
  currency: string;
  card_image_url?: string;
  banner_image_url?: string;
  visa_types: VisaTypeOption[];
  requirements: string[];
  processing_time: string;
  validity: string;
  availability: string;
  notice?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  logo_url?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  map_embed_url?: string;
  years_experience: number;
  happy_customers: number;
  completed_trips: number;
  support_hours: string;
  updated_at: string;
}
