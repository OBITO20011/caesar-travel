import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Hotel,
  Images,
  MapPin,
  MessageCircle,
  Moon,
  Plane,
  ShieldCheck,
  Star,
  Users,
  UtensilsCrossed,
  WalletCards,
  X,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import { usePublicTrip, useSiteSettings } from "@/hooks/use-site-content";
import {
  buildWhatsAppUrl,
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";
import type { TripPageKey } from "@/types/admin";

export const Route = createFileRoute("/trips/$id")({
  component: TripPackageDetailsPage,
});

interface PageMeta {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  destination: string;
  programTitle: string;
}

const pageMeta: Partial<Record<TripPageKey, PageMeta>> = {
  general: {
    backHref: "/",
    backLabel: "العودة للرئيسية",
    eyebrow: "عرض سياحي من قيصر",
    destination: "وجهة سياحية",
    programTitle: "تفاصيل البرنامج",
  },
  hajj: {
    backHref: "/hajj",
    backLabel: "جميع برامج الحج",
    eyebrow: "برنامج حج",
    destination: "مكة المكرمة والمدينة المنورة",
    programTitle: "تفاصيل برنامج الحج",
  },
  egypt: {
    backHref: "/egypt",
    backLabel: "جميع فنادق وباقات مصر",
    eyebrow: "فندق وباقة في مصر",
    destination: "مصر",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  turkey: {
    backHref: "/turkey-trip",
    backLabel: "جميع فنادق وباقات تركيا",
    eyebrow: "فندق وباقة في تركيا",
    destination: "تركيا",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  dubai: {
    backHref: "/dubai",
    backLabel: "جميع فنادق وباقات دبي",
    eyebrow: "فندق وباقة في دبي",
    destination: "دبي",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  switzerland: {
    backHref: "/packages/switzerland",
    backLabel: "جميع باقات سويسرا",
    eyebrow: "باقة سياحية في سويسرا",
    destination: "سويسرا",
    programTitle: "تفاصيل الباقة والبرنامج",
  },
  maldives: {
    backHref: "/packages/maldives",
    backLabel: "جميع باقات المالديف",
    eyebrow: "إقامة سياحية في المالديف",
    destination: "المالديف",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  georgia: {
    backHref: "/packages/georgia",
    backLabel: "جميع باقات جورجيا",
    eyebrow: "باقة سياحية في جورجيا",
    destination: "جورجيا",
    programTitle: "تفاصيل الباقة والبرنامج",
  },
  domestic: {
    backHref: "/packages/domestic",
    backLabel: "جميع الرحلات الداخلية",
    eyebrow: "رحلة داخل الأردن",
    destination: "الأردن",
    programTitle: "برنامج الرحلة",
  },
  flights: {
    backHref: "/packages/flights",
    backLabel: "جميع عروض الطيران",
    eyebrow: "عرض طيران",
    destination: "رحلة جوية",
    programTitle: "تفاصيل عرض الطيران",
  },
  hotels: {
    backHref: "/packages/hotels",
    backLabel: "جميع عروض الفنادق",
    eyebrow: "إقامة فندقية",
    destination: "فندق مختار",
    programTitle: "تفاصيل الفندق والإقامة",
  },
};

function TripPackageDetailsPage() {
  const { id } = useParams({ from: "/trips/$id" });
  const tripQuery = usePublicTrip(id);
  const { data: settings } = useSiteSettings();
  const [selectedStayIndex, setSelectedStayIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  if (tripQuery.isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6">
        <p className="text-lg font-bold text-[#15343A]">جاري تحميل تفاصيل العرض...</p>
      </main>
    );
  }

  const trip = tripQuery.data;
  const meta = trip ? pageMeta[trip.page_key] : undefined;

  if (tripQuery.isError || !trip || trip.category !== "tourism" || !meta) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6 text-center"
        dir="rtl"
      >
        <div>
          <h1 className="text-3xl font-black text-[#15343A]">العرض غير موجود</h1>
          <a
            href="/"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#15343A] px-7 py-3 font-bold text-white"
          >
            العودة للرئيسية
          </a>
        </div>
      </main>
    );
  }

  const seatState = getTripSeatState(trip);
  const discount = getTripDiscountPercentage(trip);
  const available = trip.status === "available" && !seatState.soldOut;
  const programItems = (trip.description || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const hotelFeatures = trip.hotel_features ?? [];
  const detailImages = Array.from(
    new Set([trip.main_image_url, ...(trip.additional_image_urls ?? [])].filter(Boolean)),
  ) as string[];
  const stayOptions = [...(trip.stay_options ?? [])].sort(
    (first, second) => first.days - second.days,
  );
  const selectedStayOption =
    stayOptions[Math.min(selectedStayIndex, Math.max(stayOptions.length - 1, 0))];
  const selectedPrice = selectedStayOption?.price ?? trip.price;
  const roomPrices = [
    { label: "غرفة ثنائية", price: trip.double_price },
    { label: "غرفة ثلاثية", price: trip.triple_price },
    { label: "غرفة رباعية", price: trip.quad_price },
  ].filter(
    (option): option is { label: string; price: number } =>
      option.price !== undefined && option.price !== null,
  );
  const isHotelPackage =
    Boolean(trip.hotel_location || trip.hotel_stars || roomPrices.length || hotelFeatures.length) ||
    ["egypt", "turkey", "dubai", "hotels"].includes(trip.page_key);
  const duration = selectedStayOption
    ? `${selectedStayOption.days} أيام / ${selectedStayOption.nights} ليالي`
    : trip.nights > 0
      ? `${trip.nights + 1} يوم / ${trip.nights} ليلة`
      : "حسب البرنامج";
  const seatsLabel = seatState.tracksSeats
    ? seatState.soldOut
      ? "اكتمل الحجز"
      : `${trip.remaining_seats} مقعد متبقٍ من ${trip.total_seats}`
    : "مقاعد محدودة — تواصل معنا";
  const dateLabel = trip.start_date
    ? formatTripDate(trip.start_date, true)
    : "الموعد يُحدّد عند الحجز";
  const destinationLabel = trip.hotel_location || meta.destination;
  const bookingUrl = buildWhatsAppUrl(
    settings?.whatsapp,
    `السلام عليكم، أرغب بحجز ${trip.title}. الوجهة: ${destinationLabel}. المدة: ${duration}. الموعد: ${dateLabel}. السعر للشخص: ${
      selectedPrice !== undefined && selectedPrice !== null
        ? formatTripAmount(selectedPrice, trip.currency)
        : formatTripPrice(trip)
    }.`,
  );
  const galleryImage = galleryIndex !== null ? detailImages[galleryIndex] : null;

  return (
    <>
      <Helmet>
        <title>{trip.title} | قيصر للسياحة والسفر</title>
        <meta
          name="description"
          content={programItems[0] || `صور وأسعار وتفاصيل ${trip.title} مع قيصر للسياحة والسفر.`}
        />
        <link rel="canonical" href={`https://caesar-travel.pages.dev/trips/${trip.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${trip.title} | قيصر للسياحة والسفر`} />
        {trip.main_image_url ? <meta property="og:image" content={trip.main_image_url} /> : null}
      </Helmet>

      <main dir="rtl" className="min-h-screen bg-[#F5EFD9] pb-20 text-[#15343A]">
        <section className="relative min-h-[58vh] overflow-hidden bg-[#0B2E3A]">
          {trip.main_image_url ? (
            <img
              src={trip.main_image_url}
              alt={trip.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f29] via-[#071f29]/70 to-black/25" />

          <div className="relative mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
            <a
              href={meta.backHref}
              className="mb-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/30 bg-black/25 px-5 py-2.5 font-bold text-white backdrop-blur transition duration-200 hover:bg-white hover:text-[#15343A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3CF63]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {meta.backLabel}
            </a>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F3CF63]/50 bg-[#D4AF37]/15 px-4 py-2 text-sm font-black text-[#F3CF63] backdrop-blur">
              {isHotelPackage ? (
                <Hotel className="h-4 w-4" aria-hidden="true" />
              ) : (
                <MapPin className="h-4 w-4" aria-hidden="true" />
              )}
              {meta.eyebrow}
            </span>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight text-white drop-shadow-xl sm:text-6xl">
              {trip.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-lg font-bold text-white/90">
                <MapPin className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                {destinationLabel}
              </span>
              {trip.hotel_stars ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-2 text-[#F3CF63] backdrop-blur"
                  aria-label={`تصنيف الفندق ${trip.hotel_stars} من 5 نجوم`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4"
                      fill={index < trip.hotel_stars! ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  ))}
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white sm:text-base">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <CalendarDays className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                {dateLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <Clock3 className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                {duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <Users className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                {seatsLabel}
              </span>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-5 grid max-w-7xl gap-7 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="relative rounded-[2rem] border border-[#D4AF37]/25 bg-white p-6 shadow-xl sm:p-9">
            <span className="font-bold text-[#9B7617]">
              {isHotelPackage ? "معلومات الفندق" : "تفاصيل الرحلة"}
            </span>
            <h2 className="mt-2 text-3xl font-black">{meta.programTitle}</h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {(programItems.length > 0
                ? programItems
                : ["برنامج متكامل وخدمة متابعة من فريق قيصر طوال الرحلة."]
              ).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-3 rounded-2xl border border-[#15343A]/10 bg-[#F8F4EA] p-4 leading-7"
                >
                  <CheckCircle2
                    className="mt-1 h-5 w-5 shrink-0 text-[#B88912]"
                    aria-hidden="true"
                  />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            {hotelFeatures.length > 0 ? (
              <div className="mt-9">
                <h2 className="text-2xl font-black">مميزات الفندق</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {hotelFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/25 bg-[#FFF9E8] p-4 font-bold"
                    >
                      <Hotel className="h-5 w-5 shrink-0 text-[#9B7617]" aria-hidden="true" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard icon={Moon} title="مدة الرحلة" value={duration} />
              <InfoCard
                icon={UtensilsCrossed}
                title="الوجبات"
                value={trip.meals || "حسب البرنامج"}
              />
              {trip.airline ? (
                <InfoCard icon={Plane} title="شركة الطيران" value={trip.airline} />
              ) : null}
            </div>

            {detailImages.length > 1 ? (
              <div className="mt-10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#9B7617]">جولة بصرية</span>
                    <h2 className="mt-1 text-2xl font-black">
                      {isHotelPackage ? "اكتشف الفندق قبل الحجز" : "صور الرحلة"}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#15343A] px-4 py-2 text-sm font-bold text-white">
                    <Images className="h-4 w-4 text-[#F3CF63]" aria-hidden="true" />
                    {detailImages.length - 1} صور
                  </span>
                </div>
                <div className="mt-5 grid auto-rows-[180px] gap-4 sm:grid-cols-2">
                  {detailImages.slice(1).map((imageUrl, index) => (
                    <button
                      key={imageUrl}
                      type="button"
                      onClick={() => setGalleryIndex(index + 1)}
                      aria-label={`تكبير صورة ${index + 2} من ${trip.title}`}
                      className={`group relative cursor-zoom-in overflow-hidden rounded-3xl bg-[#15343A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37] ${
                        index === 0 || index % 5 === 0 ? "sm:row-span-2" : ""
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${trip.title} - صورة ${index + 2}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                      <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-sm font-bold text-white backdrop-blur">
                        <Images className="h-4 w-4" aria-hidden="true" />
                        تكبير الصورة
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="relative h-fit rounded-[2rem] border border-[#D4AF37]/35 bg-[#102F3A] p-6 text-white shadow-xl lg:sticky lg:top-28">
            <div className="flex items-center gap-3 text-[#F3CF63]">
              <WalletCards className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-xl font-black">الأسعار والحجز</h2>
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-white/70">السعر للشخص يبدأ من</p>
              {trip.old_price && discount > 0 ? (
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-black">
                    خصم {discount}%
                  </span>
                  <span className="text-white/55 line-through">
                    {formatTripAmount(trip.old_price, trip.currency)}
                  </span>
                </div>
              ) : null}
              <p className="mt-2 text-4xl font-black text-[#F3CF63]">
                {selectedPrice !== undefined && selectedPrice !== null
                  ? formatTripAmount(selectedPrice, trip.currency)
                  : formatTripPrice(trip)}
              </p>
            </div>

            {stayOptions.length > 0 ? (
              <div className="mt-5">
                <h3 className="text-base font-black">اختر مدة الإقامة</h3>
                <p className="mt-1 text-xs leading-6 text-white/60">
                  السعر للشخص في الغرفة الثنائية أو الثلاثية.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {stayOptions.map((option, index) => {
                    const selected = index === selectedStayIndex;
                    return (
                      <button
                        key={`${option.days}-${option.nights}-${option.price}`}
                        type="button"
                        onClick={() => setSelectedStayIndex(index)}
                        aria-pressed={selected}
                        className={`min-h-24 cursor-pointer rounded-2xl border p-3 text-right transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 ${
                          selected
                            ? "border-[#F3CF63] bg-[#F3CF63] text-[#102F3A]"
                            : "border-white/15 bg-white/5 text-white hover:border-[#F3CF63]/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="block text-lg font-black">{option.days} أيام</span>
                        <span
                          className={`block text-xs ${selected ? "text-[#102F3A]/70" : "text-white/60"}`}
                        >
                          {option.nights} ليالي
                        </span>
                        <span className="mt-2 block font-black">
                          {formatTripAmount(option.price, trip.currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {roomPrices.length > 0 ? (
              <div className="mt-4 space-y-2">
                {roomPrices.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 px-4 py-3"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <BedDouble className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                      {option.label}
                    </span>
                    <span className="font-black text-[#F3CF63]">
                      {formatTripAmount(option.price, trip.currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-white/15 p-4">
              <div className="flex items-center gap-2 font-bold">
                <CalendarDays className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                {dateLabel}
              </div>
              <div className="mt-3 flex items-center gap-2 font-bold">
                <Users className="h-5 w-5 text-[#F3CF63]" aria-hidden="true" />
                {seatsLabel}
              </div>
              <TripOfferCountdown
                endsAt={trip.offer_ends_at}
                className="mt-3 font-bold text-rose-200"
              />
            </div>

            {available ? (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-4 text-lg font-black text-[#102F3A] transition duration-200 hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
              >
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
                احجز واستفسر الآن
              </a>
            ) : (
              <span className="mt-5 block rounded-2xl bg-white/10 px-5 py-4 text-center font-black text-white/70">
                العرض غير متاح للحجز حاليًا
              </span>
            )}

            <p className="mt-4 text-center text-xs leading-6 text-white/55">
              تأكيد الموعد والسعر والمقاعد يتم مباشرة مع موظف الحجز.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"
                aria-hidden="true"
              />
              <p>حجز ومتابعة مباشرة من فريق قيصر حتى تأكيد تفاصيل رحلتك.</p>
            </div>
          </aside>
        </section>

        {galleryImage && galleryIndex !== null ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`معرض صور ${trip.title}`}
            tabIndex={-1}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Escape") setGalleryIndex(null);
              if (event.key === "ArrowLeft") {
                setGalleryIndex((galleryIndex + 1) % detailImages.length);
              }
              if (event.key === "ArrowRight") {
                setGalleryIndex((galleryIndex - 1 + detailImages.length) % detailImages.length);
              }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06171d]/95 p-4 backdrop-blur-md focus:outline-none sm:p-8"
          >
            <button
              type="button"
              onClick={() => setGalleryIndex(null)}
              aria-label="إغلاق معرض الصور"
              className="absolute left-4 top-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:bg-white hover:text-[#15343A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3CF63] sm:left-8 sm:top-8"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            <img
              src={galleryImage}
              alt={`${trip.title} - صورة مكبرة ${galleryIndex + 1}`}
              className="max-h-[84vh] max-w-full rounded-3xl object-contain shadow-2xl"
            />

            {detailImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setGalleryIndex((galleryIndex - 1 + detailImages.length) % detailImages.length)
                  }
                  aria-label="الصورة السابقة"
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#15343A] shadow-xl transition hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white sm:right-8"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryIndex((galleryIndex + 1) % detailImages.length)}
                  aria-label="الصورة التالية"
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#15343A] shadow-xl transition hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white sm:left-8"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
              </>
            ) : null}

            <span className="absolute bottom-5 rounded-full bg-black/55 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              {galleryIndex + 1} / {detailImages.length}
            </span>
          </div>
        ) : null}
      </main>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Moon;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#123C49] p-5 text-white">
      <div className="flex items-center gap-3 text-[#F3CF63]">
        <Icon className="h-6 w-6" aria-hidden="true" />
        <h3 className="font-black">{title}</h3>
      </div>
      <p className="mt-3 text-lg font-bold">{value}</p>
    </div>
  );
}
