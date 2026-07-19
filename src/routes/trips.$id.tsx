import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Moon,
  Users,
  UtensilsCrossed,
  WalletCards,
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

export const Route = createFileRoute("/trips/$id")({
  component: DomesticTripDetailsPage,
});

function DomesticTripDetailsPage() {
  const { id } = useParams({ from: "/trips/$id" });
  const tripQuery = usePublicTrip(id);
  const { data: settings } = useSiteSettings();

  if (tripQuery.isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6">
        <p className="text-lg font-bold text-[#15343A]">جاري تحميل تفاصيل الرحلة...</p>
      </main>
    );
  }

  const trip = tripQuery.data;

  if (tripQuery.isError || !trip || trip.page_key !== "domestic") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6 text-center">
        <div>
          <h1 className="text-3xl font-black text-[#15343A]">الرحلة غير موجودة</h1>
          <Link
            to="/packages/$slug"
            params={{ slug: "domestic" }}
            className="mt-6 inline-flex rounded-full bg-[#15343A] px-7 py-3 font-bold text-white"
          >
            العودة للسياحة الداخلية
          </Link>
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
  const detailImages = Array.from(
    new Set([trip.main_image_url, ...(trip.additional_image_urls ?? [])].filter(Boolean)),
  ) as string[];
  const duration =
    trip.nights > 0 ? `${trip.nights + 1} يوم / ${trip.nights} ليلة` : "رحلة يوم كامل";
  const seatsLabel = seatState.tracksSeats
    ? seatState.soldOut
      ? "اكتمل الحجز"
      : `${trip.remaining_seats} مقعد متبقٍ من ${trip.total_seats}`
    : "مقاعد محدودة — تواصل معنا";
  const dateLabel = trip.start_date
    ? formatTripDate(trip.start_date, true)
    : "الموعد الجديد يُعلن قريبًا";
  const bookingUrl = buildWhatsAppUrl(
    settings?.whatsapp,
    `السلام عليكم، أرغب بحجز ${trip.title}. الموعد: ${dateLabel}. السعر: ${formatTripPrice(trip)}.`,
  );

  return (
    <>
      <Helmet>
        <title>{trip.title} | قيصر للسياحة والسفر</title>
        <meta
          name="description"
          content={programItems[0] || `تفاصيل وبرنامج رحلة ${trip.title} مع قيصر للسياحة والسفر.`}
        />
        <link rel="canonical" href={`https://caesar-travel.pages.dev/trips/${trip.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${trip.title} | قيصر للسياحة والسفر`} />
        <meta property="og:image" content={trip.main_image_url} />
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f29] via-[#071f29]/65 to-black/25" />

          <div className="relative mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
            <Link
              to="/packages/$slug"
              params={{ slug: "domestic" }}
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-black/25 px-5 py-2.5 font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#15343A]"
            >
              <ArrowLeft className="h-4 w-4" />
              جميع الرحلات الداخلية
            </Link>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F3CF63]/50 bg-[#D4AF37]/15 px-4 py-2 text-sm font-black text-[#F3CF63] backdrop-blur">
              <MapPin className="h-4 w-4" />
              رحلة داخل الأردن
            </span>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight text-white drop-shadow-xl sm:text-6xl">
              {trip.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white sm:text-base">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <CalendarDays className="h-5 w-5 text-[#F3CF63]" />
                {dateLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <Clock3 className="h-5 w-5 text-[#F3CF63]" />
                {duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <Users className="h-5 w-5 text-[#F3CF63]" />
                {seatsLabel}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-5 grid max-w-7xl gap-7 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative rounded-[2rem] border border-[#D4AF37]/25 bg-white p-6 shadow-xl sm:p-9">
            <span className="font-bold text-[#9B7617]">تفاصيل الرحلة</span>
            <h2 className="mt-2 text-3xl font-black">برنامج الرحلة</h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {(programItems.length > 0
                ? programItems
                : ["برنامج متكامل ومرافق من الشركة طوال الرحلة."]
              ).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-3 rounded-2xl border border-[#15343A]/10 bg-[#F8F4EA] p-4 leading-7"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#B88912]" />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#123C49] p-5 text-white">
                <div className="flex items-center gap-3 text-[#F3CF63]">
                  <Moon className="h-6 w-6" />
                  <h3 className="font-black">مدة الرحلة</h3>
                </div>
                <p className="mt-3 text-lg font-bold">{duration}</p>
              </div>

              <div className="rounded-2xl bg-[#123C49] p-5 text-white">
                <div className="flex items-center gap-3 text-[#F3CF63]">
                  <UtensilsCrossed className="h-6 w-6" />
                  <h3 className="font-black">الوجبات</h3>
                </div>
                <p className="mt-3 text-lg font-bold">{trip.meals || "حسب برنامج الرحلة"}</p>
              </div>
            </div>

            {detailImages.length > 1 ? (
              <div className="mt-10">
                <h2 className="text-2xl font-black">صور الرحلة</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {detailImages.slice(1).map((imageUrl, index) => (
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt={`${trip.title} - صورة ${index + 2}`}
                      className="h-64 w-full rounded-3xl object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="relative h-fit rounded-[2rem] border border-[#D4AF37]/35 bg-[#102F3A] p-6 text-white shadow-xl lg:sticky lg:top-28">
            <div className="flex items-center gap-3 text-[#F3CF63]">
              <WalletCards className="h-6 w-6" />
              <h2 className="text-xl font-black">السعر والحجز</h2>
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
              <p className="mt-2 text-4xl font-black text-[#F3CF63]">{formatTripPrice(trip)}</p>
              {trip.double_price ? (
                <p className="mt-3 border-t border-white/15 pt-3 text-sm leading-6 text-white/80">
                  الغرفة الثنائية: {formatTripAmount(trip.double_price, trip.currency)} للشخص
                </p>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-white/15 p-4">
              <div className="flex items-center gap-2 font-bold">
                <CalendarDays className="h-5 w-5 text-[#F3CF63]" />
                {dateLabel}
              </div>
              <div className="mt-3 flex items-center gap-2 font-bold">
                <Users className="h-5 w-5 text-[#F3CF63]" />
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
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-4 text-lg font-black text-[#102F3A] transition hover:-translate-y-1 hover:bg-[#F3CF63]"
              >
                <MessageCircle className="h-6 w-6" />
                احجز واستفسر الآن
              </a>
            ) : (
              <span className="mt-5 block rounded-2xl bg-white/10 px-5 py-4 text-center font-black text-white/70">
                الرحلة غير متاحة للحجز حاليًا
              </span>
            )}

            <p className="mt-4 text-center text-xs leading-6 text-white/55">
              تأكيد الموعد والمقاعد يتم مباشرة مع موظف الحجز.
            </p>
          </aside>
        </section>
      </main>
    </>
  );
}
