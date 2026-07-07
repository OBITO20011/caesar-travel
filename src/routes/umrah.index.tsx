import { createFileRoute, Link } from "@tanstack/react-router";

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
    <main className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto max-w-6xl px-4">

        <h1 className="mb-2 text-center text-4xl font-bold text-blue-900">
          رحلات العمرة
        </h1>

        <p className="mb-10 text-center text-gray-600">
          اختر الرحلة المناسبة لك واحجز الآن
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {trips.map((trip) => (

    <Link
  key={trip.id}
  to="/umrah/$id"
  params={{ id: trip.id.toString() }}
>
  
  <div className="cursor-pointer rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">

  <img
    src={trip.image}
    alt={trip.hotelMakkah}
    className="mb-4 h-56 w-full rounded-2xl object-cover"
  />

  <h2 className="mb-4 text-2xl font-bold text-blue-800">
    رحلة {trip.date}
  </h2>

              <div className="space-y-2">

                <p>
                  🏨 <b>فندق مكة:</b> {trip.hotelMakkah}
                </p>

                <p>
                  🕌 <b>فندق المدينة:</b> {trip.hotelMadinah}
                </p>

                <p>
                  🛏️ <b>الغرفة:</b> {trip.room}
                </p>

                <p>
                  🌙 <b>المدة:</b> {trip.nights}
                </p>

                <p>
                  🍽️ <b>الوجبات:</b> {trip.meals}
                </p>

              </div>

              <div className="mt-6 flex items-center justify-between">

                <span className="text-3xl font-bold text-green-600">
                  {trip.price} د.أ
                </span>

                <button className="rounded-xl bg-blue-800 px-5 py-2 text-white hover:bg-blue-900">
                  احجز الآن
                </button>

              </div>

           </div>
</Link>

))}

        </div>

      </div>
    </main>
  );
}