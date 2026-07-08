import { createFileRoute, useParams } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
export const Route = createFileRoute("/umrah/$id")({
  component: HotelDetailsPage,
});

function HotelDetailsPage() {
    const { id } = useParams({ from: "/umrah/$id" });

  const trips = [
  {
    id: 1,
    date: "1 / 7 / 2026",
    hotelMakkah: "فجر البديع 6",
    hotelMadinah: "المركزية",
    room: "رباعي",
    nights: "6 ليالي مكة - ليلتين المدينة",
    prices: {
  double: 235,
  triple: 215,
  quad: 190,
},
    meals: "بدون وجبات",

    image: "/images/hotels/fajr/main.png",

    makkahImages: [
      "/images/hotels/fajr/1.jpg",
      "/images/hotels/fajr/2.jpg",
      "/images/hotels/fajr/3.jpg",
      
    ],

    cityImage: "/images/madinah.jpg/madinah.jpg"
  },

  {
    id: 2,
    date: "8 / 7 / 2026",
    hotelMakkah: "فيوليت 2",
    hotelMadinah: "المركزية",
    room: "ثلاثي",
    nights: "6 ليالي مكة - ليلتين المدينة",
   prices: {
  double: 250,
  triple: 220,
  quad: 210,
},
    meals: "بدون وجبات",

    image: "/images/hotels/violet/main.png",

    makkahImages: [
      "/images/hotels/violet/1.jpg",
      "/images/hotels/violet/2.jpg",
      "/images/hotels/violet/3.jpg",
    ],

    cityImage: "/images/madinah.jpg/madinah.jpg"
  },

  {
    id: 3,
    date: "15 / 7 / 2026",
    hotelMakkah: "رمادا التيسير",
    hotelMadinah: "المركزية",
    room: "ثنائي",
    nights: "6 ليالي مكة - ليلتين المدينة",
   prices: {
  double: 255,
  triple: 230,
  quad: 215,
},
    meals: "بدون وجبات",

    image: "/images/hotels/ramada/main.png",

    makkahImages: [
      "/images/hotels/ramada/1.jpg",
      "/images/hotels/ramada/2.jpg",
      "/images/hotels/ramada/3.jpg",
    ],

    cityImage: "/images/madinah.jpg/madinah.jpg"
  },

  {
    id: 4,
    date: "22 / 7 / 2026",
    hotelMakkah: "تاج بارك",
    hotelMadinah: "المركزية",
    room: "رباعي",
    nights: "6 ليالي مكة - ليلتين المدينة",
  prices: {
  double: 280,
  triple: 240,
  quad: 220,

},
    meals: "إفطار مكة فقط",

    image: "/images/hotels/tajpark/main.png",

    makkahImages: [
      "/images/hotels/tajpark/1.jpg",
      "/images/hotels/tajpark/2.jpg",
      "/images/hotels/tajpark/3.jpg",
      "/images/hotels/tajpark/4.jpg",
    ],

    cityImage: "/images/madinah.jpg/madinah.jpg"
  },

  {
    id: 5,
    date: "22 / 7 / 2026",
    hotelMakkah: "الأيباء",
    hotelMadinah: "المركزية",
    room: "رباعي",
    nights: "6 ليالي مكة - ليلتين المدينة",
    prices: {
  double: 375,
  triple: 315,
  quad: 285,
},
    meals: "بدون وجبات",

    image: "/images/hotels/alebaa/main.png",

    makkahImages: [
      "/images/hotels/alebaa/1.jpg",
      "/images/hotels/alebaa/2.jpg",
      "/images/hotels/alebaa/3.jpg",
    ],

    cityImage: "/images/madinah.jpg/madinah.jpg"
  },

  {
    id: 6,
    date: "22 / 7 / 2026",
    hotelMakkah: "أنجم",
    hotelMadinah: "المركزية",
    room: "ثنائي",
    nights: "6 ليالي مكة - ليلتين المدينة",
    prices: {
  double: 470,
  triple: 400,
  quad: 380,
},
    meals: "إفطار مكة فقط",

    image: "/images/hotels/anjum/main.png",

    makkahImages: [
      "/images/hotels/anjum/1.jpg",
      "/images/hotels/anjum/2.jpg",
      "/images/hotels/anjum/3.jpg",
    ],

    cityImage: "/images/madinah.jpg/madinah.jpg"
  },
];
const trip = trips.find((t) => t.id === Number(id));
if (!trip) {
  return <h1>الفندق غير موجود</h1>;
}
return (
<main className="min-h-screen bg-[#F5EFD9] p-8">
<div className="mx-auto max-w-6xl rounded-3xl bg-[#F8F4EA] backdrop-blur-md p-8 shadow-2xl">
   <img
  src={trip.image}
  alt={trip.hotelMakkah}
  className="w-full h-[650px] rounded-3xl object-contain bg-[#F8F4EA]"
/>

  

<p className="mt-3 text-xl text-gray-600">
        📍 فندق مكه
      </p>
      <h1 className="mt-8 text-4xl font-bold">
        {trip.hotelMakkah} 
      </h1>


      <h2 className="mt-8 mb-5 text-2xl font-bold">
  أسعار الغرف
</h2>

<div className="space-y-4">

  <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
    <div>
      <h3 className="text-lg font-bold">🛏️ غرفة ثنائية</h3>
      <p className="text-2xl font-bold text-green-600">
        {trip.prices.double} د.أ
      </p>
    </div>

    <a
      href={`https://wa.me/962798337711?text=السلام عليكم، أرغب بحجز رحلة ${trip.hotelMakkah} (غرفة ثنائية) بسعر ${trip.prices.double} دينار.`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
    >
      احجز الآن
    </a>
  </div>

  <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
    <div>
      <h3 className="text-lg font-bold">🛏️ غرفة ثلاثية</h3>
      <p className="text-2xl font-bold text-green-600">
        {trip.prices.triple} د.أ
      </p>
    </div>

    <a
      href={`https://wa.me/962798337711?text=السلام عليكم، أرغب بحجز رحلة ${trip.hotelMakkah} (غرفة ثلاثية) بسعر ${trip.prices.triple} دينار.`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
    >
      احجز الآن
    </a>
  </div>

  <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
    <div>
      <h3 className="text-lg font-bold">🛏️ غرفة رباعية</h3>
      <p className="text-2xl font-bold text-green-600">
        {trip.prices.quad} د.أ
      </p>
    </div>

    <a
      href={`https://wa.me/962798337711?text=السلام عليكم، أرغب بحجز رحلة ${trip.hotelMakkah} (غرفة رباعية) بسعر ${trip.prices.quad} دينار.`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
    >
      احجز الآن
    </a>
  </div>

</div>
      <p className="mt-2">🌙 المدة: {trip.nights}</p>
      <p className="mt-2">🍽️ الوجبات: {trip.meals}</p>

      <h2 className="mt-10 mb-4 text-2xl font-bold">
  صور الفندق
</h2>

<Swiper
  modules={[Navigation, Pagination]}
  navigation
  pagination={{ clickable: true }}
  spaceBetween={20}
  slidesPerView={1}
>
  {trip.makkahImages.map((img, index) => (
    <SwiperSlide key={index}>
      <img
        src={img}
        className="w-full h-[500px] rounded-3xl object-cover"
      />
    </SwiperSlide>
  ))}
</Swiper>

      <h2 className="mt-12 mb-6 text-2xl font-bold">
  فندق المدينة
</h2>

<div className="flex items-center gap-6">
  <img
    src={trip.cityImage}
    alt="فندق المدينة"
    className="w-80 h-56 rounded-3xl object-cover"
  />

  <div>
    <h3 className="text-2xl font-bold">
      المركزية
    </h3>

    <p className="mt-2 text-gray-600">
      تبعد 300 متر عن الحرم النبوي
    </p>
  </div>
</div>

</div>
</main>
);
}