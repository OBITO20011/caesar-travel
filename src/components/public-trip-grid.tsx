import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock3, MapPin, Star } from "lucide-react";

import { usePublicTrips, useSiteSettings } from "@/hooks/use-site-content";
import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import {
  buildWhatsAppUrl,
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";
import type { ReactNode } from "react";

import type { TripPageKey } from "@/types/admin";

interface PublicTripGridProps {
  pageKey: TripPageKey;
  fallbackImage: string;
  emptyContent?: ReactNode;
}

const unavailableLabels = {
  fully_booked: "مكتملة الحجز",
  cancelled: "ملغاة",
  completed: "مكتملة",
} as const;

export function PublicTripGrid({ pageKey, fallbackImage, emptyContent }: PublicTripGridProps) {
  const tripsQuery = usePublicTrips(pageKey);
  const { data: settings } = useSiteSettings();
  const isHotelPage = pageKey === "egypt" || pageKey === "turkey" || pageKey === "hotels";

  if (tripsQuery.isLoading) {
    return <p className="col-span-full py-10 text-center text-gray-400">جاري تحميل الرحلات...</p>;
  }

  if (tripsQuery.isError) {
    return (
      <p className="col-span-full py-10 text-center text-red-300">
        تعذر تحميل الرحلات حالياً. حاول تحديث الصفحة.
      </p>
    );
  }

  const trips = tripsQuery.data ?? [];
  if (trips.length === 0) {
    if (emptyContent) return <>{emptyContent}</>;

    return (
      <p className="col-span-full py-10 text-center text-gray-400">لا توجد رحلات معروضة حالياً.</p>
    );
  }

  return trips.map((trip) => {
    const seatState = getTripSeatState(trip);
    const discount = getTripDiscountPercentage(trip);
    const unavailable = trip.status !== "available" || seatState.soldOut;
    const stayOptions = [...(trip.stay_options ?? [])].sort(
      (first, second) => first.days - second.days,
    );
    const startingStayOption = stayOptions[0];
    const startingPrice = startingStayOption?.price ?? trip.price;
    const stayRange =
      stayOptions.length > 1
        ? `${stayOptions[0].days}–${stayOptions[stayOptions.length - 1].days} أيام`
        : startingStayOption
          ? `${startingStayOption.days} أيام`
          : null;

    return (
      <article
        key={trip.id}
        className="group relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#171717] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
      >
        <Link
          to="/trips/$id"
          params={{ id: trip.id }}
          aria-label={`عرض تفاصيل ${trip.title}`}
          className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3CF63]"
        >
          <span className="sr-only">عرض تفاصيل {trip.title}</span>
        </Link>

        <div className="relative h-56 overflow-hidden">
          <img
            src={trip.main_image_url || fallbackImage}
            alt={trip.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
          {discount > 0 ? (
            <span className="absolute right-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-sm font-black text-white shadow-lg">
              خصم {discount}%
            </span>
          ) : null}
          {seatState.lastSeats ? (
            <span className="absolute bottom-4 left-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black shadow-lg">
              {trip.remaining_seats === 1 ? "آخر مقعد" : "آخر مقعدين"}
            </span>
          ) : null}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-white">{trip.title}</h3>

          {trip.hotel_stars ? (
            <div
              className="mt-3 flex items-center gap-1 text-[#D4AF37]"
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
            </div>
          ) : null}

          {trip.schedule_label || trip.start_date ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-300">
              <CalendarDays className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              {trip.schedule_label || formatTripDate(trip.start_date!)}
            </p>
          ) : null}
          {trip.hotel_location ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              {trip.hotel_location}
            </p>
          ) : null}
          {stayRange ? (
            <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#F3CF63]">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              خيارات إقامة من {stayRange}
            </p>
          ) : null}
          {trip.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{trip.description}</p>
          ) : null}
          <p className="mt-3 text-sm font-bold text-[#F3CF63]">
            {isHotelPage ? "اختر مدة إقامتك وشاهد جميع الصور" : "اضغط لعرض البرنامج والتفاصيل"}
          </p>

          {seatState.tracksSeats ? (
            <p
              className={`mt-3 text-sm font-bold ${seatState.soldOut ? "text-rose-300" : "text-amber-200"}`}
            >
              {seatState.soldOut
                ? "اكتمل الحجز"
                : `متبقي ${trip.remaining_seats} من ${trip.total_seats} مقعد`}
            </p>
          ) : null}
          <TripOfferCountdown
            endsAt={trip.offer_ends_at}
            className="mt-2 text-xs font-bold text-rose-300"
          />

          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-400">يبدأ من</p>
              {trip.old_price && discount > 0 ? (
                <p className="text-sm text-gray-500 line-through">
                  {formatTripAmount(trip.old_price, trip.currency)}
                </p>
              ) : null}
              <p className="text-2xl font-bold text-[#D4AF37]">
                {startingPrice !== undefined && startingPrice !== null
                  ? formatTripAmount(startingPrice, trip.currency)
                  : formatTripPrice(trip)}
              </p>
            </div>

            {unavailable ? (
              <span className="rounded-full bg-gray-700 px-5 py-2 text-sm font-bold text-gray-200">
                {seatState.soldOut
                  ? "اكتمل الحجز"
                  : unavailableLabels[trip.status as keyof typeof unavailableLabels] || "غير متاحة"}
              </span>
            ) : isHotelPage ? (
              <Link
                to="/trips/$id"
                params={{ id: trip.id }}
                className="relative z-20 rounded-full bg-[#D4AF37] px-6 py-2 font-bold text-black transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3CF63]/60"
              >
                احجز الآن
              </Link>
            ) : (
              <a
                href={buildWhatsAppUrl(
                  settings?.whatsapp,
                  `السلام عليكم، أرغب بحجز ${trip.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 rounded-full bg-[#D4AF37] px-6 py-2 font-bold text-black transition hover:scale-105"
              >
                احجز الآن
              </a>
            )}
          </div>
        </div>
      </article>
    );
  });
}
