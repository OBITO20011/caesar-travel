import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Edit3,
  ImagePlus,
  Images,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

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
import { imageService, tripImagesService, tripsService } from "@/services/admin";
import type { Trip, TripCategory, TripImage, TripStatus } from "@/types/admin";

const PAGE_SIZE = 10;

const categoryLabels: Record<TripCategory, string> = {
  umrah: "عمرة",
  hajj: "حج",
  tourism: "سياحة",
  flight: "طيران",
};

const statusLabels: Record<TripStatus, string> = {
  available: "متاحة",
  fully_booked: "مكتملة الحجز",
  cancelled: "ملغاة",
  completed: "مكتملة",
  hidden: "مخفية",
};

const statusClasses: Record<TripStatus, string> = {
  available: "bg-emerald-100 text-emerald-700",
  fully_booked: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-sky-100 text-sky-700",
  hidden: "bg-slate-100 text-slate-600",
};

type TripForm = {
  name: string;
  category: TripCategory;
  description: string;
  start_date: string;
  end_date: string;
  price: string;
  currency: string;
  makkah_hotel: string;
  madinah_hotel: string;
  nights: string;
  meals: string;
  airline: string;
  seats: string;
  remaining_seats: string;
  main_image_url: string;
  status: TripStatus;
  featured: boolean;
};

function emptyForm(category: TripCategory = "tourism"): TripForm {
  return {
    name: "",
    category,
    description: "",
    start_date: "",
    end_date: "",
    price: "",
    currency: "JOD",
    makkah_hotel: "",
    madinah_hotel: "",
    nights: "",
    meals: "",
    airline: "",
    seats: "0",
    remaining_seats: "0",
    main_image_url: "",
    status: "available",
    featured: false,
  };
}

function formFromTrip(trip: Trip): TripForm {
  return {
    name: trip.name,
    category: trip.category,
    description: trip.description ?? "",
    start_date: trip.start_date ?? "",
    end_date: trip.end_date ?? "",
    price: trip.price?.toString() ?? "",
    currency: trip.currency,
    makkah_hotel: trip.makkah_hotel ?? "",
    madinah_hotel: trip.madinah_hotel ?? "",
    nights: trip.nights?.toString() ?? "",
    meals: trip.meals ?? "",
    airline: trip.airline ?? "",
    seats: trip.seats.toString(),
    remaining_seats: trip.remaining_seats.toString(),
    main_image_url: trip.main_image_url ?? "",
    status: trip.status,
    featured: trip.featured,
  };
}

