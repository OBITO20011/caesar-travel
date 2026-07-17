// Type definitions for Admin CMS entities

export type TripCategory = 'umrah' | 'hajj' | 'tourism' | 'flight';
export type TripStatus = 'available' | 'fully_booked' | 'cancelled' | 'completed' | 'hidden';
export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled' | 'completed';
export type EmployeeRole = 'admin' | 'staff' | 'manager';
export type NotificationType = 'booking_new' | 'trip_completed' | 'trip_cancelled';

// Website Settings
export interface WebsiteSettings {
  id: string;
  company_name: string;
  logo_url?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  map_embed_url?: string;
  map_directions_url?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  working_hours?: string;
  about_text?: string;
  created_at: string;
  updated_at: string;
}

// Hero Section
export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  background_image_url?: string;
  cta_button_text: string;
  cta_button_link: string;
  whatsapp_button_text: string;
  secondary_button_text: string;
  secondary_button_link: string;
  created_at: string;
  updated_at: string;
}

// Homepage Statistics
export interface HomepageStats {
  id: string;
  years_experience: number;
  happy_clients: number;
  trips_completed: number;
  support_hours: string;
  created_at: string;
  updated_at: string;
}

// Trip
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
  nights?: number;
  meals?: string;
  airline?: string;
  seats: number;
  remaining_seats: number;
  main_image_url?: string;
  status: TripStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Trip with images
export interface TripWithImages extends Trip {
  images?: TripImage[];
}

// Trip Image
export interface TripImage {
  id: string;
  trip_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

// Booking
export interface Booking {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  trip_id?: string;
  trip_name?: string;
  people_count: number;
  room_type?: string;
  notes?: string;
  status: BookingStatus;
  internal_notes?: string;
  booking_date: string;
  created_at: string;
  updated_at: string;
}

// Gallery Image
export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  destination?: string;
  description?: string;
  display_order: number;
  enabled: boolean;
  link?: string;
  created_at: string;
  updated_at: string;
}

// Testimonial
export interface Testimonial {
  id: string;
  customer_name: string;
  photo_url?: string;
  comment: string;
  rating: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// FAQ
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Notification
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

// Employee
export interface Employee {
  id: string;
  email: string;
  name: string;
  role: EmployeeRole;
  permissions?: Record<string, boolean>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Service
export interface Service {
  id: string;
  title: string;
  description?: string;
  icon_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
