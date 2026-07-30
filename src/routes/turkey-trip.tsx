import { createFileRoute } from "@tanstack/react-router";
import {
  Bus,
  Camera,
  Headphones,
  Hotel,
  MapPin,
  PlaneLanding,
  UtensilsCrossed,
} from "lucide-react";

import { PublicTripGrid } from "@/components/public-trip-grid";
import { Seo } from "@/components/seo";
import { getStaticSeoPage } from "@/lib/seo-config";

export const Route = createFileRoute("/turkey-trip")({
  component: TurkeyTripsPage,
});

const pageSeo = getStaticSeoPage("/turkey-trip")!;

const services = [
  {
    icon: PlaneLanding,
    title: "استقبال من المطار",
    description: "استقبال عند الوصول ونقل مريح وآمن إلى الفندق.",
  },
  {
    icon: Hotel,
    title: "إقامة مريحة",
    description: "فنادق مختارة بعناية تناسب مختلف الميزانيات.",
  },
  {
    icon: Bus,
    title: "مواصلات وجولات",
    description: "تنقلات يومية وزيارات منظمة لأشهر المعالم السياحية.",
  },
  {
    icon: UtensilsCrossed,
    title: "خيارات وجبات",
    description: "برامج متنوعة تتضمن الإفطار أو الوجبات حسب كل باقة.",
  },
  {
    icon: Headphones,
    title: "متابعة متواصلة",
    description: "فريق قيصر معك قبل الرحلة وأثناءها وحتى عودتك.",
  },
  {
    icon: Camera,
    title: "أفضل الوجهات",
    description: "برامج تغطي أشهر المدن والمعالم السياحية في تركيا.",
  },
] as const;

const destinations = [
  {
    title: "إسطنبول",
    description: "مدينة التاريخ والبوسفور والأسواق.",
    image: "/images/turkey-istanbil.png",
  },
  {
    title: "طرابزون",
    description: "الطبيعة الخضراء والجبال الساحرة.",
    image: "/images/turkey-tarabzon.png",
  },
  {
    title: "أنطاليا",
    description: "شواطئ فاخرة ومنتجعات عالمية.",
    image: "/images/turkey-antalya.png",
  },
  {
    title: "كابادوكيا",
    description: "رحلات المناطيد والمناظر الخيالية.",
    image: "/images/turkey-cappadocia.png",
  },
  {
    title: "بورصة",
    description: "الجبل الأخضر والطبيعة الخلابة.",
    image: "/images/turkey-bursa.png",
  },
] as const;

function TurkeyTripsPage() {
  return (
    <>
      <Seo {...pageSeo} />

      <main className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
        <section
          className="relative flex min-h-[72vh] items-center justify-center overflow-hidden bg-cover bg-center px-5 py-28 text-center"
          style={{ backgroundImage: "url('/images/turkey-banner.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-[#071f29]/90" />
          <div className="relative z-10 mx-auto max-w-4xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F3CF63]/45 bg-black/25 px-5 py-2 text-sm font-bold text-[#F3CF63] backdrop-blur">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              أجمل البرامج السياحية إلى تركيا
            </span>
            <h1 className="mt-7 text-5xl font-black leading-tight drop-shadow-xl sm:text-7xl">
              فنادق وباقات <span className="text-[#F3CF63]">تركيا</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/85 sm:text-xl">
              حجوزات فنادق، استقبال من المطار، جولات يومية ومواصلات ضمن برامج مختارة بعناية وبأسعار
              واضحة.
            </p>
            <a
              href="#turkey-packages"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-[#D4AF37] px-9 py-3 font-black text-[#102F3A] shadow-xl transition duration-200 hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            >
              شاهد الفنادق والباقات
            </a>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
              <span className="font-bold text-[#9B7617]">كل ما تحتاجه في رحلة واحدة</span>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">خدمة متكاملة من قيصر</h2>
              <p className="mt-4 leading-8 text-slate-600">
                تفاصيل كل برنامج تظهر بوضوح، ويمكنك الدخول إلى صفحة الفندق ومشاهدة الصور والأسعار
                والمقاعد المتبقية قبل التواصل للحجز.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-6">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm transition duration-200 hover:border-[#D4AF37]/60 hover:shadow-lg sm:rounded-3xl sm:p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123C49] text-[#F3CF63] sm:h-10 sm:w-10 sm:rounded-2xl">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-2 text-[13px] font-black leading-5 sm:mt-3 sm:text-base sm:leading-6">
                      {service.title}
                    </h3>
                    <p className="mt-1 hidden text-xs leading-5 text-slate-600 sm:block sm:text-sm sm:leading-6">
                      {service.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="turkey-packages" className="scroll-mt-24 bg-[#0B0B0B] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="font-bold text-[#F3CF63]">محدّثة من لوحة الإدارة</span>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">فنادق وباقات تركيا المتاحة</h2>
              <p className="mt-4 leading-8 text-white/70">
                اختر الفندق أو الباقة لعرض الصور والموقع والأسعار والتواريخ وجميع التفاصيل.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PublicTripGrid
                pageKey="turkey"
                fallbackImage="/images/turkey-banner.png"
                emptyContent={
                  <div className="col-span-full rounded-3xl border border-[#D4AF37]/30 bg-white/5 px-6 py-12 text-center">
                    <Hotel className="mx-auto h-10 w-10 text-[#F3CF63]" aria-hidden="true" />
                    <h3 className="mt-5 text-2xl font-black">الفنادق الجديدة قيد التجهيز</h3>
                    <p className="mt-3 text-white/65">
                      ستظهر هنا مباشرة فور إضافتها من لوحة الإدارة.
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 text-center">
              <span className="font-bold text-[#9B7617]">وجهات متنوعة</span>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">أشهر المدن السياحية</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {destinations.map((destination) => (
                <article
                  key={destination.title}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm"
                >
                  <img
                    src={destination.image}
                    alt={destination.title}
                    title={destination.title}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-black">{destination.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {destination.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
