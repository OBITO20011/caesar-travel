import { createFileRoute, useParams } from "@tanstack/react-router";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { usePublicTrip, useSiteSettings } from "@/hooks/use-site-content";
import { buildWhatsAppUrl, formatTripDate, formatTripPrice } from "@/lib/trip-format";

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
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFD9]">
        <h1 className="text-2xl font-bold">رحلة العمرة غير موجودة</h1>
      </main>
    );
  }

  const hotelName = trip.makkah_hotel || trip.title;
  const roomPrices = [
    { label: "غرفة ثنائية", price: trip.double_price },
    { label: "غرفة ثلاثية", price: trip.triple_price },
    { label: "غرفة رباعية", price: trip.quad_price },
  ].filter((item) => item.price !== undefined && item.price !== null);

  if (roomPrices.length === 0 && trip.price !== undefined && trip.price !== null) {
    roomPrices.push({ label: "سعر الباقة", price: trip.price });
  }

  const detailImages = trip.additional_image_urls ?? [];
  const available = trip.status === "available";

  return (
    <main className="min-h-screen bg-[#F5EFD9] p-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#F8F4EA] p-8 shadow-2xl backdrop-blur-md">
        {trip.main_image_url ? (
          <img
            src={trip.main_image_url}
            alt={hotelName}
            className="h-[650px] w-full rounded-3xl bg-[#F8F4EA] object-contain"
          />
        ) : null}

        <p className="mt-3 text-xl text-gray-600">📍 فندق مكة</p>
        <h1 className="mt-8 text-4xl font-bold">{hotelName}</h1>

        {trip.start_date ? (
          <p className="mt-4 text-lg text-gray-600">📅 {formatTripDate(trip.start_date)}</p>
        ) : null}
        {trip.description || trip.nights > 0 ? (
          <p className="mt-2">🌙 المدة: {trip.description || `${trip.nights} ليالٍ`}</p>
        ) : null}
        {trip.meals ? <p className="mt-2">🍽️ الوجبات: {trip.meals}</p> : null}

        {roomPrices.length > 0 ? (
          <>
            <h2 className="mb-5 mt-8 text-2xl font-bold">أسعار الغرف</h2>
            <div className="space-y-4">
              {roomPrices.map((option) => (
                <div
                  key={option.label}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow"
                >
                  <div>
                    <h3 className="text-lg font-bold">🛏️ {option.label}</h3>
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
  );
}
