import { supabase } from '@/lib/supabase';
import {
  Trip,
  Booking,
  GalleryImage,
  Testimonial,
  FAQ,
  Employee,
  WebsiteSettings,
  HeroSection,
  HomepageStats,
  Service,
  Notification,
  TripImage,
  Hotel,
  Visa,
} from '@/types/admin';

// ==================== TRIPS ====================

export const tripsService = {
  // Get all trips with filters
  async getAll(
    filters?: { category?: string; status?: string; search?: string },
    page = 1,
    pageSize = 10
  ) {
    let query = supabase.from('trips').select('*', { count: 'exact' });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data as Trip[]) || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .select('*, trip_images(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('trips')
      .insert([trip])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, trip: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update({ ...trip, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (error) throw error;
  },

  async duplicate(id: string) {
    const trip = await this.getById(id);
    const newTrip = {
      ...trip,
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
      trip_images: undefined,
      name: `${trip.name} (نسخة)`,
    };
    return this.create(newTrip);
  },
};

// ==================== TRIP IMAGES ====================

export const tripImagesService = {
  async getAll(tripId: string) {
    const { data, error } = await supabase
      .from('trip_images')
      .select('*')
      .eq('trip_id', tripId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as TripImage[]) || [];
  },

  async add(tripId: string, imageUrl: string, displayOrder = 0) {
    const { data, error } = await supabase
      .from('trip_images')
      .insert([{ trip_id: tripId, image_url: imageUrl, display_order: displayOrder }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(imageId: string) {
    const { error } = await supabase.from('trip_images').delete().eq('id', imageId);
    if (error) throw error;
  },

  async reorder(imageId: string, displayOrder: number) {
    const { data, error } = await supabase
      .from('trip_images')
      .update({ display_order: displayOrder })
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== HOTELS ====================

export const hotelsService = {
  async getAll(filters?: { search?: string; enabled?: boolean }) {
    let query = supabase.from('hotels').select('*').order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }
    if (filters?.enabled !== undefined) {
      query = query.eq('enabled', filters.enabled);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as Hotel[]) || [];
  },

  async create(hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('hotels').insert([hotel]).select().single();
    if (error) throw error;
    return data as Hotel;
  },

  async update(id: string, hotel: Partial<Hotel>) {
    const { data, error } = await supabase
      .from('hotels')
      .update({ ...hotel, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Hotel;
  },

  async delete(id: string) {
    const { error } = await supabase.from('hotels').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== VISAS ====================

export const visasService = {
  async getAll(filters?: { search?: string; enabled?: boolean }) {
    let query = supabase.from('visas').select('*').order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`country.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.enabled !== undefined) {
      query = query.eq('enabled', filters.enabled);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as Visa[]) || [];
  },

  async create(visa: Omit<Visa, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('visas').insert([visa]).select().single();
    if (error) throw error;
    return data as Visa;
  },

  async update(id: string, visa: Partial<Visa>) {
    const { data, error } = await supabase
      .from('visas')
      .update({ ...visa, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Visa;
  },

  async delete(id: string) {
    const { error } = await supabase.from('visas').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== BOOKINGS ====================

export const bookingsService = {
  async getAll(
    filters?: { status?: string; search?: string; tripId?: string },
    page = 1,
    pageSize = 10
  ) {
    let query = supabase.from('bookings').select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.tripId) {
      query = query.eq('trip_id', filters.tripId);
    }
    if (filters?.search) {
      query = query.or(
        `customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to).order('booking_date', { ascending: false });

    if (error) throw error;
    return { data: (data as Booking[]) || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addInternalNote(id: string, note: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ internal_notes: note, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== GALLERY ====================

export const galleryService = {
  async getAll(page = 1, pageSize = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data: (data as GalleryImage[]) || [], count: count || 0 };
  },

  async create(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([image])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, image: Partial<GalleryImage>) {
    const { data, error } = await supabase
      .from('gallery_images')
      .update({ ...image, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(items: Array<{ id: string; display_order: number }>) {
    const updates = items.map((item) =>
      supabase
        .from('gallery_images')
        .update({ display_order: item.display_order, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) throw errors[0].error;
  },
};

// ==================== TESTIMONIALS ====================

export const testimonialsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data as Testimonial[]) || [];
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, testimonial: Partial<Testimonial>) {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...testimonial, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== FAQ ====================

export const faqService = {
  async getAll() {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data as FAQ[]) || [];
  },

  async create(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('faqs').insert([faq]).select().single();

    if (error) throw error;
    return data;
  },

  async update(id: string, faq: Partial<FAQ>) {
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...faq, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== EMPLOYEES ====================

export const employeesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Employee[]) || [];
  },

  async create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, employee: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update({ ...employee, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== WEBSITE SETTINGS ====================

export const settingsService = {
  async get() {
    const { data, error } = await supabase.from('website_settings').select('*').limit(1).single();

    if (error) throw error;
    return data as WebsiteSettings;
  },

  async update(settings: Partial<WebsiteSettings>) {
    const { data, error } = await supabase
      .from('website_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', (await this.get()).id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== HERO SECTION ====================

export const heroService = {
  async get() {
    const { data, error } = await supabase.from('hero_section').select('*').limit(1).single();

    if (error) throw error;
    return data as HeroSection;
  },

  async update(hero: Partial<HeroSection>) {
    const { data, error } = await supabase
      .from('hero_section')
      .update({ ...hero, updated_at: new Date().toISOString() })
      .eq('id', (await this.get()).id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== HOMEPAGE STATS ====================

export const statsService = {
  async get() {
    const { data, error } = await supabase.from('homepage_stats').select('*').limit(1).single();

    if (error) throw error;
    return data as HomepageStats;
  },

  async update(stats: Partial<HomepageStats>) {
    const { data, error } = await supabase
      .from('homepage_stats')
      .update({ ...stats, updated_at: new Date().toISOString() })
      .eq('id', (await this.get()).id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== SERVICES ====================

export const servicesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data as Service[]) || [];
  },

  async create(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, service: Partial<Service>) {
    const { data, error } = await supabase
      .from('services')
      .update({ ...service, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== NOTIFICATIONS ====================

export const notificationsService = {
  async getAll(unreadOnly = false) {
    let query = supabase.from('notifications').select('*');

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Notification[]) || [];
  },

  async markAsRead(id: string) {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);

    if (error) throw error;
  },

  async create(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== IMAGE UPLOAD ====================

export const imageService = {
  async uploadToStorage(file: File, bucket: string, folder: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteFromStorage(bucket: string, filePath: string) {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) throw error;
  },
};
