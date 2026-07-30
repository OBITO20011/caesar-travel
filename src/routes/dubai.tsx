import { createFileRoute } from "@tanstack/react-router";
import dubaiHero from "@/assets/dubai-gb.jpg";
import burjArab from "@/assets/burj-al-arab.jpg";
import dubaiAlamia from "@/assets/dubai-alalmia.jpg";
import dubaiBurj from "@/assets/dubai-burj.jpg";
import dubaiKhor from "@/assets/dubai-khor.jpg";
import dubaiMall from "@/assets/dubai-mall.jpg";
import dubaiMostgbal from "@/assets/dubai-mostgbal.jpg";
import dubaiNaklah from "@/assets/dubai-naklah.jpg";
import dubaiSahra from "@/assets/dubai-sahra.jpg";
import { PublicTripGrid } from "@/components/public-trip-grid";
import { Seo } from "@/components/seo";
import { getStaticSeoPage } from "@/lib/seo-config";
export const Route = createFileRoute("/dubai")({
  component: DubaiPage,
});
const pageSeo = getStaticSeoPage("/dubai")!;
const attractions = [
  { title: "برج العرب", image: burjArab },
  { title: "القرية العالمية", image: dubaiAlamia },
  { title: "برج خليفة", image: dubaiBurj },
  { title: "خور دبي", image: dubaiKhor },
  { title: "دبي مول", image: dubaiMall },
  { title: "متحف المستقبل", image: dubaiMostgbal },
  { title: "نخلة جميرا", image: dubaiNaklah },
  { title: "الصحراء والسفاري", image: dubaiSahra },
];

function DubaiPage() {
  return (
    <>
      <Seo {...pageSeo} />

      <main className="bg-[#0B0B0B] text-white">
        {/* Hero */}
        <section
          className="relative h-[90vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${dubaiHero})` }}
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
                  <span className="text-[#D4AF37]">سحر دبي</span>
                </h1>

                <p className="mt-6 text-gray-300 leading-8 text-lg">
                  استمتع بأفضل عروض السفر إلى دبي مع الفنادق الفاخرة، والجولات السياحية، والمواصلات،
                  والأسعار المميزة.
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
              أشهر الوجهات في دبي
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
                    title={item.title}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
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
              أفضل الرحلات في دبي
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PublicTripGrid pageKey="dubai" fallbackImage={dubaiHero} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
