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

    return (
      <div
        key={trip.id}
        className="group overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#171717] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={trip.main_image_url || fallbackImage}
            alt={trip.title}
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

          <div className="mt-2 text-lg text-[#D4AF37]">★★★★★</div>

          {trip.start_date ? (
            <p className="mt-3 text-sm text-gray-300">📅 {formatTripDate(trip.start_date)}</p>
          ) : null}
          {trip.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{trip.description}</p>
          ) : null}

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
              <p className="text-2xl font-bold text-[#D4AF37]">{formatTripPrice(trip)}</p>
            </div>

            {unavailable ? (
              <span className="rounded-full bg-gray-700 px-5 py-2 text-sm font-bold text-gray-200">
                {seatState.soldOut
                  ? "اكتمل الحجز"
                  : unavailableLabels[trip.status as keyof typeof unavailableLabels] || "غير متاحة"}
              </span>
            ) : (
              <a
                href={buildWhatsAppUrl(
                  settings?.whatsapp,
                  `السلام عليكم، أرغب بحجز ${trip.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#D4AF37] px-6 py-2 font-bold text-black transition hover:scale-105"
              >
                احجز الآن
              </a>
            )}
          </div>
        </div>
      </div>
    );
  });
}
