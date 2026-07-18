import { supabase } from "@/lib/supabase";
import type { GalleryImage, SiteSettings, Trip, TripPageKey } from "@/types/admin";

export const tripsService = {
  async getAll(
    filters?: { category?: string; pageKey?: TripPageKey; status?: string; search?: string },
    page = 1,
    pageSize = 10,
  ) {
    let query = supabase.from("trips").select("*", { count: "exact" });

    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.pageKey) query = query.eq("page_key", filters.pageKey);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: (data as Trip[]) || [], count: count || 0 };
  },

  async create(trip: Omit<Trip, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("trips").insert([trip]).select().single();

    if (error) throw error;
    return data as Trip;
  },

  async update(id: string, trip: Partial<Trip>) {
    const { data, error } = await supabase
      .from("trips")
      .update({ ...trip, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Trip;
  },

  async delete(id: string) {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) throw error;
  },

  async getPublicByPage(pageKey: TripPageKey) {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("page_key", pageKey)
      .neq("status", "hidden")
      .order("start_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as Trip[]) || [];
  },

  async getPublicById(id: string) {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .neq("status", "hidden")
      .maybeSingle();

    if (error) throw error;
    return data as Trip | null;
  },
};

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as GalleryImage[]) || [];
  },

  async create(image: Omit<GalleryImage, "id" | "created_at">) {
    const { data, error } = await supabase.from("gallery").insert([image]).select().single();

    if (error) throw error;
    return data as GalleryImage;
  },

  async update(id: string, image: Partial<GalleryImage>) {
    const { data, error } = await supabase
      .from("gallery")
      .update(image)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as GalleryImage;
  },

  async delete(id: string) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;
  },
};

export const siteSettingsService = {
  async get() {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();

    if (error) throw error;
    return data as SiteSettings;
  },

  async update(settings: Partial<SiteSettings>) {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert({ ...settings, id: 1, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data as SiteSettings;
  },
};

export const imageService = {
  async uploadToStorage(file: File, bucket: string, folder: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },
};
