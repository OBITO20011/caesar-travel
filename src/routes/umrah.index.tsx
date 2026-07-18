import { createFileRoute, Link } from "@tanstack/react-router";

import umrahBg from "@/assets/umrah-bg.png";
import { usePublicTrips } from "@/hooks/use-site-content";
import { formatTripDate, formatTripPrice } from "@/lib/trip-format";

export const Route = createFileRoute("/umrah/")({
  component: UmrahPage,
});

const statusLabels = {
  fully_booked: "مكتملة الحجز",
  cancelled: "ملغاة",
  completed: "مكتملة",
} as const;

function UmrahPage() {
  const tripsQuery = usePublicTrips("umrah");
  const trips = tripsQuery.data ?? [];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed before:absolute before:inset-0 before:z-0 before:bg-black/60"
      style={{ backgroundImage: `url(${umrahBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#1A1207]/90" />
      <div className="relative z-10 mx-auto max-w-7xl px-8 py-16">
        <h1 className="mb-2 text-center text-4xl font-bold text-[#E7C56D] drop-shadow-lg">
          رحلات العمرة
        </h1>

        <h2 className="mb-8 text-center text-4xl font-bold text-[#E7C56D] drop-shadow-lg">
          اختر الرحلة المناسبة لك واحجز الآن
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tripsQuery.isLoading ? (
            <p className="col-span-full py-16 text-center text-[#F8E4A1]">
              جاري تحميل رحلات العمرة...
            </p>
          ) : tripsQuery.isError ? (
            <p className="col-span-full py-16 text-center text-red-200">
              تعذر تحميل رحلات العمرة حالياً. حاول تحديث الصفحة.
            </p>
          ) : trips.length === 0 ? (
            <p className="col-span-full py-16 text-center text-[#F8E4A1]">
              لا توجد رحلات عمرة معروضة حالياً.
            </p>
          ) : (
            trips.map((trip) => {
              const available = trip.status === "available";
              const hotelName = trip.makkah_hotel || trip.title;

              return (
                <Link key={trip.id} to="/umrah/$id" params={{ id: trip.id }}>
                  <div className="cursor-pointer rounded-3xl border border-[#D4AF37]/25 bg-[#1C1B1A]/70 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]">
                    <img
                      src={trip.main_image_url || umrahBg}
                      alt={hotelName}
                      className="mb-4 h-56 w-full rounded-2xl object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = umrahBg;
                      }}
                    />

                    <h2 className="mb-4 text-2xl font-bold text-[#8B6B00]">
                      {trip.start_date ? `رحلة ${formatTripDate(trip.start_date)}` : trip.title}
                    </h2>

                    <div className="space-y-2">
                      <p className="text-[#F8E4A1]">
                        🏨 <b>فندق مكة:</b> {hotelName}
                      </p>
                      {trip.madinah_hotel ? (
                        <p className="text-[#F8E4A1]">
                          🕌 <b>فندق المدينة:</b> {trip.madinah_hotel}
                        </p>
                      ) : null}
                      {trip.room_type ? (
                        <p className="text-[#F8E4A1]">
                          🛏️ <b>الغرفة:</b> {trip.room_type}
                        </p>
                      ) : null}
                      {trip.description || trip.nights > 0 ? (
                        <p className="text-[#F8E4A1]">
                          🌙 <b>المدة:</b> {trip.description || `${trip.nights} ليالٍ`}
                        </p>
                      ) : null}
                      {trip.meals ? (
                        <p className="text-[#F8E4A1]">
                          🍽️ <b>الوجبات:</b> {trip.meals}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <span className="text-2xl font-bold text-[#B8860B]">
                        {formatTripPrice(trip)}
                      </span>

                      {available ? (
                        <span className="rounded-xl bg-[#C9A227] px-5 py-2 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#B8860B] hover:shadow-[0_10px_25px_rgba(212,175,55,0.5)]">
                          احجز الآن
                        </span>
                      ) : (
                        <span className="rounded-xl bg-gray-700 px-5 py-2 text-sm font-bold text-gray-200">
                          {statusLabels[trip.status as keyof typeof statusLabels] || "غير متاحة"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
