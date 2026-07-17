// Minimal type definitions for the public website CMS.

export type TripCategory = "trip" | "umrah";
export type TripStatus = "available" | "fully_booked" | "cancelled" | "completed" | "hidden";

export interface Trip {
  id: string;
  name: string;
  category: TripCategory;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  currency: string;
  makkah_hotel?: string;
  madinah_hotel?: string;
  meals?: string;
  airline?: string;
  seats: number;
  main_image_url?: string;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_background_image_url?: string;
  logo_url?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  years_experience: number;
  happy_clients: number;
  trips_completed: number;
  support_hours: string;
  updated_at: string;
}
