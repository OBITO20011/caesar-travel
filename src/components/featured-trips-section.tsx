import galleryDubai from "@/assets/gallery-dubai.jpg";
import galleryEgypt from "@/assets/gallery-egypt.webp";
import galleryFlight from "@/assets/gallery-flight.jpg";
import galleryMedina from "@/assets/gallery-medina.jpg";
import heroHajj from "@/assets/hero-hajj.jpg";
import { getPackageDestination } from "@/data/package-destinations";
import { useFeaturedTrips } from "@/hooks/use-site-content";
import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import {
  buildWhatsAppUrl,
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";
import type { SiteSettings, TripPageKey } from "@/types/admin";
import { ArrowLeft, CalendarDays, MapPinned, MessageCircle, Sparkles, Users } from "lucide-react";

const pageLabels: Record<TripPageKey, string> = {
  general: "رحلات سياحية",
  umrah: "العمرة",
  hajj: "الحج",
  egypt: "مصر",
  dubai: "دبي",
  switzerland: "سويسرا",
  maldives: "المالديف",
  georgia: "جورجيا",
  domestic: "السياحة الداخلية",
  flights: "الطيران",
  hotels: "الفنادق",
};

const pagePaths: Record<TripPageKey, string> = {
  general: "/gallery",
  umrah: "/umrah",
  hajj: "/hajj",
  egypt: "/egypt",
  dubai: "/dubai",
  switzerland: "/packages/switzerland",
  maldives: "/packages/maldives",
  georgia: "/packages/georgia",
  domestic: "/packages/domestic",
  flights: "/packages/flights",
  hotels: "/packages/hotels",
};

function fallbackImage(pageKey: TripPageKey) {
  const packageDestination = getPackageDestination(pageKey);
  if (packageDestination) return packageDestination.image;

  const images: Partial<Record<TripPageKey, string>> = {
    general: galleryFlight,
    umrah: galleryMedina,
    hajj: heroHajj,
    egypt: galleryEgypt,
    dubai: galleryDubai,
  };

  return images[pageKey] || galleryFlight;
}

export function FeaturedTripsSection({ settings }: { settings?: SiteSettings }) {
  const featuredQuery = useFeaturedTrips();
  const trips = featuredQuery.data ?? [];

  if (!featuredQuery.isLoading && trips.length === 0) return null;

  return (
    <section
      id="featured-trips"
      className="relative overflow-hidden bg-[#0d2740] py-24 text-white md:py-28"
    >
      <div className="absolute -right-32 top-12 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-sm font-bold text-gold-light">
              <Sparkles className="h-4 w-4" />
              اختيارات قيصر لهذا الموسم
            </span>
            <h2 className="mt-5 text-3xl font-black sm:text-4xl md:text-5xl">العروض المميزة</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              باقات مختارة بعناية تجمع بين السعر المناسب، التنظيم الموثوق وتجربة السفر المريحة.
            </p>
          </div>
          <a
            href="/gallery"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:border-gold/60 hover:bg-white/15"
          >
            مشاهدة كل الوجهات
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredQuery.isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[440px] animate-pulse rounded-[2rem] bg-white/10" />
              ))
            : trips.map((trip) => {
                const image = trip.main_image_url || fallbackImage(trip.page_key);
                const discount = getTripDiscountPercentage(trip);
                const seatState = getTripSeatState(trip);
                return (
                  <article
                    key={trip.id}
                    className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/10 backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:border-gold/45"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={image}
                        alt={trip.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage(trip.page_key);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2740] via-transparent to-black/10" />
                      <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs font-bold backdrop-blur-md">
                        {pageLabels[trip.page_key]}
                      </span>
                      {discount > 0 ? (
                        <span className="absolute left-5 top-5 rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white shadow-xl">
                          خصم {discount}%
                        </span>
                      ) : null}
                      {seatState.lastSeats ? (
                        <span className="absolute bottom-5 left-5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950">
                          {trip.remaining_seats === 1 ? "آخر مقعد" : "آخر مقعدين"}
                        </span>
                      ) : null}
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-black leading-snug">{trip.title}</h3>
                      {trip.description ? (
                        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-white/65">
                          {trip.description}
                        </p>
                      ) : null}

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/70">
                        <div className="flex items-center gap-2 rounded-2xl bg-white/[0.07] px-3 py-3">
                          <CalendarDays className="h-4 w-4 text-gold" />
                          <span>
                            {trip.start_date ? formatTripDate(trip.start_date) : "موعد مرن"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-white/[0.07] px-3 py-3">
                          {seatState.tracksSeats ? (
                            <Users className="h-4 w-4 text-gold" />
                          ) : (
                            <MapPinned className="h-4 w-4 text-gold" />
                          )}
                          <span>
                            {seatState.tracksSeats
                              ? seatState.soldOut
                                ? "اكتمل الحجز"
                                : `${trip.remaining_seats} مقعد متبقٍ`
                              : pageLabels[trip.page_key]}
                          </span>
                        </div>
                      </div>

                      <TripOfferCountdown
                        endsAt={trip.offer_ends_at}
                        className="mt-4 rounded-full bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-100"
                      />

                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                        <div>
                          <p className="text-xs text-white/50">يبدأ السعر من</p>
                          {trip.old_price && discount > 0 ? (
                            <p className="mt-1 text-sm text-white/45 line-through">
                              {formatTripAmount(trip.old_price, trip.currency)}
                            </p>
                          ) : null}
                          <p className="mt-1 text-xl font-black text-gold-light">
                            {formatTripPrice(trip)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={pagePaths[trip.page_key]}
                            aria-label={`تفاصيل ${trip.title}`}
                            className="inline-flex h-11 items-center rounded-full border border-white/20 px-4 text-sm font-bold transition hover:bg-white/10"
                          >
                            التفاصيل
                          </a>
                          {seatState.soldOut ? (
                            <span className="inline-flex h-11 items-center rounded-full bg-rose-500/20 px-4 text-sm font-bold text-rose-100">
                              اكتمل الحجز
                            </span>
                          ) : (
                            <a
                              href={buildWhatsAppUrl(
                                settings?.whatsapp,
                                `السلام عليكم، أرغب بحجز العرض المميز: ${trip.title}.`,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`حجز ${trip.title} عبر واتساب`}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:scale-105"
                            >
                              <MessageCircle className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
}
