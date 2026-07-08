import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
export const Route = createFileRoute("/turkey-trip")({
  component: VisaPage,
});

function VisaPage() {
  return (
  <><section
      className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/turkey-banner.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative z-10 text-center text-white max-w-3xl px-6">
        <span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold">
           أجمل البرامج السياحية إلى تركيا
        </span>

        <h1 className="mt-6 text-5xl font-black">
        رحلات تركيا
        </h1>

        <p className="mt-6 text-xl leading-9 text-white/90">
          استمتع بأجمل البرامج السياحية في تركيا مع قيصر للسياحة والسفر.
نوفر حجوزات الفنادق، الاستقبال من المطار، الجولات اليومية، والمواصلات بأسعار تنافسية وخدمة مميزة.

        </p>

        <a
  href="#available-visas"
  className="mt-10 inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:scale-105 transition"
>
احجز رحلتك الآن
</a>
      </div>
    </section>
    {/* ماذا تشمل رحلتك */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-14">
      <span className="text-blue-600 font-semibold">
        كل ما تحتاجه في رحلة واحدة
      </span>

      <h2 className="text-4xl font-bold text-gray-900 mt-3">
        ماذا تشمل رحلتك إلى تركيا؟
      </h2>

      <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
        نوفر لك تجربة سفر متكاملة تبدأ من لحظة وصولك وحتى انتهاء رحلتك بكل راحة واحترافية.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 transition">
        <div className="text-5xl mb-4">✈️</div>
        <h3 className="font-bold text-xl mb-2">استقبال من المطار</h3>
        <p className="text-gray-500">
          استقبال عند الوصول ونقل مريح إلى الفندق.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 transition">
        <div className="text-5xl mb-4">🏨</div>
        <h3 className="font-bold text-xl mb-2">إقامة مريحة</h3>
        <p className="text-gray-500">
          فنادق مختارة بعناية تناسب مختلف الميزانيات.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 transition">
        <div className="text-5xl mb-4">🚐</div>
        <h3 className="font-bold text-xl mb-2">مواصلات وجولات</h3>
        <p className="text-gray-500">
          تنقلات يومية وزيارات لأشهر المعالم السياحية.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 transition">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="font-bold text-xl mb-2">إفطار يومي</h3>
        <p className="text-gray-500">
          وجبة إفطار ضمن معظم البرامج السياحية.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 transition">
        <div className="text-5xl mb-4">🧑‍💼</div>
        <h3 className="font-bold text-xl mb-2">دعم طوال الرحلة</h3>
        <p className="text-gray-500">
          فريقنا معك قبل وأثناء وبعد الرحلة للإجابة عن جميع استفساراتك.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 transition">
        <div className="text-5xl mb-4">📸</div>
        <h3 className="font-bold text-xl mb-2">أفضل الوجهات</h3>
        <p className="text-gray-500">
          برامج تغطي أشهر المدن والمعالم السياحية في تركيا.
        </p>
      </div>

    </div>

  </div>
</section>
      {/* أشهر الوجهات في تركيا */}
<section id="available-visas" className="py-20 bg-gradient-to-b from-white to-slate-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-slate-800">
        أشهر الوجهات السياحية في تركيا
      </h2>
      <p className="text-slate-500 mt-3">
        اختر وجهتك واستمتع بأفضل البرامج السياحية
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
        <img src="/images/turkey-istanbil.png" className="w-full h-64 object-cover" />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold">إسطنبول</h3>
          <p className="text-gray-500 mt-2">مدينة التاريخ والبوسفور والأسواق.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
        <img src="/images/turkey-tarabzon.png" className="w-full h-64 object-cover" />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold">طرابزون</h3>
          <p className="text-gray-500 mt-2">الطبيعة الخضراء والجبال الساحرة.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
        <img src="/images/turkey-antalya.png" className="w-full h-64 object-cover" />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold">أنطاليا</h3>
          <p className="text-gray-500 mt-2">شواطئ فاخرة ومنتجعات عالمية.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
        <img src="/images/turkey-cappadocia.png" className="w-full h-64 object-cover" />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold">كابادوكيا</h3>
          <p className="text-gray-500 mt-2">رحلات المناطيد والمناظر الخيالية.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
        <img src="/images/turkey-bursa.png" className="w-full h-64 object-cover" />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold">بورصة</h3>
          <p className="text-gray-500 mt-2">الجبل الأخضر والطبيعة الخلابة.</p>
        </div>
      </div>
<div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg hover:shadow-2xl transition flex flex-col justify-center items-center text-center p-6">

  <div className="text-6xl mb-4">✈️</div>

  <h3 className="text-2xl font-bold text-white">
    احجز رحلتك الآن
  </h3>

  <p className="text-white/90 mt-3 leading-7">
    تواصل معنا للحصول على أفضل العروض
    والبرامج السياحية إلى تركيا.
  </p>

  <div className="flex gap-3 mt-8 w-full">

    <a
      href="https://wa.me/962798337711?text=مرحباً، أود الاستفسار عن رحلات تركيا."
      target="_blank"
      className="flex-1 bg-white text-green-700 py-3 rounded-xl font-bold text-center hover:bg-green-100 transition"
    >
      💬 واتساب
    </a>

    <a
      href="tel:+962798337711"
      className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold text-center hover:bg-yellow-300 transition"
    >
      📞 اتصال
    </a>

  </div>

</div>
    </div>
  </div>
</section>
      </>
  );
}