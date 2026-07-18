import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import egyptHero from "@/assets/egypt-bg.png";
import egyptKhaleg from "@/assets/egypt-khaleg.png";
import egyptSoha from "@/assets/egypt-soha.png";
import egyptRas from "@/assets/egypt-ras.png";
import egyptTwran from "@/assets/egypt-twran.png";
import egyptNabg from "@/assets/egypt-nabg.png";
import egyptDahab from "@/assets/egypt-dahab.png";
import egyptWadi from "@/assets/egypt-wadi.png";
import egyptMsmd from "@/assets/egypt-msmd.png";
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
        <title>رحلات شرم الشيخ والغردقة | قيصر للسياحة والسفر</title>

        <meta
          name="description"
          content="احجز أفضل عروض السفر إلى شرم الشيخ والغردقة مع قيصر للسياحة والسفر. فنادق فاخرة، برامج سياحية، وأسعار مميزة."
        />

        <meta
          name="keywords"
          content="شرم الشيخ، الغردقة، مصر، رحلات مصر، فنادق شرم الشيخ، قيصر للسياحة"
        />

        <link rel="canonical" href="https://caesar-travel.pages.dev/egypt" />

        <meta property="og:title" content="رحلات شرم الشيخ | قيصر للسياحة" />

        <meta property="og:description" content="أفضل عروض السفر إلى مصر مع قيصر للسياحة والسفر." />

        <meta property="og:url" content="https://caesar-travel.pages.dev/egypt" />
      </Helmet>
      <main className="bg-[#0B0B0B] text-white">
        {/* Hero */}
        <section
          className="relative h-[90vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${egyptHero})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/70"></div>

          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-7xl px-8 w-full">
              <div className="max-w-xl">
                <p className="mb-3 text-[#D4AF37] font-bold">✨ رحلات سياحية مميزة</p>

                <h1 className="text-6xl font-extrabold leading-tight">
                  اكتشف
                  <br />
                  <span className="text-[#D4AF37]">شرم الشيخ</span>
                </h1>

                <p className="mt-6 text-gray-300 leading-8 text-lg">
                  استمتع بأفضل عروض السفر إلى شرم الشيخ مع الفنادق الفاخرة， والجولات السياحية،
                  والمواصلات، والأسعار المميزة.
                </p>

                <button
                  onClick={() => {
                    document.getElementById("trips")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="rounded-full bg-[#E6C34A] px-10 py-4 text-lg font-bold text-black transition hover:scale-105"
                >
                  احجز رحلتك الآن
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#0B0B0B] py-10">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-6 text-center text-2xl font-bold text-[#D4AF37]">
              أشهر الوجهات في شرم الشيخ
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
              {attractions.map((item) => (
                <div
                  key={item.title}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#171717] transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-24 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="p-2">
                    <p className="text-center text-sm font-bold text-[#F4D27A]">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="trips" className="bg-[#0B0B0B] py-16">
          <div className="mx-auto max-w-7xl px-8">
            <h2 className="mb-10 text-center text-4xl font-bold text-[#D4AF37]">
              أفضل الرحلات في شرم الشيخ
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PublicTripGrid pageKey="egypt" fallbackImage={egyptHero} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
