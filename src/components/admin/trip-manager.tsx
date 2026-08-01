import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarRange,
  BusFront,
  Clock3,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  Plane,
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
import { imageService, tripsService } from "@/services/admin";
import type {
  Trip,
  TripCategory,
  TripPageKey,
  TripStatus,
  UmrahRoute,
  UmrahTransport,
} from "@/types/admin";

const PAGE_SIZE = 10;

const categoryLabels: Record<TripCategory, string> = {
  umrah: "عمرة",
  tourism: "رحلة",
};

const pageLabels: Record<TripPageKey, string> = {
  general: "الرحلات العامة",
  umrah: "العمرة",
  hajj: "الحج",
  egypt: "مصر",
  turkey: "تركيا",
  dubai: "دبي",
  switzerland: "سويسرا",
  maldives: "المالديف",
  georgia: "جورجيا",
  domestic: "السياحة الداخلية",
  flights: "الطيران",
  hotels: "حجز الفنادق",
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

type StayOptionForm = {
  key: string;
  days: string;
  nights: string;
  price: string;
};

type TripForm = {
  title: string;
  category: TripCategory;
  page_key: TripPageKey;
  umrah_transport: UmrahTransport;
  umrah_route: UmrahRoute;
  description: string;
  schedule_label: string;
  start_date: string;
  end_date: string;
  price: string;
  old_price: string;
  currency: string;
  makkah_hotel: string;
  madinah_hotel: string;
  meals: string;
  airline: string;
  nights: string;
  total_seats: string;
  remaining_seats: string;
  main_image_url: string;
  room_type: string;
  hotel_location: string;
  hotel_stars: string;
  hotel_features: string;
  stay_options: StayOptionForm[];
  single_price: string;
  double_price: string;
  triple_price: string;
  quad_price: string;
  additional_image_urls: string;
  madinah_image_url: string;
  flight_details: string;
  program_inclusions: string;
  program_requirements: string;
  program_notes: string;
  status: TripStatus;
  is_featured: boolean;
  is_visible: boolean;
  offer_ends_at: string;
};

function emptyForm(category: TripCategory, pageKey: TripPageKey): TripForm {
  return {
    title: "",
    category,
    page_key: pageKey,
    umrah_transport: "land",
    umrah_route: "makkah_madinah",
    description: "",
    schedule_label: "",
    start_date: "",
    end_date: "",
    price: "",
    old_price: "",
    currency: "JOD",
    makkah_hotel: "",
    madinah_hotel: "",
    meals: "",
    airline: "",
    nights: "0",
    total_seats: "0",
    remaining_seats: "0",
    main_image_url: "",
    room_type: "",
    hotel_location: "",
    hotel_stars: "",
    hotel_features: "",
    stay_options: [],
    single_price: "",
    double_price: "",
    triple_price: "",
    quad_price: "",
    additional_image_urls: "",
    madinah_image_url: "",
    flight_details: "",
    program_inclusions: "",
    program_requirements: "",
    program_notes: "",
    status: "available",
    is_featured: false,
    is_visible: true,
    offer_ends_at: "",
  };
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function formFromTrip(trip: Trip): TripForm {
  return {
    title: trip.title,
    category: trip.category,
    page_key: trip.page_key,
    umrah_transport: trip.umrah_transport ?? "land",
    umrah_route: trip.umrah_route ?? (trip.madinah_hotel ? "makkah_madinah" : "makkah"),
    description: trip.description ?? "",
    schedule_label: trip.schedule_label ?? "",
    start_date: trip.start_date ?? "",
    end_date: trip.end_date ?? "",
    price: trip.price?.toString() ?? "",
    old_price: trip.old_price?.toString() ?? "",
    currency: trip.currency,
    makkah_hotel: trip.makkah_hotel ?? "",
    madinah_hotel: trip.madinah_hotel ?? "",
    meals: trip.meals ?? "",
    airline: trip.airline ?? "",
    nights: trip.nights.toString(),
    total_seats: trip.total_seats.toString(),
    remaining_seats: trip.remaining_seats.toString(),
    main_image_url: trip.main_image_url ?? "",
    room_type: trip.room_type ?? "",
    hotel_location: trip.hotel_location ?? "",
    hotel_stars: trip.hotel_stars?.toString() ?? "",
    hotel_features: (trip.hotel_features ?? []).join("\n"),
    stay_options: (trip.stay_options ?? []).map((option, index) => ({
      key: `${trip.id}-${index}`,
      days: option.days.toString(),
      nights: option.nights.toString(),
      price: option.price.toString(),
    })),
    single_price: trip.single_price?.toString() ?? "",
    double_price: trip.double_price?.toString() ?? "",
    triple_price: trip.triple_price?.toString() ?? "",
    quad_price: trip.quad_price?.toString() ?? "",
    additional_image_urls: (trip.additional_image_urls ?? []).join("\n"),
    madinah_image_url: trip.madinah_image_url ?? "",
    flight_details: (trip.flight_details ?? []).join("\n"),
    program_inclusions: (trip.program_inclusions ?? []).join("\n"),
    program_requirements: (trip.program_requirements ?? []).join("\n"),
    program_notes: (trip.program_notes ?? []).join("\n"),
    status: trip.status,
    is_featured: trip.is_featured,
    is_visible: trip.is_visible !== false && trip.status !== "hidden",
    offer_ends_at: toDateTimeLocal(trip.offer_ends_at),
  };
}

function toTripPayload(form: TripForm): Omit<Trip, "id" | "created_at" | "updated_at"> {
  return {
    title: form.title.trim(),
    category: form.category,
    page_key: form.page_key,
    umrah_transport: form.page_key === "umrah" ? form.umrah_transport : null,
    umrah_route:
      form.page_key === "umrah" && form.umrah_transport === "air" ? form.umrah_route : null,
    description: form.description.trim() || undefined,
    schedule_label: form.schedule_label.trim() || undefined,
    start_date: form.start_date || undefined,
    end_date: form.end_date || undefined,
    price: form.price ? Number(form.price) : undefined,
    old_price: form.old_price ? Number(form.old_price) : null,
    currency: form.currency.trim().toUpperCase() || "JOD",
    makkah_hotel: form.makkah_hotel.trim() || undefined,
    madinah_hotel: form.madinah_hotel.trim() || undefined,
    meals: form.meals.trim() || undefined,
    airline: form.airline.trim() || undefined,
    nights: Number(form.nights) || 0,
    total_seats: Number(form.total_seats) || 0,
    remaining_seats: Number(form.remaining_seats) || 0,
    main_image_url: form.main_image_url.trim() || undefined,
    room_type: form.room_type.trim() || undefined,
    hotel_location: form.hotel_location.trim() || undefined,
    hotel_stars: form.hotel_stars ? Number(form.hotel_stars) : null,
    hotel_features: form.hotel_features
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean),
    stay_options: form.stay_options
      .map((option) => ({
        days: Number(option.days),
        nights: Number(option.nights),
        price: Number(option.price),
      }))
      .filter(
        (option) =>
          Number.isFinite(option.days) &&
          option.days > 0 &&
          Number.isFinite(option.nights) &&
          option.nights >= 0 &&
          Number.isFinite(option.price) &&
          option.price > 0,
      )
      .sort((first, second) => first.days - second.days),
    single_price: form.single_price ? Number(form.single_price) : undefined,
    double_price: form.double_price ? Number(form.double_price) : undefined,
    triple_price: form.triple_price ? Number(form.triple_price) : undefined,
    quad_price: form.quad_price ? Number(form.quad_price) : undefined,
    additional_image_urls: form.additional_image_urls
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean),
    madinah_image_url: form.madinah_image_url.trim() || undefined,
    flight_details: splitLines(form.flight_details),
    program_inclusions: splitLines(form.program_inclusions),
    program_requirements: splitLines(form.program_requirements),
    program_notes: splitLines(form.program_notes),
    status: form.status,
    is_featured: form.is_featured,
    is_visible: form.is_visible,
    offer_ends_at: form.offer_ends_at ? new Date(form.offer_ends_at).toISOString() : null,
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("ar-JO", {
    style: "currency",
    currency: currency || "JOD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDiscountPercentage(trip: Trip) {
  if (
    trip.price === undefined ||
    trip.price === null ||
    !trip.old_price ||
    trip.old_price <= trip.price
  ) {
    return 0;
  }
  return Math.round(((trip.old_price - trip.price) / trip.old_price) * 100);
}

interface TripManagerProps {
  title: string;
  description: string;
  category: TripCategory;
  pageKey: TripPageKey;
}

export function TripManager({ title, description, category, pageKey }: TripManagerProps) {
  const queryClient = useQueryClient();
  const isHotelPackage = pageKey === "egypt" || pageKey === "turkey";
  const hasHotelDetails = pageKey === "umrah" || isHotelPackage;
  const contentNoun =
    pageKey === "umrah"
      ? "باقة عمرة"
      : pageKey === "hajj"
        ? "برنامج حج"
        : isHotelPackage
          ? "فندق أو باقة"
          : "رحلة";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form, setForm] = useState<TripForm>(() => emptyForm(category, pageKey));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const filters = {
    category,
    pageKey,
    status: statusFilter || undefined,
    search: search.trim() || undefined,
  };

  const tripsQuery = useQuery({
    queryKey: ["admin-trips", filters, page],
    queryFn: () => tripsService.getAll(filters, page, PAGE_SIZE),
  });

  const refreshTrips = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
    await queryClient.invalidateQueries({ queryKey: ["public-trips", pageKey] });
    await queryClient.invalidateQueries({ queryKey: ["featured-trips"] });
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

  const visibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      tripsService.update(id, { is_visible: isVisible }),
    onSuccess: async (_, variables) => {
      await refreshTrips();
      setFeedback(variables.isVisible ? "تم إظهار العرض في الموقع." : "تم إخفاء العرض من الموقع.");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
  });

  const trips = tripsQuery.data?.data ?? [];
  const totalCount = tripsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function openCreateDialog() {
    setEditingTrip(null);
    setForm(emptyForm(category, pageKey));
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(trip: Trip) {
    setEditingTrip(trip);
    setForm(formFromTrip(trip));
    setFormError(null);
    setDialogOpen(true);
  }

  function addStayOption() {
    setForm((current) => ({
      ...current,
      stay_options: [
        ...current.stay_options,
        {
          key: crypto.randomUUID(),
          days: "",
          nights: "",
          price: "",
        },
      ],
    }));
  }

  function updateStayOption(key: string, field: "days" | "nights" | "price", value: string) {
    setForm((current) => ({
      ...current,
      stay_options: current.stay_options.map((option) =>
        option.key === key ? { ...option, [field]: value } : option,
      ),
    }));
  }

  function removeStayOption(key: string) {
    setForm((current) => ({
      ...current,
      stay_options: current.stay_options.filter((option) => option.key !== key),
    }));
  }

  async function uploadImage(
    file?: File,
    field: "main_image_url" | "madinah_image_url" = "main_image_url",
  ) {
    if (!file) return;

    setUploading(true);
    setFormError(null);
    try {
      const imageUrl = await imageService.uploadToStorage(file, "admin-media", "trips");
      setForm((current) => ({ ...current, [field]: imageUrl }));
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function uploadAdditionalImages(files?: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setFormError(null);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        uploadedUrls.push(await imageService.uploadToStorage(file, "admin-media", "trips"));
      }
      setForm((current) => ({
        ...current,
        additional_image_urls: [
          ...current.additional_image_urls
            .split("\n")
            .map((url) => url.trim())
            .filter(Boolean),
          ...uploadedUrls,
        ].join("\n"),
      }));
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim()) {
      setFormError("اسم الرحلة مطلوب.");
      return;
    }

    const currentPrice = form.price ? Number(form.price) : null;
    const oldPrice = form.old_price ? Number(form.old_price) : null;
    if (currentPrice !== null && oldPrice !== null && oldPrice <= currentPrice) {
      setFormError("السعر القديم يجب أن يكون أكبر من السعر الحالي حتى يظهر الخصم.");
      return;
    }

    if (Number(form.remaining_seats) > Number(form.total_seats)) {
      setFormError("المقاعد المتبقية لا يمكن أن تكون أكثر من إجمالي المقاعد.");
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
            إضافة {contentNoun}
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
              <div className="flex h-9 items-center rounded-md border border-input bg-slate-50 px-3 text-sm text-slate-600">
                القسم: {pageLabels[pageKey] || categoryLabels[category]}
              </div>
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
                <table className="w-full min-w-[980px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">الرحلة</th>
                      <th className="px-5 py-4 font-medium">التاريخ</th>
                      <th className="px-5 py-4 font-medium">السعر</th>
                      <th className="px-5 py-4 font-medium">المقاعد</th>
                      <th className="px-5 py-4 font-medium">الحالة</th>
                      <th className="px-5 py-4 font-medium">الظهور</th>
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
                                  alt={trip.title}
                                  title={trip.title}
                                  loading="lazy"
                                  decoding="async"
                                  width={1200}
                                  height={800}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{trip.title}</p>
                              {pageKey === "umrah" ? (
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  <Badge className="gap-1 bg-slate-100 text-slate-700 hover:bg-slate-100">
                                    {trip.umrah_transport === "air" ? (
                                      <Plane className="h-3 w-3" aria-hidden="true" />
                                    ) : (
                                      <BusFront className="h-3 w-3" aria-hidden="true" />
                                    )}
                                    {trip.umrah_transport === "air" ? "جو" : "بر"}
                                  </Badge>
                                  {trip.umrah_transport === "air" ? (
                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                      {trip.umrah_route === "makkah" ? "مكة فقط" : "مكة والمدينة"}
                                    </Badge>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {trip.schedule_label || trip.start_date || "—"}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          <div>{formatPrice(trip)}</div>
                          {trip.old_price && getDiscountPercentage(trip) > 0 ? (
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="text-slate-400 line-through">
                                {formatAmount(trip.old_price, trip.currency)}
                              </span>
                              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                                خصم {getDiscountPercentage(trip)}%
                              </Badge>
                            </div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4">
                          {trip.remaining_seats}/{trip.total_seats}
                        </td>
                        <td className="px-5 py-4">
                          <Badge className={statusClasses[trip.status]}>
                            {statusLabels[trip.status]}
                          </Badge>
                          {trip.offer_ends_at ? (
                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5" />
                              {new Date(trip.offer_ends_at).getTime() <= Date.now()
                                ? "انتهى العرض"
                                : new Intl.DateTimeFormat("ar-JO", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }).format(new Date(trip.offer_ends_at))}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={visibilityMutation.isPending}
                            onClick={() =>
                              visibilityMutation.mutate({
                                id: trip.id,
                                isVisible: trip.is_visible === false,
                              })
                            }
                            className={
                              trip.is_visible === false
                                ? "border-slate-300 text-slate-500"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }
                          >
                            {trip.is_visible === false ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            {trip.is_visible === false ? "مخفي" : "ظاهر"}
                          </Button>
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
                              className="text-rose-600 hover:text-rose-700"
                              onClick={() => {
                                if (window.confirm(`حذف ${trip.title}؟`))
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
            <DialogTitle>
              {editingTrip ? `تعديل ${contentNoun}` : `إضافة ${contentNoun} جديد`}
            </DialogTitle>
            <DialogDescription>
              أدخل بيانات الرحلة واحفظها لعرضها مباشرة في صفحة {pageLabels[pageKey]}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm} className="grid gap-4">
            <Field label={isHotelPackage ? "اسم الفندق أو الباقة" : "اسم الرحلة"} required>
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Field>
            <Field label={isHotelPackage ? "تفاصيل الإقامة والبرنامج" : "الوصف"}>
              <Textarea
                rows={isHotelPackage ? 5 : 3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder={
                  isHotelPackage
                    ? "اكتب كل معلومة أو بند في سطر مستقل ليظهر بشكل مرتب في صفحة الفندق."
                    : undefined
                }
              />
            </Field>
            {pageKey === "umrah" ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900">تصنيف برنامج العمرة</h3>
                  <p className="mt-1 text-xs leading-6 text-slate-600">
                    يحدد مكان ظهور البرنامج في تبويبات صفحة العمرة.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="طريقة السفر">
                    <select
                      value={form.umrah_transport}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          umrah_transport: event.target.value as UmrahTransport,
                          umrah_route:
                            event.target.value === "air" ? form.umrah_route : "makkah_madinah",
                        })
                      }
                      className="h-11 rounded-md border border-input bg-white px-3 text-sm"
                    >
                      <option value="land">برنامج بر</option>
                      <option value="air">برنامج جو</option>
                    </select>
                  </Field>
                  {form.umrah_transport === "air" ? (
                    <Field label="مسار برنامج الجو">
                      <select
                        value={form.umrah_route}
                        onChange={(event) =>
                          setForm({ ...form, umrah_route: event.target.value as UmrahRoute })
                        }
                        className="h-11 rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="makkah">مكة فقط</option>
                        <option value="makkah_madinah">مكة والمدينة</option>
                      </select>
                    </Field>
                  ) : null}
                </div>
              </section>
            ) : null}
            <Field label="فترة الرحلات">
              <Input
                value={form.schedule_label}
                onChange={(event) => setForm({ ...form, schedule_label: event.target.value })}
                placeholder="رحلات شهر 8 و9 و10"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="السعر الحالي">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </Field>
              <Field label="السعر القديم (اختياري)">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.old_price}
                  onChange={(event) => setForm({ ...form, old_price: event.target.value })}
                  placeholder="يظهر مشطوباً"
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
            {pageKey === "umrah" ? (
              <div className="grid gap-4 md:grid-cols-3">
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
                <Field label="نوع الغرفة">
                  <Input
                    value={form.room_type}
                    onChange={(event) => setForm({ ...form, room_type: event.target.value })}
                  />
                </Field>
              </div>
            ) : null}
            {isHotelPackage ? (
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="موقع الفندق / المدينة">
                  <Input
                    value={form.hotel_location}
                    onChange={(event) => setForm({ ...form, hotel_location: event.target.value })}
                    placeholder={pageKey === "egypt" ? "مثال: شرم الشيخ" : "مثال: إسطنبول"}
                  />
                </Field>
                <Field label="تصنيف الفندق">
                  <select
                    value={form.hotel_stars}
                    onChange={(event) => setForm({ ...form, hotel_stars: event.target.value })}
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                  >
                    <option value="">غير محدد</option>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <option key={stars} value={stars}>
                        {stars} {stars === 1 ? "نجمة" : "نجوم"}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="نوع الغرفة">
                  <Input
                    value={form.room_type}
                    onChange={(event) => setForm({ ...form, room_type: event.target.value })}
                    placeholder="مثال: غرفة ديلوكس"
                  />
                </Field>
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
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
            {hasHotelDetails ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Field label="سعر الغرفة المفردة">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.single_price}
                    onChange={(event) => setForm({ ...form, single_price: event.target.value })}
                  />
                </Field>
                <Field label="سعر الغرفة الثنائية">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.double_price}
                    onChange={(event) => setForm({ ...form, double_price: event.target.value })}
                  />
                </Field>
                <Field label="سعر الغرفة الثلاثية">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.triple_price}
                    onChange={(event) => setForm({ ...form, triple_price: event.target.value })}
                  />
                </Field>
                <Field label="سعر الغرفة الرباعية">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.quad_price}
                    onChange={(event) => setForm({ ...form, quad_price: event.target.value })}
                  />
                </Field>
              </div>
            ) : null}
            {pageKey === "umrah" ? (
              <section className="grid gap-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                <div>
                  <h3 className="font-bold text-slate-900">تفاصيل البرنامج الكاملة</h3>
                  <p className="mt-1 text-xs leading-6 text-slate-600">
                    اكتب كل بند في سطر مستقل ليظهر كبطاقة مرتبة داخل صفحة البرنامج.
                  </p>
                </div>
                <Field label="تفاصيل رحلات الطيران">
                  <Textarea
                    rows={4}
                    value={form.flight_details}
                    onChange={(event) => setForm({ ...form, flight_details: event.target.value })}
                    placeholder="عمان ← جدة – رقم الرحلة – وقت الإقلاع والوصول"
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="ما يشمله البرنامج">
                    <Textarea
                      rows={6}
                      value={form.program_inclusions}
                      onChange={(event) =>
                        setForm({ ...form, program_inclusions: event.target.value })
                      }
                      placeholder="تأشيرة العمرة\nتذاكر الطيران\nالإقامة في الفنادق"
                    />
                  </Field>
                  <Field label="الوثائق المطلوبة">
                    <Textarea
                      rows={6}
                      value={form.program_requirements}
                      onChange={(event) =>
                        setForm({ ...form, program_requirements: event.target.value })
                      }
                      placeholder="جواز سفر ساري\nصورة شخصية بخلفية بيضاء"
                    />
                  </Field>
                </div>
                <Field label="ملاحظات وشروط الحجز">
                  <Textarea
                    rows={5}
                    value={form.program_notes}
                    onChange={(event) => setForm({ ...form, program_notes: event.target.value })}
                  />
                </Field>
              </section>
            ) : null}
            {isHotelPackage ? (
              <Field label="مميزات الفندق">
                <Textarea
                  rows={5}
                  value={form.hotel_features}
                  onChange={(event) => setForm({ ...form, hotel_features: event.target.value })}
                  placeholder="اكتب كل ميزة في سطر مستقل، مثال: قريب من الشاطئ"
                />
              </Field>
            ) : null}
            {isHotelPackage ? (
              <section className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900">
                      <CalendarRange className="h-5 w-5 text-sky-700" aria-hidden="true" />
                      <h3 className="font-bold">مدد الإقامة وأسعار الشخص</h3>
                    </div>
                    <p className="mt-1 text-xs leading-6 text-slate-600">
                      أضف خيارًا لكل مدة. سيختار العميل المدة المناسبة ويتغير السعر تلقائيًا.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addStayOption}
                    className="min-h-11 border-sky-300 bg-white text-sky-800 hover:bg-sky-100"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    إضافة مدة
                  </Button>
                </div>

                {form.stay_options.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {form.stay_options.map((option, index) => (
                      <div
                        key={option.key}
                        className="grid gap-3 rounded-2xl border border-sky-100 bg-white p-3 md:grid-cols-[1fr_1fr_1.2fr_auto]"
                      >
                        <Field label={`عدد الأيام ${index + 1}`}>
                          <Input
                            type="number"
                            min="1"
                            inputMode="numeric"
                            value={option.days}
                            onChange={(event) =>
                              updateStayOption(option.key, "days", event.target.value)
                            }
                            placeholder="4"
                          />
                        </Field>
                        <Field label="عدد الليالي">
                          <Input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={option.nights}
                            onChange={(event) =>
                              updateStayOption(option.key, "nights", event.target.value)
                            }
                            placeholder="3"
                          />
                        </Field>
                        <Field label={`السعر للشخص (${form.currency || "JOD"})`}>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={option.price}
                            onChange={(event) =>
                              updateStayOption(option.key, "price", event.target.value)
                            }
                            placeholder="380"
                          />
                        </Field>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeStayOption(option.key)}
                          aria-label={`حذف خيار الإقامة ${index + 1}`}
                          className="min-h-11 min-w-11 self-end border-rose-200 text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={addStayOption}
                    className="mt-4 flex min-h-24 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-sky-300 bg-white/70 px-4 text-sm font-bold text-sky-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                  >
                    اضغط لإضافة أول مدة وسعر
                  </button>
                )}
              </section>
            ) : null}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900">إعدادات العرض الديناميكي</h3>
                <p className="mt-1 text-xs text-slate-600">
                  جميع الحقول اختيارية، ويُحسب الخصم وحالة المقاعد تلقائياً.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="عدد الليالي">
                  <Input
                    type="number"
                    min="0"
                    value={form.nights}
                    onChange={(event) => setForm({ ...form, nights: event.target.value })}
                  />
                </Field>
                <Field label="إجمالي المقاعد">
                  <Input
                    type="number"
                    min="0"
                    value={form.total_seats}
                    onChange={(event) => setForm({ ...form, total_seats: event.target.value })}
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
                <Field label="ينتهي العرض في">
                  <Input
                    type="datetime-local"
                    value={form.offer_ends_at}
                    onChange={(event) => setForm({ ...form, offer_ends_at: event.target.value })}
                  />
                </Field>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-8">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={(event) => setForm({ ...form, is_visible: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  إظهار العرض في الموقع
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(event) => setForm({ ...form, is_featured: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  إظهار ضمن العروض المميزة في الرئيسية
                </label>
              </div>
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
            {hasHotelDetails ? (
              <Field label={pageKey === "umrah" ? "صور تفاصيل فندق مكة" : "صور الفندق والتفاصيل"}>
                <div className="grid gap-2">
                  <Textarea
                    rows={4}
                    value={form.additional_image_urls}
                    onChange={(event) =>
                      setForm({ ...form, additional_image_urls: event.target.value })
                    }
                    placeholder="رابط صورة في كل سطر، أو ارفع عدة صور"
                  />
                  <label className="inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium hover:bg-slate-50">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    رفع صور التفاصيل
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploading}
                      onChange={(event) => void uploadAdditionalImages(event.target.files)}
                    />
                  </label>
                </div>
              </Field>
            ) : null}
            {pageKey === "umrah" ? (
              <>
                <Field label="صورة فندق المدينة">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={form.madinah_image_url}
                      onChange={(event) =>
                        setForm({ ...form, madinah_image_url: event.target.value })
                      }
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
                        onChange={(event) =>
                          void uploadImage(event.target.files?.[0], "madinah_image_url")
                        }
                      />
                    </label>
                  </div>
                </Field>
              </>
            ) : null}
            {formError ? (
              <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {formError}
              </p>
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
                حفظ {contentNoun}
              </Button>
            </div>
          </form>
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
