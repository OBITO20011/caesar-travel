import { createFileRoute } from "@tanstack/react-router";
  import { Helmet } from "react-helmet-async";
import { fallbackVisas } from "@/data/visas";
import { usePublicVisas } from "@/hooks/use-site-content";
import type { Visa } from "@/types/admin";

const visaFlags: Record<string, string> = {
  saudi: "🇸🇦",
  uae: "🇦🇪",
  qatar: "🇶🇦",
  syria: "🇸🇾",
  schengen: "🇪🇺",
  uk: "🇬🇧",
  usa: "🇺🇸",
};

const legacyVisaPaths = new Set(Object.keys(visaFlags));

function visaPrice(visa: Visa) {
  if (visa.price === undefined || visa.price === null) return "تواصل معنا لمعرفة السعر";

  return new Intl.NumberFormat("ar-JO", {
    style: "currency",
    currency: visa.currency || "JOD",
    maximumFractionDigits: 2,
  }).format(visa.price);
}
export const Route = createFileRoute("/visa")({
  component: VisaPage,
});

function VisaPage() {
  const visasQuery = usePublicVisas();
  const visas = visasQuery.isError || visasQuery.isPending ? fallbackVisas : visasQuery.data ?? [];

  return (
  <><Helmet>
      <title>رحلات التأشيرات السياحية | قصر للسياحة والسفر</title>
      <meta
        name="description"
        content="أفضل عروض السفر إلى مختلف الدول مع قصر للسياحة والسفر."
      />
      <meta
        name="keywords"
        content="التأشيرة، السياحة، السفر, قصر للسياحة"
      />
      <link
        rel="canonical"
        href="https://caesar-travel.pages.dev/visa"
      />
      <meta
        property="og:title"
        content="رحلات التأشيرات السياحية | قصر للسياحة"
      />
      <meta
        property="og:description"
        content="احجز أفضل عروض السفر إلى مختلف الدول مع قصر للسياحة والسفر."
      />
      <meta
        property="og:url"
        content="https://caesar-travel.pages.dev/visa"
      />
    </Helmet>
    <section
      className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/visaa-banner.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative z-10 text-center text-white max-w-3xl px-6">
        <span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold">
          خدمات التأشيرات
        </span>

        <h1 className="mt-6 text-5xl font-black">
          التأشيرات السياحية حول العالم
        </h1>

        <p className="mt-6 text-xl leading-9 text-white/90">
          نوفر خدمات إصدار التأشيرات السياحية والتجارية والعلاجية مع متابعة
          كاملة حتى استلام جواز السفر.
        </p>

        <a
  href="#available-visas"
  className="mt-10 inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:scale-105 transition"
>
  ابدأ طلب التأشيرة
</a>
      </div>
    </section>
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold">
              لماذا نحن؟
            </span>

            <h2 className="text-4xl font-black mt-3">
              لماذا تختار قيصر للسياحة والسفر؟
            </h2>

            <p className="mt-4 text-gray-600">
              نساعدك في استخراج التأشيرة بسرعة وسهولة مع متابعة كاملة حتى صدورها.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="rounded-3xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold text-xl">سرعة الإنجاز</h3>
              <p className="mt-2 text-gray-600">
                تقديم ومتابعة الطلب بأسرع وقت.
              </p>
            </div>

            <div className="rounded-3xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="font-bold text-xl">تجهيز الملف</h3>
              <p className="mt-2 text-gray-600">
                مراجعة جميع المستندات قبل التقديم.
              </p>
            </div>

            <div className="rounded-3xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-bold text-xl">جميع الدول</h3>
              <p className="mt-2 text-gray-600">
                تأشيرات سياحية وتجارية لمعظم دول العالم.
              </p>
            </div>

            <div className="rounded-3xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-bold text-xl">دعم كامل</h3>
              <p className="mt-2 text-gray-600">
                نتابع طلبك حتى استلام جواز السفر.
              </p>
            </div>

          </div>
        </div>
      </section>
      <section id="available-visas" className="py-20 bg-slate-100">
      <div className="mx-auto max-w-7xl px-6">

  <h2 className="text-center text-5xl font-black">
    التأشيرات المتوفرة
  </h2>

  <p className="mt-4 text-center text-gray-600">
    اختر الدولة التي ترغب باستخراج التأشيرة إليها
  </p>
<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  {visas.map((visa) => (
    <a
      key={visa.id}
      href={legacyVisaPaths.has(visa.slug) ? `/${visa.slug}` : `/visa/${visa.slug}`}
      className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition"
    >
      {visa.card_image_url ? (
        <img
          src={visa.card_image_url}
          alt={visa.country_name}
          className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
        />
      ) : null}
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold">
          {visaFlags[visa.slug] || "🛂"} {visa.country_name}
        </h3>
        <p className="mt-2 text-gray-600">{visa.summary}</p>
        <p className="mt-3 font-bold text-blue-700">{visaPrice(visa)}</p>
      </div>
    </a>
  ))}
</div>
</div>
</section>
      </>
  );
}
