import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  BusFront,
  CalendarDays,
  MapPin,
  Plane,
  UtensilsCrossed,
} from "lucide-react";

import umrahBg from "@/assets/umrah-bg.jpg";
import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import { usePublicTrips } from "@/hooks/use-site-content";
import {
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";
import type { Trip, UmrahRoute, UmrahTransport } from "@/types/admin";

export const Route = createFileRoute("/umrah/")({
  component: UmrahPage,
});

const statusLabels = {
  fully_booked: "مكتملة الحجز",
  cancelled: "ملغاة",
  completed: "مكتملة",
  hidden: "مخفية",
} as const;

const transportTabs: Array<{
  value: UmrahTransport;
  label: string;
  description: string;
  icon: typeof Plane;
}> = [
  {
    value: "land",
    label: "برامج البر",
    description: "رحلات العمرة بالحافلات",
    icon: BusFront,
  },
  {
    value: "air",
    label: "برامج الجو",
    description: "رحلات العمرة بالطائرة",
    icon: Plane,
  },
];

const airRouteTabs: Array<{ value: UmrahRoute; label: string; description: string }> = [
  { value: "makkah", label: "مكة فقط", description: "إقامة كاملة في مكة المكرمة" },
  {
    value: "makkah_madinah",
    label: "مكة والمدينة",
    description: "إقامة تجمع مكة المكرمة والمدينة المنورة",
  },
];

function UmrahPage() {
  const tripsQuery = usePublicTrips("umrah");
  const [transport, setTransport] = useState<UmrahTransport>("land");
  const [airRoute, setAirRoute] = useState<UmrahRoute>("makkah");

  const groupedTrips = useMemo(() => {
    const trips = tripsQuery.data ?? [];
    const land = trips.filter((trip) => trip.umrah_transport !== "air");
    const makkah = trips.filter(
      (trip) => trip.umrah_transport === "air" && trip.umrah_route === "makkah",
    );
    const makkahMadinah = trips.filter(
      (trip) => trip.umrah_transport === "air" && trip.umrah_route === "makkah_madinah",
    );

    return { land, makkah, makkahMadinah };
  }, [tripsQuery.data]);

  const visibleTrips =
    transport === "land"
      ? groupedTrips.land
      : airRoute === "makkah"
        ? groupedTrips.makkah
        : groupedTrips.makkahMadinah;

  const sectionTitle =
    transport === "land"
      ? "برامج العمرة برًا"
      : airRoute === "makkah"
        ? "برامج الجو – مكة فقط"
        : "برامج الجو – مكة والمدينة";

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-fixed before:absolute before:inset-0 before:z-0 before:bg-black/60"
      style={{ backgroundImage: `url(${umrahBg})` }}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#1A1207]/90" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:px-8 md:py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-black tracking-wide text-[#F8E4A1]">
            قيصر للسياحة والسفر
          </p>
          <h1 className="text-3xl font-black text-[#E7C56D] drop-shadow-lg sm:text-4xl">
            رحلات العمرة
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-[#F8E4A1]/85 sm:text-lg">
            اختر طريقة السفر أولًا، ثم استعرض البرنامج والفندق والسعر المناسب لك.
          </p>
        </header>

        <section className="mx-auto mt-8 max-w-3xl" aria-label="اختيار طريقة السفر">
          <div
            role="tablist"
            aria-label="برامج العمرة برًا أو جوًا"
            className="grid grid-cols-2 gap-3 rounded-[28px] border border-[#D4AF37]/25 bg-black/35 p-2 shadow-2xl backdrop-blur-xl"
          >
            {transportTabs.map((tab) => {
              const Icon = tab.icon;
              const selected = transport === tab.value;
              const count =
                tab.value === "land"
                  ? groupedTrips.land.length
                  : groupedTrips.makkah.length + groupedTrips.makkahMadinah.length;

              return (
                <button
                  key={tab.value}
                  id={`transport-tab-${tab.value}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="umrah-results"
                  onClick={() => setTransport(tab.value)}
                  className={`min-h-24 cursor-pointer rounded-[22px] px-3 py-4 text-center transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E7C56D]/45 ${
                    selected
                      ? "bg-[#C9A227] text-[#17120A] shadow-[0_12px_30px_rgba(201,162,39,0.28)]"
                      : "bg-white/5 text-[#F8E4A1] hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2 text-base font-black sm:text-lg">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {tab.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${selected ? "bg-black/10" : "bg-white/10"}`}
                    >
                      {count}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block text-xs sm:text-sm ${selected ? "text-black/70" : "text-white/60"}`}
                  >
                    {tab.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {transport === "air" ? (
          <section className="mx-auto mt-5 max-w-3xl" aria-label="اختيار مسار برنامج الجو">
            <div
              role="tablist"
              aria-label="مسارات برامج العمرة جوًا"
              className="grid gap-3 sm:grid-cols-2"
            >
              {airRouteTabs.map((tab) => {
                const selected = airRoute === tab.value;
                const count =
                  tab.value === "makkah"
                    ? groupedTrips.makkah.length
                    : groupedTrips.makkahMadinah.length;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="umrah-results"
                    onClick={() => setAirRoute(tab.value)}
                    className={`min-h-20 cursor-pointer rounded-2xl border px-4 py-3 text-right transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E7C56D]/45 ${
                      selected
                        ? "border-[#E7C56D] bg-[#F8E4A1] text-[#1A1207] shadow-lg"
                        : "border-white/15 bg-black/30 text-white hover:border-[#E7C56D]/50 hover:bg-black/45"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-black">{tab.label}</span>
                      <span className="rounded-full bg-[#C9A227]/20 px-2.5 py-1 text-xs font-black">
                        {count} برنامج
                      </span>
                    </span>
                    <span
                      className={`mt-1 block text-xs ${selected ? "text-black/65" : "text-white/60"}`}
                    >
                      {tab.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section
          id="umrah-results"
          role="tabpanel"
          aria-labelledby={`transport-tab-${transport}`}
          className="mt-10"
        >
          <div className="mb-6 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-right">
            <div>
              <p className="text-sm font-bold text-[#F8E4A1]/65">البرامج المتاحة</p>
              <h2 className="mt-1 text-2xl font-black text-[#E7C56D] sm:text-3xl">
                {sectionTitle}
              </h2>
            </div>
            {!tripsQuery.isLoading && !tripsQuery.isError ? (
              <p className="text-sm font-bold text-[#F8E4A1]/75">{visibleTrips.length} نتيجة</p>
            ) : null}
          </div>

          {tripsQuery.isLoading ? (
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              aria-label="جاري تحميل البرامج"
            >
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[480px] animate-pulse rounded-3xl border border-white/10 bg-white/10"
                />
              ))}
            </div>
          ) : tripsQuery.isError ? (
            <p
              role="alert"
              className="rounded-3xl border border-red-300/30 bg-red-950/45 px-6 py-16 text-center text-red-100"
            >
              تعذر تحميل رحلات العمرة حاليًا. حاول تحديث الصفحة.
            </p>
          ) : visibleTrips.length === 0 ? (
            <div className="rounded-3xl border border-[#D4AF37]/25 bg-black/35 px-6 py-16 text-center backdrop-blur-xl">
              <Plane className="mx-auto h-10 w-10 text-[#E7C56D]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black text-[#F8E4A1]">
                لا توجد برامج معروضة حاليًا
              </h3>
              <p className="mt-2 text-sm text-[#F8E4A1]/65">
                يمكنك اختيار قسم آخر، أو العودة لاحقًا بعد إضافة البرامج الجديدة.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleTrips.map((trip) => (
                <UmrahProgramCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function UmrahProgramCard({ trip }: { trip: Trip }) {
  const seatState = getTripSeatState(trip);
  const discount = getTripDiscountPercentage(trip);
  const available = trip.status === "available" && !seatState.soldOut;
  const hotelName = trip.makkah_hotel || trip.title;
  const isAir = trip.umrah_transport === "air";

  return (
    <Link
      to="/umrah/$id"
      params={{ id: trip.id }}
      aria-label={`عرض تفاصيل ${trip.title}`}
      className="group flex h-full cursor-pointer flex-col rounded-3xl border border-[#D4AF37]/25 bg-[#1C1B1A]/75 p-5 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E7C56D]/45"
    >
      <div className="relative h-56 overflow-hidden rounded-2xl bg-black/30">
        <img
          src={trip.main_image_url || umrahBg}
          alt={trip.title}
          title={trip.title}
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = umrahBg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-black text-white backdrop-blur-md">
          {isAir ? <Plane className="h-3.5 w-3.5" /> : <BusFront className="h-3.5 w-3.5" />}
          {isAir ? "برنامج جو" : "برنامج بر"}
        </span>
        {discount > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-black text-white">
            خصم {discount}%
          </span>
        ) : null}
        {seatState.lastSeats ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-black">
            {trip.remaining_seats === 1 ? "آخر مقعد" : "آخر مقعدين"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black leading-8 text-[#F8E4A1]">{trip.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#F8E4A1]/60">
              <CalendarDays className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              {trip.schedule_label ||
                (trip.start_date ? formatTripDate(trip.start_date) : "الموعد يؤكد عند الحجز")}
            </p>
          </div>
          {isAir ? (
            <span className="shrink-0 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-1 text-[11px] font-black text-[#E7C56D]">
              {trip.umrah_route === "makkah" ? "مكة فقط" : "مكة والمدينة"}
            </span>
          ) : null}
        </div>

        <div className="mt-4 space-y-2.5 text-sm leading-6 text-[#F8E4A1]/80">
          <p className="flex items-start gap-2">
            <Building2 className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <span>
              <b>فندق مكة:</b> {hotelName}
            </span>
          </p>
          {trip.madinah_hotel ? (
            <p className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>
                <b>فندق المدينة:</b> {trip.madinah_hotel}
              </span>
            </p>
          ) : null}
          {trip.description || trip.nights > 0 ? (
            <p className="flex items-start gap-2">
              <BedDouble className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>
                <b>المدة:</b>{" "}
                {trip.nights > 0
                  ? `${trip.nights + 1} أيام / ${trip.nights} ليالٍ`
                  : trip.description}
              </span>
            </p>
          ) : null}
          {trip.meals ? (
            <p className="flex items-start gap-2">
              <UtensilsCrossed
                className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]"
                aria-hidden="true"
              />
              <span>
                <b>الوجبات:</b> {trip.meals}
              </span>
            </p>
          ) : null}
        </div>

        {seatState.tracksSeats ? (
          <p
            className={`mt-4 text-sm font-bold ${seatState.soldOut ? "text-rose-300" : "text-[#F8E4A1]"}`}
          >
            {seatState.soldOut
              ? "اكتمل الحجز"
              : `متبقي ${trip.remaining_seats} من ${trip.total_seats} مقعد`}
          </p>
        ) : null}
        <TripOfferCountdown
          endsAt={trip.offer_ends_at}
          className="mt-3 text-xs font-bold text-rose-300"
        />

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            {trip.old_price && discount > 0 ? (
              <p className="text-sm text-[#F8E4A1]/55 line-through">
                {formatTripAmount(trip.old_price, trip.currency)}
              </p>
            ) : null}
            <span className="text-2xl font-black text-[#E7C56D]">{formatTripPrice(trip)}</span>
          </div>

          <span
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-black ${
              available ? "bg-[#C9A227] text-[#17120A]" : "bg-gray-700 text-gray-200"
            }`}
          >
            {available
              ? "التفاصيل"
              : seatState.soldOut
                ? "اكتمل الحجز"
                : statusLabels[trip.status as keyof typeof statusLabels] || "غير متاحة"}
            {available ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : null}
          </span>
        </div>
      </div>
    </Link>
  );
}
