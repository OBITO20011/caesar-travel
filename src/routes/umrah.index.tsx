import { createFileRoute, Link } from "@tanstack/react-router";
import umrahBg from "@/assets/umrah-bg.png";
export const Route = createFileRoute("/umrah/")({
  component: UmrahPage,
});

function UmrahPage() {
  const trips = [
  {
    id: 1,
    date: "1 / 7 / 2026",
    hotelMakkah: "فجر البديع 6",
    hotelMadinah: "المركزية",
    
    nights: "6 ليالي مكة - ليلتين المدينة",
    price:"اضغط هنا لمعرفه الاسعار",
    meals: "بدون وجبات",

    image: "/images/hotels/fajr/main.png",

    makkahImages: [
      "/images/hotels/fajr/1.jpg",
      "/images/hotels/fajr/2.jpg",
      "/images/hotels/fajr/3.jpg",
      
    ],

    cityImage: "/images/madinah.jpg",
  },

  {
    id: 2,
    date: "8 / 7 / 2026",
    hotelMakkah: "فيوليت 2",
    hotelMadinah: "المركزية",
    
    nights: "6 ليالي مكة - ليلتين المدينة",
    price:"اضغط هنا لمعرفه الاسعار",
    meals: "بدون وجبات",

    image: "/images/hotels/violet/main.png",

    makkahImages: [
      "/images/hotels/violet/1.jpg",
      "/images/hotels/violet/2.jpg",
      "/images/hotels/violet/3.jpg",
    ],

    cityImage: "/images/madinah.jpg",
  },

  {
    id: 3,
    date: "15 / 7 / 2026",
    hotelMakkah: "رمادا التيسير",
    hotelMadinah: "المركزية",
    
    nights: "6 ليالي مكة - ليلتين المدينة",
    price:"اضغط هنا لمعرفه الاسعار",
    meals: "بدون وجبات",

    image: "/images/hotels/ramada/main.png",

    makkahImages: [
      "/images/hotels/ramada/1.jpg",
      "/images/hotels/ramada/2.jpg",
      "/images/hotels/ramada/3.jpg",
    ],

    cityImage: "/images/madinah.jpg",
  },

  {
    id: 4,
    date: "22 / 7 / 2026",
    hotelMakkah: "تاج بارك",
    hotelMadinah: "المركزية",
    
    nights: "6 ليالي مكة - ليلتين المدينة",
    price:"اضغط هنا لمعرفه الاسعار",
    meals: "إفطار مكة فقط",

    image: "/images/hotels/tajpark/main.png",

    makkahImages: [
      "/images/hotels/tajpark/1.jpg",
      "/images/hotels/tajpark/2.jpg",
      "/images/hotels/tajpark/3.jpg",
      "/images/hotels/tajpark/4.jpg",
    ],

    cityImage: "/images/madinah.jpg",
  },

  {
    id: 5,
    date: "22 / 7 / 2026",
    hotelMakkah: "الأيباء",
    hotelMadinah: "المركزية",
    
    nights: "6 ليالي مكة - ليلتين المدينة",
    price:"اضغط هنا لمعرفه الاسعار",
    meals: "بدون وجبات",

    image: "/images/hotels/alebaa/main.png",

    makkahImages: [
      "/images/hotels/alebaa/1.jpg",
      "/images/hotels/alebaa/2.jpg",
      "/images/hotels/alebaa/3.jpg",
    ],

    cityImage: "/images/madinah.jpg",
  },

  {
    id: 6,
    date: "22 / 7 / 2026",
    hotelMakkah: "أنجم",
    hotelMadinah: "المركزية",
    room: "ثنائي",
    nights: "6 ليالي مكة - ليلتين المدينة",
    price:"اضغط هنا لمعرفه الاسعار",
    meals: "إفطار مكة فقط",

    image: "/images/hotels/anjum/main.png",

    makkahImages: [
      "/images/hotels/anjum/1.jpg",
      "/images/hotels/anjum/2.jpg",
      "/images/hotels/anjum/3.jpg",
    ],

    cityImage: "/images/madinah.jpg",
  },
];

    return (
  <div
  className="min-h-screen bg-cover bg-center bg-fixed relative before:absolute before:inset-0 before:bg-black/60 before:z-0"
    style={{ backgroundImage: `url(${umrahBg})` }}
  >
<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#1A1207]/90"></div><div className="relative z-10 mx-auto max-w-7xl px-8 py-16">
        <h1 className="mb-2 text-center text-4xl font-bold text-[#E7C56D] drop-shadow-lg">
          رحلات العمرة
        </h1>

        <h1 className="mb-2 text-center text-4xl font-bold text-[#E7C56D] drop-shadow-lg">
          اختر الرحلة المناسبة لك واحجز الآن
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {trips.map((trip) => (

    <Link
  key={trip.id}
  to="/umrah/$id"
  params={{ id: trip.id.toString() }}
>
  
  <div  className="cursor-pointer rounded-3xl bg-[#1C1B1A]/70 backdrop-blur-xl border border-[#D4AF37]/25 p-6 shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]
">

  <img
    src={trip.image}
    alt={trip.hotelMakkah}
    className="mb-4 h-56 w-full rounded-2xl object-cover"
  />

  <h2 className="mb-4 text-2xl font-bold text-[#8B6B00]">
    رحلة {trip.date}
  </h2>

              <div className="space-y-2">

            <p className="text-[#F8E4A1]">
  🏨 <b>فندق مكة:</b> {trip.hotelMakkah}
</p>
                <p className="text-[#F8E4A1]">
                  🕌 <b>فندق المدينة:</b> {trip.hotelMadinah}
                </p>

                <p className="text-[#F8E4A1]">
                  🛏️ <b>الغرفة:</b> {trip.room}
                </p>

                <p className="text-[#F8E4A1]">
                  🌙 <b>المدة:</b> {trip.nights}
                </p>

                <p className="text-[#F8E4A1]">
                  🍽️ <b>الوجبات:</b> {trip.meals}
                </p>

              </div>

              <div className="mt-6 flex items-center justify-between">

                <span className="text-3xl font-bold text-[#B8860B]">
                  {trip.price} د.أ
                </span>

                <button className="rounded-xl bg-[#C9A227] px-5 py-2 text-white font-bold transition-all duration-300 hover:bg-[#B8860B] hover:scale-105 hover:shadow-[0_10px_25px_rgba(212,175,55,0.5)] active:scale-95">
                  احجز الآن
                </button>

              </div>

           </div>
</Link>

))}

        </div>

      </div>
          </div>

  );
}