function toTripPayload(form: TripForm): Omit<Trip, "id" | "created_at" | "updated_at"> {
  return {
    name: form.name.trim(),
    category: form.category,
    description: form.description.trim() || undefined,
    start_date: form.start_date || undefined,
    end_date: form.end_date || undefined,
    price: form.price ? Number(form.price) : undefined,
    currency: form.currency.trim().toUpperCase() || "JOD",
    makkah_hotel: form.makkah_hotel.trim() || undefined,
    madinah_hotel: form.madinah_hotel.trim() || undefined,
    nights: form.nights ? Number(form.nights) : undefined,
    meals: form.meals.trim() || undefined,
    airline: form.airline.trim() || undefined,
    seats: Number(form.seats) || 0,
    remaining_seats: Number(form.remaining_seats) || 0,
    main_image_url: form.main_image_url.trim() || undefined,
    status: form.status,
    featured: form.featured,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية. حاول مرة أخرى.";
}

function formatPrice(trip: Trip) {
  if (trip.price === undefined || trip.price === null) return "—";

  return new Intl.NumberFormat("ar-JO", {
    style: "currency",
    currency: trip.currency || "JOD",
    maximumFractionDigits: 0,
  }).format(trip.price);
}

interface TripManagerProps {
  title: string;
  description: string;
  category?: TripCategory;
}

export function TripManager({ title, description, category }: TripManagerProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form, setForm] = useState<TripForm>(() => emptyForm(category));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryTrip, setGalleryTrip] = useState<Trip | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const filters = {
    category: (category ?? categoryFilter) || undefined,
    status: statusFilter || undefined,
    search: search.trim() || undefined,
  };

  const tripsQuery = useQuery({
    queryKey: ["admin-trips", filters, page],
    queryFn: () => tripsService.getAll(filters, page, PAGE_SIZE),
  });

  const galleryQuery = useQuery({
    queryKey: ["admin-trip-images", galleryTrip?.id],
    queryFn: () => tripImagesService.getAll(galleryTrip!.id),
    enabled: Boolean(galleryTrip),
  });

  const refreshTrips = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = toTripPayload(form);
      return editingTrip
        ? tripsService.update(editingTrip.id, payload)
        : tripsService.create(payload);
    },
    onSuccess: async () => {
      await refreshTrips();
      setDialogOpen(false);
      setEditingTrip(null);
      setFeedback(editingTrip ? "تم تحديث الرحلة بنجاح." : "تمت إضافة الرحلة بنجاح.");
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: tripsService.delete,
    onSuccess: async () => {
      await refreshTrips();
      setFeedback("تم حذف الرحلة.");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
  });

  const duplicateMutation = useMutation({
    mutationFn: tripsService.duplicate,
    onSuccess: async () => {
      await refreshTrips();
      setFeedback("تم إنشاء نسخة من الرحلة.");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: tripImagesService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-trip-images", galleryTrip?.id] });
    },
    onError: (error) => setGalleryError(getErrorMessage(error)),
  });

  const reorderGalleryMutation = useMutation({
    mutationFn: async (images: TripImage[]) => {
      await Promise.all(images.map((image, index) => tripImagesService.reorder(image.id, index)));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-trip-images", galleryTrip?.id] });
    },
    onError: (error) => setGalleryError(getErrorMessage(error)),
  });

  const trips = tripsQuery.data?.data ?? [];
  const totalCount = tripsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function openCreateDialog() {
    setEditingTrip(null);
    setForm(emptyForm(category));
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(trip: Trip) {
    setEditingTrip(trip);
    setForm(formFromTrip(trip));
    setFormError(null);
    setDialogOpen(true);
  }

  function openGalleryDialog(trip: Trip) {
    setGalleryTrip(trip);
    setGalleryError(null);
  }

  async function uploadImage(file?: File) {
    if (!file) return;

    setUploading(true);
    setFormError(null);
    try {
      const imageUrl = await imageService.uploadToStorage(file, "admin-media", "trips");
      setForm((current) => ({ ...current, main_image_url: imageUrl }));
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function uploadGalleryImage(file?: File) {
    if (!file || !galleryTrip) return;

    setGalleryUploading(true);
    setGalleryError(null);
    try {
      const imageUrl = await imageService.uploadToStorage(file, "admin-media", "trips");
      await tripImagesService.add(galleryTrip.id, imageUrl, galleryQuery.data?.length ?? 0);
      await queryClient.invalidateQueries({
        queryKey: ["admin-trip-images", galleryTrip.id],
      });
    } catch (error) {
      setGalleryError(getErrorMessage(error));
    } finally {
      setGalleryUploading(false);
    }
  }

  function moveGalleryImage(imageIndex: number, direction: -1 | 1) {
    const images = [...(galleryQuery.data ?? [])];
    const targetIndex = imageIndex + direction;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    [images[imageIndex], images[targetIndex]] = [images[targetIndex], images[imageIndex]];
    reorderGalleryMutation.mutate(images);
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError("اسم الرحلة مطلوب.");
      return;
    }

    saveMutation.mutate();
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
              إدارة المحتوى
            </Badge>
            <h1 className="text-3xl font-black text-slate-900">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            إضافة {category === "umrah" ? "باقة عمرة" : "رحلة"}
          </Button>
        </header>

        {feedback ? (
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right text-sm text-emerald-700"
          >
            {feedback}
          </button>
        ) : null}

        <Card className="border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
              <label className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="بحث بالاسم أو الوصف"
                  className="pr-9"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">كل الحالات</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {category ? (
                <div className="flex h-9 items-center rounded-md border border-input bg-slate-50 px-3 text-sm text-slate-600">
                  التصنيف: {categoryLabels[category]}
                </div>
              ) : (
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setPage(1);
                  }}
                  className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                >
                  <option value="">كل التصنيفات</option>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="p-0">
            {tripsQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري تحميل الرحلات...
              </div>
            ) : tripsQuery.isError ? (
              <div className="p-8 text-center text-sm text-rose-600">
                {getErrorMessage(tripsQuery.error)}
              </div>
            ) : trips.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">
                لا توجد رحلات مطابقة حالياً.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">الرحلة</th>
                      <th className="px-5 py-4 font-medium">التصنيف</th>
                      <th className="px-5 py-4 font-medium">التاريخ</th>
                      <th className="px-5 py-4 font-medium">السعر</th>
                      <th className="px-5 py-4 font-medium">المقاعد</th>
                      <th className="px-5 py-4 font-medium">الحالة</th>
                      <th className="px-5 py-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trips.map((trip) => (
                      <tr key={trip.id} className="text-slate-700">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-14 overflow-hidden rounded-xl bg-slate-100">
                              {trip.main_image_url ? (
                                <img
                                  src={trip.main_image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{trip.name}</p>
                              {trip.featured ? (
                                <span className="text-xs text-amber-600">مميزة</span>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">{categoryLabels[trip.category]}</td>
                        <td className="px-5 py-4">{trip.start_date || "—"}</td>
                        <td className="px-5 py-4 font-medium">{formatPrice(trip)}</td>
                        <td className="px-5 py-4">
                          {trip.remaining_seats} / {trip.seats}
                        </td>
                        <td className="px-5 py-4">
                          <Badge className={statusClasses[trip.status]}>
                            {statusLabels[trip.status]}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditDialog(trip)}
                              aria-label="تعديل"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => duplicateMutation.mutate(trip.id)}
                              aria-label="نسخ"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openGalleryDialog(trip)}
                              aria-label="إدارة معرض الصور"
                            >
                              <Images className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-rose-600 hover:text-rose-700"
                              onClick={() => {
                                if (window.confirm(`حذف ${trip.name}؟`))
                                  deleteMutation.mutate(trip.id);
                              }}
                              aria-label="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{totalCount} نتيجة</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              السابق
            </Button>
            <span>
              صفحة {page} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>{editingTrip ? "تعديل الرحلة" : "إضافة رحلة جديدة"}</DialogTitle>
            <DialogDescription>
              أدخل بيانات الرحلة واحفظها لعرضها في لوحة الإدارة.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="اسم الرحلة" required>
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </Field>
              <Field label="التصنيف">
                <select
                  value={form.category}
                  disabled={Boolean(category)}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value as TripCategory })
                  }
                  className="h-9 rounded-md border border-input bg-white px-3 text-sm disabled:bg-slate-100"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
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
              <Field label="تاريخ البداية">
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(event) => setForm({ ...form, start_date: event.target.value })}
                />
              </Field>
              <Field label="تاريخ النهاية">
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(event) => setForm({ ...form, end_date: event.target.value })}
                />
              </Field>
              <Field label="عدد الليالي">
                <Input
                  type="number"
                  min="0"
                  value={form.nights}
                  onChange={(event) => setForm({ ...form, nights: event.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="السعر">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </Field>
              <Field label="العملة">
                <Input
                  maxLength={3}
                  value={form.currency}
                  onChange={(event) => setForm({ ...form, currency: event.target.value })}
                />
              </Field>
              <Field label="الحالة">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as TripStatus })
                  }
                  className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="فندق مكة">
                <Input
                  value={form.makkah_hotel}
                  onChange={(event) => setForm({ ...form, makkah_hotel: event.target.value })}
                />
              </Field>
              <Field label="فندق المدينة">
                <Input
                  value={form.madinah_hotel}
                  onChange={(event) => setForm({ ...form, madinah_hotel: event.target.value })}
                />
              </Field>
              <Field label="شركة الطيران">
                <Input
                  value={form.airline}
                  onChange={(event) => setForm({ ...form, airline: event.target.value })}
                />
              </Field>
              <Field label="الوجبات">
                <Input
                  value={form.meals}
                  onChange={(event) => setForm({ ...form, meals: event.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="إجمالي المقاعد">
                <Input
                  type="number"
                  min="0"
                  value={form.seats}
                  onChange={(event) => setForm({ ...form, seats: event.target.value })}
                />
              </Field>
              <Field label="المقاعد المتبقية">
                <Input
                  type="number"
                  min="0"
                  value={form.remaining_seats}
                  onChange={(event) => setForm({ ...form, remaining_seats: event.target.value })}
                />
              </Field>
            </div>
            <Field label="الصورة الرئيسية">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={form.main_image_url}
                  onChange={(event) => setForm({ ...form, main_image_url: event.target.value })}
                  placeholder="رابط الصورة أو ارفع ملفاً"
                />
                <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium hover:bg-slate-50">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  رفع صورة
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(event) => void uploadImage(event.target.files?.[0])}
                  />
                </label>
              </div>
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                className="h-4 w-4 rounded border-slate-300"
              />
              عرض الرحلة ضمن العروض المميزة
            </label>
            {formError ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending || uploading}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حفظ الرحلة
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(galleryTrip)}
        onOpenChange={(open) => {
          if (!open) setGalleryTrip(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>معرض صور {galleryTrip?.name}</DialogTitle>
            <DialogDescription>أضف صور الرحلة ورتّب ظهورها في المعرض.</DialogDescription>
          </DialogHeader>

          <label className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">
            {galleryUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            رفع صورة للمعرض
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={galleryUploading}
              onChange={(event) => {
                void uploadGalleryImage(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>

          {galleryError ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{galleryError}</p>
          ) : null}

          {galleryQuery.isLoading ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              جاري تحميل الصور...
            </div>
          ) : galleryQuery.isError ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {getErrorMessage(galleryQuery.error)}
            </p>
          ) : galleryQuery.data?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {galleryQuery.data.map((image, index) => (
                <div key={image.id} className="overflow-hidden rounded-2xl border bg-slate-50">
                  <img
                    src={image.image_url}
                    alt={`صورة ${index + 1} من ${galleryTrip?.name ?? "الرحلة"}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="text-xs text-slate-500">الترتيب {index + 1}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={index === 0 || reorderGalleryMutation.isPending}
                        onClick={() => moveGalleryImage(index, -1)}
                        aria-label="تحريك للأعلى"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={
                          index === (galleryQuery.data?.length ?? 0) - 1 ||
                          reorderGalleryMutation.isPending
                        }
                        onClick={() => moveGalleryImage(index, 1)}
                        aria-label="تحريك للأسفل"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-rose-600 hover:text-rose-700"
                        disabled={deleteGalleryImageMutation.isPending}
                        onClick={() => {
                          if (window.confirm("حذف هذه الصورة من المعرض؟")) {
                            deleteGalleryImageMutation.mutate(image.id);
                          }
                        }}
                        aria-label="حذف الصورة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
              لم تتم إضافة صور إلى معرض هذه الرحلة بعد.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
