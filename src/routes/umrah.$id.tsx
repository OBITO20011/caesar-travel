import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  MapPin,
  Plane,
  UtensilsCrossed,
} from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Seo } from "@/components/seo";
import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import { usePublicTrip, useSiteSettings } from "@/hooks/use-site-content";
import { getBreadcrumbItems } from "@/lib/seo-config";
import {
  buildWhatsAppUrl,
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const Route = createFileRoute("/umrah/$id")({
  component: HotelDetailsPage,
});

function HotelDetailsPage() {
  const { id } = useParams({ from: "/umrah/$id" });
  const tripQuery = usePublicTrip(id);
  const { data: settings } = useSiteSettings();

  if (tripQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFD9]">
        <p className="text-lg text-gray-600">جاري تحميل تفاصيل الرحلة...</p>
      </main>
    );
  }

  const trip = tripQuery.data;
  if (tripQuery.isError || !trip || trip.page_key !== "umrah") {
    return (
      <>
        <Seo
          title="رحلة العمرة غير موجودة | قيصر للسياحة والسفر"
          description="رحلة العمرة المطلوبة غير موجودة أو لم تعد متاحة. استعرض رحلات العمرة الحالية لدى قيصر للسياحة والسفر."
          path={`/umrah/${id}`}
          noIndex
        />
        <main className="flex min-h-screen items-center justify-center bg-[#F5EFD9]">
          <h1 className="text-2xl font-bold">رحلة العمرة غير موجودة</h1>
        </main>
      </>
    );
  }

  const hotelName = trip.makkah_hotel || trip.title;
  const roomPrices = [
    { label: "غرفة مفردة", price: trip.single_price },
    { label: "غرفة ثنائية", price: trip.double_price },
    { label: "غرفة ثلاثية", price: trip.triple_price },
    { label: "غرفة رباعية", price: trip.quad_price },
  ].filter((item) => item.price !== undefined && item.price !== null);

  if (roomPrices.length === 0 && trip.price !== undefined && trip.price !== null) {
    roomPrices.push({ label: "سعر الباقة", price: trip.price });
  }

  const detailImages = trip.additional_image_urls ?? [];
  const seatState = getTripSeatState(trip);
  const discount = getTripDiscountPercentage(trip);
  const available = trip.status === "available" && !seatState.soldOut;

  return (
    <>
      <Seo
        title={`${hotelName} | رحلة عمرة مع قيصر للسياحة والسفر`}
        description={`${hotelName}: ${
          trip.description ||
          "تفاصيل رحلة العمرة والإقامة والأسعار والمواعيد وخيارات الغرف مع قيصر للسياحة والسفر."
        }`.slice(0, 180)}
        path={`/umrah/${trip.id}`}
        image={trip.main_image_url}
        imageAlt={hotelName}
        breadcrumbs={getBreadcrumbItems(`/umrah/${trip.id}`, hotelName, {
          name: "رحلات العمرة",
          path: "/umrah",
        })}
      />
      <main className="min-h-screen bg-[#F5EFD9] px-4 pb-8 pt-24 sm:px-6 md:p-8">
        <div
          className="mx-auto max-w-6xl rounded-3xl bg-[#F8F4EA] p-4 shadow-2xl backdrop-blur-md sm:p-6 md:p-8"
          dir="rtl"
        >
          {trip.main_image_url ? (
            <img
              src={trip.main_image_url}
              alt={hotelName}
              title={hotelName}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={1200}
              height={800}
              className="max-h-[650px] min-h-64 w-full rounded-3xl bg-[#F8F4EA] object-contain"
            />
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#153B46] px-4 py-2 text-sm font-bold text-white">
              {trip.umrah_transport === "air" ? (
                <Plane className="h-4 w-4 text-[#E7C56D]" aria-hidden="true" />
              ) : (
                <MapPin className="h-4 w-4 text-[#E7C56D]" aria-hidden="true" />
              )}
              {trip.umrah_transport === "air" ? "برنامج عمرة جو" : "برنامج عمرة بر"}
            </span>
            {trip.umrah_transport === "air" ? (
              <span className="inline-flex min-h-10 items-center rounded-full border border-[#C9A227]/40 bg-[#F8E4A1]/60 px-4 py-2 text-sm font-bold text-[#6B4F00]">
                {trip.umrah_route === "makkah" ? "مكة فقط" : "مكة والمدينة"}
              </span>
            ) : null}
          </div>

          <p className="mt-5 flex items-center gap-2 text-base font-bold text-gray-600">
            <Building2 className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
            فندق مكة
          </p>
          <h1 className="mt-8 text-4xl font-bold">{hotelName}</h1>

          {trip.start_date ? (
            <p className="mt-4 flex items-center gap-2 text-lg text-gray-600">
              <CalendarDays className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
              {trip.schedule_label || formatTripDate(trip.start_date)}
            </p>
          ) : trip.schedule_label ? (
            <p className="mt-4 flex items-center gap-2 text-lg text-gray-600">
              <CalendarDays className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
              {trip.schedule_label}
            </p>
          ) : null}
          {trip.description || trip.nights > 0 ? (
            <p className="mt-3 flex items-start gap-2 leading-8 text-slate-700">
              <BedDouble className="mt-1 h-5 w-5 shrink-0 text-[#B8860B]" aria-hidden="true" />
              <span>
                <b>المدة والتفاصيل:</b> {trip.description || `${trip.nights} ليالٍ`}
              </span>
            </p>
          ) : null}
          {trip.airline ? (
            <p className="mt-3 flex items-center gap-2 text-slate-700">
              <Plane className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
              <b>شركة الطيران:</b> {trip.airline}
            </p>
          ) : null}
          {trip.meals ? (
            <p className="mt-3 flex items-center gap-2 text-slate-700">
              <UtensilsCrossed className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
              <b>الوجبات:</b> {trip.meals}
            </p>
          ) : null}
          {trip.hotel_location ? (
            <p className="mt-3 flex items-center gap-2 text-slate-700">
              <MapPin className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
              <b>الموقع:</b> {trip.hotel_location}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {discount > 0 && trip.old_price ? (
              <>
                <span className="rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white">
                  خصم {discount}%
                </span>
                <span className="text-gray-500 line-through">
                  {formatTripAmount(trip.old_price, trip.currency)}
                </span>
              </>
            ) : null}
            {seatState.tracksSeats ? (
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${seatState.soldOut ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}
              >
                {seatState.soldOut
                  ? "اكتمل الحجز"
                  : seatState.lastSeats
                    ? trip.remaining_seats === 1
                      ? "آخر مقعد"
                      : "آخر مقعدين"
                    : `متبقي ${trip.remaining_seats} مقعد`}
              </span>
            ) : null}
            <TripOfferCountdown
              endsAt={trip.offer_ends_at}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
            />
          </div>

          {roomPrices.length > 0 ? (
            <>
              <h2 className="mb-5 mt-8 text-2xl font-bold">أسعار الغرف</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {roomPrices.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow"
                  >
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold">
                        <BedDouble className="h-5 w-5 text-[#B8860B]" aria-hidden="true" />
                        {option.label}
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatTripPrice({ price: option.price, currency: trip.currency })}
                      </p>
                    </div>

                    {available ? (
                      <a
                        href={buildWhatsAppUrl(
                          settings?.whatsapp,
                          `السلام عليكم، أرغب بحجز رحلة ${hotelName} (${option.label}) بسعر ${formatTripPrice({ price: option.price, currency: trip.currency })}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
                      >
                        احجز الآن
                      </a>
                    ) : (
                      <span className="rounded-xl bg-gray-200 px-6 py-3 font-bold text-gray-600">
                        غير متاحة للحجز
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <ProgramDetailsSection
            title="ما يشمله البرنامج"
            items={trip.program_inclusions}
            icon={CheckCircle2}
            tone="emerald"
          />
          <ProgramDetailsSection
            title="تفاصيل رحلات الطيران"
            items={trip.flight_details}
            icon={Plane}
            tone="blue"
          />
          <ProgramDetailsSection
            title="الوثائق المطلوبة"
            items={trip.program_requirements}
            icon={ClipboardCheck}
            tone="amber"
          />
          <ProgramDetailsSection
            title="ملاحظات وشروط الحجز"
            items={trip.program_notes}
            icon={CircleAlert}
            tone="slate"
          />

          {detailImages.length > 0 ? (
            <>
              <h2 className="mb-4 mt-10 text-2xl font-bold">صور الفندق</h2>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
              >
                {detailImages.map((imageUrl, index) => (
                  <SwiperSlide key={imageUrl}>
                    <img
                      src={imageUrl}
                      alt={`${hotelName} - صورة ${index + 1}`}
                      title={`${hotelName} - صورة ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      width={1200}
                      height={800}
                      className="h-[500px] w-full rounded-3xl object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : null}

          {trip.madinah_hotel || trip.madinah_image_url ? (
            <>
              <h2 className="mb-6 mt-12 text-2xl font-bold">فندق المدينة</h2>
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {trip.madinah_image_url ? (
                  <img
                    src={trip.madinah_image_url}
                    alt={trip.madinah_hotel || "فندق المدينة"}
                    title={trip.madinah_hotel || "فندق المدينة"}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={560}
                    className="h-56 w-80 rounded-3xl object-cover"
                  />
                ) : null}
                <div>
                  <h3 className="text-2xl font-bold">{trip.madinah_hotel || "فندق المدينة"}</h3>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}

const detailToneClasses = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  blue: "border-sky-200 bg-sky-50 text-sky-800",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  slate: "border-slate-200 bg-slate-50 text-slate-800",
} as const;

function ProgramDetailsSection({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items?: string[];
  icon: typeof Plane;
  tone: keyof typeof detailToneClasses;
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-10" aria-labelledby={`section-${title}`}>
      <h2 id={`section-${title}`} className="mb-4 text-2xl font-black text-slate-900">
        {title}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className={`flex items-start gap-3 rounded-2xl border p-4 leading-7 ${detailToneClasses[tone]}`}
          >
            <Icon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
