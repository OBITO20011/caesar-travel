import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, ImagePlus, Loader2, Plus, Search, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hotelsService, imageService } from "@/services/admin";
import type { Hotel } from "@/types/admin";

type HotelForm = {
  name: string;
  city: string;
  description: string;
  star_rating: string;
  price_per_night: string;
  currency: string;
  image_url: string;
  facilities: string;
  enabled: boolean;
  featured: boolean;
};

const emptyForm: HotelForm = {
  name: "",
  city: "",
  description: "",
  star_rating: "3",
  price_per_night: "",
  currency: "JOD",
  image_url: "",
  facilities: "",
  enabled: true,
  featured: false,
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية.";
}

function formFromHotel(hotel: Hotel): HotelForm {
  return {
    name: hotel.name,
    city: hotel.city,
    description: hotel.description ?? "",
    star_rating: hotel.star_rating.toString(),
    price_per_night: hotel.price_per_night?.toString() ?? "",
    currency: hotel.currency,
    image_url: hotel.image_url ?? "",
    facilities: hotel.facilities.join("، "),
    enabled: hotel.enabled,
    featured: hotel.featured,
  };
}

function payloadFromForm(form: HotelForm): Omit<Hotel, "id" | "created_at" | "updated_at"> {
  return {
    name: form.name.trim(),
    city: form.city.trim(),
    description: form.description.trim() || undefined,
    star_rating: Number(form.star_rating) || 3,
    price_per_night: form.price_per_night ? Number(form.price_per_night) : undefined,
    currency: form.currency.trim().toUpperCase() || "JOD",
    image_url: form.image_url.trim() || undefined,
    facilities: form.facilities
      .split(/[،,]/)
      .map((item) => item.trim())
      .filter(Boolean),
    enabled: form.enabled,
    featured: form.featured,
  };
}

export function HotelManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<HotelForm>(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const hotelsQuery = useQuery({
    queryKey: ["admin-hotels", search],
    queryFn: () => hotelsService.getAll({ search: search.trim() || undefined }),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = payloadFromForm(form);
      return editing ? hotelsService.update(editing.id, payload) : hotelsService.create(payload);
    },
    onSuccess: async () => {
      await refresh();
      setDialogOpen(false);
      setFeedback(editing ? "تم تحديث الفندق." : "تمت إضافة الفندق.");
    },
    onError: (error) => setFormError(errorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: hotelsService.delete,
    onSuccess: async () => {
      await refresh();
      setFeedback("تم حذف الفندق.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(hotel: Hotel) {
    setEditing(hotel);
    setForm(formFromHotel(hotel));
    setFormError(null);
    setDialogOpen(true);
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await imageService.uploadToStorage(file, "admin-media", "hotels");
      setForm((current) => ({ ...current, image_url: url }));
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.city.trim()) {
      setFormError("اسم الفندق والمدينة مطلوبان.");
      return;
    }
    saveMutation.mutate();
  }

  const hotels = hotelsQuery.data ?? [];

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
              دليل الإقامة
            </Badge>
            <h1 className="text-3xl font-black text-slate-900">إدارة الفنادق</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              إدارة الفنادق والمدن والأسعار والتسهيلات والصور وحالة الظهور.
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            إضافة فندق
          </Button>
        </header>

        {feedback ? (
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-right text-sm text-sky-700"
          >
            {feedback}
          </button>
        ) : null}

        <Card className="border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="p-5">
            <label className="relative block">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pr-9"
                placeholder="بحث باسم الفندق أو المدينة"
              />
            </label>
          </CardContent>
        </Card>

        {hotelsQuery.isLoading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جاري تحميل الفنادق...
          </div>
        ) : hotelsQuery.isError ? (
          <div className="rounded-2xl bg-rose-50 p-8 text-center text-sm text-rose-600">
            {errorMessage(hotelsQuery.error)}
          </div>
        ) : hotels.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-12 text-center text-sm text-slate-500">
            لا توجد فنادق مطابقة.
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="overflow-hidden border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="h-44 bg-slate-100">
                  {hotel.image_url ? (
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">{hotel.name}</h2>
                      <p className="text-sm text-slate-500">{hotel.city}</p>
                    </div>
                    <Badge
                      className={
                        hotel.enabled
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {hotel.enabled ? "ظاهر" : "مخفي"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="h-4 w-4 fill-current" />
                      {hotel.star_rating} نجوم
                    </span>
                    <span className="font-semibold text-slate-800">
                      {hotel.price_per_night ?? "—"} {hotel.currency}
                    </span>
                  </div>
                  <div className="flex justify-end gap-1 border-t border-slate-100 pt-3">
                    <Button size="sm" variant="outline" onClick={() => openEdit(hotel)}>
                      <Edit3 className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-600"
                      onClick={() => {
                        if (window.confirm(`حذف ${hotel.name}؟`)) deleteMutation.mutate(hotel.id);
                      }}
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>{editing ? "تعديل الفندق" : "إضافة فندق"}</DialogTitle>
            <DialogDescription>
              أدخل معلومات الفندق التي ستستخدم في المحتوى والعروض.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="اسم الفندق">
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </Field>
              <Field label="المدينة">
                <Input
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                />
              </Field>
            </div>
            <Field label="الوصف">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="التصنيف">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={form.star_rating}
                  onChange={(event) => setForm({ ...form, star_rating: event.target.value })}
                />
              </Field>
              <Field label="السعر لليلة">
                <Input
                  type="number"
                  min="0"
                  value={form.price_per_night}
                  onChange={(event) => setForm({ ...form, price_per_night: event.target.value })}
                />
              </Field>
              <Field label="العملة">
                <Input
                  maxLength={3}
                  value={form.currency}
                  onChange={(event) => setForm({ ...form, currency: event.target.value })}
                />
              </Field>
            </div>
            <Field label="التسهيلات">
              <Input
                value={form.facilities}
                onChange={(event) => setForm({ ...form, facilities: event.target.value })}
                placeholder="واي فاي، إفطار، نقل"
              />
            </Field>
            <Field label="الصورة">
              <div className="flex gap-2">
                <Input
                  value={form.image_url}
                  onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                  placeholder="رابط الصورة"
                />
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  رفع
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => void uploadImage(event.target.files?.[0])}
                  />
                </label>
              </div>
            </Field>
            <div className="flex flex-wrap gap-5 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(event) => setForm({ ...form, enabled: event.target.checked })}
                />
                ظاهر في الموقع
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                />
                فندق مميز
              </label>
            </div>
            {formError ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending || uploading}
                className="bg-slate-900 text-white"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}حفظ
                الفندق
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
