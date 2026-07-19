import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import { usePublicTrips, useSiteSettings } from "@/hooks/use-site-content";
import {
  buildWhatsAppUrl,
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";

export const Route = createFileRoute("/hajj")({
  component: HajjPage,
});

const statusLabels = {
  available: "التسجيل مفتوح الآن",
  fully_booked: "اكتمل التسجيل",
  cancelled: "البرنامج ملغى",
  completed: "انتهى البرنامج",
} as const;

function HajjPage() {
  const tripsQuery = usePublicTrips("hajj");
  const { data: settings } = useSiteSettings();
  const trips = tripsQuery.data ?? [];

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat py-16"
      style={{ backgroundImage: "url('/images/hajj-banner.jpg')" }}
    >
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        {tripsQuery.isLoading ? (
          <div className="rounded-3xl bg-white/35 p-10 text-center text-lg backdrop-blur-md">
            جاري تحميل برامج الحج...
          </div>
        ) : tripsQuery.isError ? (
          <div className="rounded-3xl bg-white/35 p-10 text-center text-lg backdrop-blur-md">
            تعذر تحميل برامج الحج حالياً. حاول تحديث الصفحة.
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-3xl bg-white/35 p-10 text-center text-lg backdrop-blur-md">
            لا توجد برامج حج معروضة حالياً.
          </div>
        ) : (
          trips.map((trip) => {
            const seatState = getTripSeatState(trip);
            const discount = getTripDiscountPercentage(trip);
            const available = trip.status === "available" && !seatState.soldOut;

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="rounded-3xl border border-white/30 bg-white/35 p-10 shadow-2xl backdrop-blur-md"
              >
                <span
                  className={`rounded-full px-5 py-2 font-bold text-white ${
                    available ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {seatState.soldOut
                    ? "اكتمل التسجيل"
                    : statusLabels[trip.status as keyof typeof statusLabels] || "غير متاح"}
                </span>

                <h1 className="mt-6 flex items-center justify-center gap-3 text-5xl font-bold text-blue-900">
                  🕋
                  <span>{trip.title}</span>
                </h1>

                {trip.description ? (
                  <p className="mt-6 text-xl leading-9 text-gray-700">{trip.description}</p>
                ) : null}

                {trip.start_date || trip.end_date ? (
                  <div className="mt-10 rounded-2xl bg-slate-50 p-6">
                    <h2 className="mb-4 text-2xl font-bold">📅 موعد الحج المتوقع</h2>

                    {trip.start_date ? (
                      <p className="text-lg">
                        بداية الحج: <b>{formatTripDate(trip.start_date, true)}</b>
                      </p>
                    ) : null}

                    {trip.end_date ? (
                      <p className="mt-2 text-lg">
                        نهاية المناسك: <b>{formatTripDate(trip.end_date, true)}</b>
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {trip.price !== undefined && trip.price !== null ? (
                    <div className="rounded-2xl bg-white/70 px-5 py-3">
                      {trip.old_price && discount > 0 ? (
                        <p className="text-sm text-gray-500 line-through">
                          {formatTripAmount(trip.old_price, trip.currency)}
                        </p>
                      ) : null}
                      <p className="text-2xl font-black text-blue-900">{formatTripPrice(trip)}</p>
                    </div>
                  ) : null}
                  {discount > 0 ? (
                    <span className="rounded-full bg-rose-600 px-4 py-2 font-black text-white">
                      خصم {discount}%
                    </span>
                  ) : null}
                  {seatState.tracksSeats ? (
                    <span
                      className={`rounded-full px-4 py-2 font-bold ${seatState.soldOut ? "bg-rose-600 text-white" : "bg-amber-300 text-slate-900"}`}
                    >
                      {seatState.soldOut
                        ? "اكتمل التسجيل"
                        : seatState.lastSeats
                          ? trip.remaining_seats === 1
                            ? "آخر مقعد"
                            : "آخر مقعدين"
                          : `متبقي ${trip.remaining_seats} مقعد`}
                    </span>
                  ) : null}
                  <TripOfferCountdown
                    endsAt={trip.offer_ends_at}
                    className="rounded-full bg-slate-900/80 px-4 py-2 font-bold text-white"
                  />
                </div>

                {available ? (
                  <a
                    href={buildWhatsAppUrl(
                      settings?.whatsapp,
                      `السلام عليكم، أرغب بالتسجيل في ${trip.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 inline-block rounded-2xl bg-green-600 px-8 py-4 text-xl font-bold text-white hover:bg-green-700"
                  >
                    سجل الآن عبر واتساب
                  </a>
                ) : null}
              </motion.div>
            );
          })
        )}
      </div>
    </main>
  );
}
