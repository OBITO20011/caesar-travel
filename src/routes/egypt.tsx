import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarRange,
  ChevronDown,
  Hotel,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import egyptDahab from "@/assets/egypt-dahab.png";
import egyptHero from "@/assets/egypt-bg.png";
import egyptKhaleg from "@/assets/egypt-khaleg.png";
import egyptMsmd from "@/assets/egypt-msmd.png";
import egyptNabg from "@/assets/egypt-nabg.png";
import egyptRas from "@/assets/egypt-ras.png";
import egyptSoha from "@/assets/egypt-soha.png";
import egyptTwran from "@/assets/egypt-twran.png";
import egyptWadi from "@/assets/egypt-wadi.png";
import { PublicTripGrid } from "@/components/public-trip-grid";

export const Route = createFileRoute("/egypt")({
  component: EgyptPage,
});

const attractions = [
  { title: "خليج نعمة", image: egyptKhaleg },
  { title: "خليج سوهو", image: egyptSoha },
  { title: "رأس محمد", image: egyptRas },
  { title: "جزيرة تيران", image: egyptTwran },
  { title: "محمية نبق", image: egyptNabg },
  { title: "دهب", image: egyptDahab },
  { title: "وادي الكونز", image: egyptWadi },
  { title: "رأس أم سيد", image: egyptMsmd },
];

function EgyptPage() {
  return (
    <>
      <Helmet>
        <title>رحلات شرم الشيخ والفنادق | قيصر للسياحة والسفر</title>
        <meta
          name="description"
          content="اختر من أفضل فنادق شرم الشيخ، شاهد الصور والتفاصيل، وقارن أسعار الإقامة من 4 إلى 7 أيام مع قيصر للسياحة والسفر."
        />
        <meta
          name="keywords"
          content="شرم الشيخ، مصر، رحلات مصر، فنادق شرم الشيخ، عروض شرم الشيخ، قيصر للسياحة"
        />
        <link rel="canonical" href="https://caesar-travel.pages.dev/egypt" />
        <meta property="og:title" content="فنادق ورحلات شرم الشيخ | قيصر للسياحة" />
        <meta
          property="og:description"
          content="فنادق 5 نجوم وخيارات إقامة متعددة وأسعار واضحة قبل الحجز."
        />
        <meta property="og:url" content="https://caesar-travel.pages.dev/egypt" />
      </Helmet>

      <main className="min-h-screen bg-[#071F29] text-white" dir="rtl">
        <section
          className="relative isolate flex min-h-[92dvh] items-end overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${egyptHero})` }}
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#04161d] via-[#071F29]/65 to-black/25" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_35%,rgba(212,175,55,0.2),transparent_35%)]" />

          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F3CF63]/45 bg-black/25 px-4 py-2 text-sm font-black text-[#F3CF63] backdrop-blur">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                إقامات مختارة في شرم الشيخ
              </span>
              <h1 className="mt-6 text-5xl font-black leading-[1.08] text-white drop-shadow-2xl sm:text-7xl lg:text-8xl">
                البحر أقرب،
                <span className="block text-[#F3CF63]">والرحلة أجمل.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl sm:leading-9">
                اختر فندقك، حدّد مدة الإقامة المناسبة، وشاهد السعر والصور والتفاصيل قبل أن تتواصل
                معنا للحجز.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#hotels"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 text-lg font-black text-[#102F3A] transition duration-200 hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                >
                  اكتشف الفنادق والأسعار
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="#destinations"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur transition duration-200 hover:bg-white hover:text-[#102F3A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3CF63]"
                >
                  معالم شرم الشيخ
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/20 bg-[#102F3A]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <p className="text-sm font-black text-[#F3CF63]">الباقة تشمل</p>
              <h2 className="mt-2 text-2xl font-black">رحلة مرتبة من الباب إلى البحر</h2>
              <div className="mt-6 space-y-4">
                <HeroFeature icon={Plane} text="طيران على متن الملكية الأردنية" />
                <HeroFeature icon={Hotel} text="فنادق مختارة بتصنيف 5 نجوم" />
                <HeroFeature icon={UtensilsCrossed} text="وجبات ومشروبات حسب نظام الفندق" />
                <HeroFeature icon={ShieldCheck} text="استقبال وتوديع ومتابعة من فريق قيصر" />
              </div>
            </aside>
          </div>
        </section>

        <section id="destinations" className="bg-[#F8F4EA] py-16 text-[#15343A] sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="font-black text-[#9B7617]">خارج الفندق</span>
              <h2 className="mt-2 text-4xl font-black sm:text-5xl">كل يوم مشهد جديد</h2>
              <p className="mt-4 text-lg leading-8 text-[#15343A]/70">
                البحر، المحميات، الأسواق والسهرات في أشهر وجهات شرم الشيخ.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
              {attractions.map((item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-3xl border border-[#15343A]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="p-3">
                    <p className="text-center text-sm font-black">{item.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="hotels" className="relative overflow-hidden bg-[#071F29] py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,175,55,0.12),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 font-black text-[#F3CF63]">
                  <CalendarRange className="h-5 w-5" aria-hidden="true" />
                  اختر الفندق ثم مدة الإقامة
                </span>
                <h2 className="mt-3 text-4xl font-black text-white sm:text-6xl">فنادق شرم الشيخ</h2>
                <p className="mt-4 text-lg leading-8 text-white/65">
                  افتح أي فندق لتشاهد الصور والمزايا، ثم اختر 4 أو 5 أو 6 أو 7 أيام ويظهر السعر
                  الصحيح مباشرة.
                </p>
              </div>
              <div className="rounded-3xl border border-[#D4AF37]/25 bg-white/5 px-5 py-4 text-sm leading-7 text-white/75 backdrop-blur">
                الأسعار للشخص في الغرفة الثنائية أو الثلاثية، والتأكيد النهائي يتم مع موظف الحجز.
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PublicTripGrid pageKey="egypt" fallbackImage={egyptHero} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function HeroFeature({ icon: Icon, text }: { icon: typeof Plane; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3CF63]/15 text-[#F3CF63]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-bold leading-7 text-white/85">{text}</span>
    </div>
  );
}
