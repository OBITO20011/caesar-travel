import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
  import { Helmet } from "react-helmet-async";
export const Route = createFileRoute("/syria")({
  component: VisaPage,
});

function VisaPage() {
  return (
    
  <><Helmet>
      <title>رحلات سوريا | قصر للسياحة والسفر</title>
      <meta
        name="description"
        content="أفضل عروض السفر إلى سوريا مع قصر للسياحة والسفر."
      />
      <meta
        name="keywords"
        content="سوريا, السياحة, السفر, قصر للسياحة"
      />
      <link
        rel="canonical"
        href="https://caesar-travel.pages.dev/syria"
      />
      <meta
        property="og:title"
        content="رحلات سوريا | قصر للسياحة"
      />
      <meta
        property="og:description"
        content="احجز أفضل عروض السفر إلى سوريا مع قصر للسياحة والسفر."
      />
      <meta
        property="og:url"
        content="https://caesar-travel.pages.dev/syria"
      />
    </Helmet>
    <section
  
     
  className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/syria-banner.png')",
  }}
>

  {/* الشريط الأخضر */}
  <div className="absolute top-0 left-0 w-full z-30 bg-gradient-to-r from-green-600 to-emerald-500 py-3">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <span className="text-white font-bold text-sm md:text-lg">
         بشرى للسوريين — أصبح بإمكان المواطنين السوريين التقديم على التأشيرة السياحية للمملكة العربية السعودية.
      </span>
    </div>
  </div>

  <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative z-10 text-center text-white max-w-3xl px-6 pt-20">
        <span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold">
          خدمات التأشيرات
        </span>

        <h1 className="mt-6 text-5xl font-black">
  تأشيرة  سوريا
</h1>

        <p className="mt-6 text-xl leading-9 text-white/90">
         نوفر إصدار تأشيرات سوريا السياحية والزيارة والأعمال بسرعة
وسهولة مع متابعة كاملة حتى صدور التأشيرة.
        </p>

        <a
  href="#requirements"
  className="mt-10 inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:scale-105 transition"
>
  ابدأ طلب التأشيرة
</a>
       </div>
        </section>

    <section id="available-visas" className="py-20 bg-slate-100">
      <div className="mx-auto max-w-7xl px-6">

  <h2 className="text-center text-5xl font-black">
    انواع التأشيرات المتوفرة
  </h2>

  <p className="mt-4 text-center text-gray-600">
   اختر نوع التأشيرة التي  ترغب بالتقديم  عليها
  </p>
<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
<div className="rounded-3xl bg-white shadow-lg p-8 text-center hover:shadow-2xl transition">
  <div className="text-6xl mb-4">🕌</div>
  <h3 className="text-2xl font-bold">تأشيرة سوريا</h3>
  <p className="mt-3 text-gray-600">
    إصدار تأشيرات سوريا بسرعة مع متابعة كاملة حتى صدورها.
  </p>
</div>

<div className="rounded-3xl bg-white shadow-lg p-8 text-center hover:shadow-2xl transition">
  <div className="text-6xl mb-4">🧳</div>
  <h3 className="text-2xl font-bold">التأشيرة السياحية</h3>
  <p className="mt-3 text-gray-600">
    تأشيرات سياحية متعددة أو مفردة حسب المتطلبات.
  </p>
</div>

<div className="rounded-3xl bg-white shadow-lg p-8 text-center hover:shadow-2xl transition">
  <div className="text-6xl mb-4">👨‍👩‍👧</div>
  <h3 className="text-2xl font-bold">تأشيرة الزيارة</h3>
  <p className="mt-3 text-gray-600">
    زيارة عائلية أو شخصية مع تجهيز كامل للملف.
  </p>
</div>

<div className="rounded-3xl bg-white shadow-lg p-8 text-center hover:shadow-2xl transition">
  <div className="text-6xl mb-4">💼</div>
  <h3 className="text-2xl font-bold">تأشيرة الأعمال</h3>
  <p className="mt-3 text-gray-600">
    إصدار تأشيرات رجال الأعمال والشركات.
  </p>
</div>

<div className="rounded-3xl bg-white shadow-lg p-8 text-center hover:shadow-2xl transition">
  <div className="text-6xl mb-4">✈️</div>
  <h3 className="text-2xl font-bold">ترانزيت</h3>
  <p className="mt-3 text-gray-600">
    تأشيرة عبور للمسافرين عبر سوريا.
  </p>
</div>

<div className="rounded-3xl bg-white shadow-lg p-8 text-center hover:shadow-2xl transition">
  <div className="text-6xl mb-4">📋</div>
  <h3 className="text-2xl font-bold">استشارة مجانية</h3>
  <p className="mt-3 text-gray-600">
    تواصل معنا لمعرفة أفضل نوع تأشيرة يناسبك.
  </p>
</div>
  
</div>
</div>
</section>
    
    <section id="requirements" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-14">
      <h2 className="text-5xl font-black">
        متطلبات تأشيرة سوريا
      </h2>

      <p className="mt-4 text-gray-600">
        تأكد من تجهيز المستندات التالية قبل تقديم الطلب.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">

      <div className="rounded-3xl bg-slate-50 p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-6">
          📄 المستندات المطلوبة
        </h3>

        <ul className="space-y-4 text-lg">
          <li>✅ جواز سفر ساري لمدة 6 أشهر.</li>
          <li>✅ صورة شخصية بخلفية بيضاء.</li>
          <li>✅ تعبئة نموذج الطلب.</li>
          <li>✅ حجز فندقي (عند الحاجة).</li>
          <li>✅ حجز طيران مبدئي.</li>
        </ul>
      </div>

      <div className="rounded-3xl bg-blue-600 text-white p-8 shadow-xl">

        <h3 className="text-2xl font-bold mb-6">
          معلومات التأشيرة
        </h3>

        <div className="space-y-4 text-lg">
          <p>⏱ مدة الإنجاز: 1 - 3 أيام عمل</p>
          <p>📅 صلاحية التأشيرة حسب النوع</p>
          <p>🌍 متاحة لمعظم الجنسيات</p>
          <p>📞 متابعة كاملة حتى إصدار التأشيرة</p>
        </div>

       <div className="mt-10 flex flex-wrap justify-center gap-4">

  <a
    href="https://wa.me/962798337711?text=مرحباً، أود التقديم على تأشيرة سوريا."
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:scale-105 transition"
  >
    💬 التقديم عبر واتساب
  </a>

  <a
    href="tel:+962798337711"
    className="rounded-full border-2 border-white px-8 py-4 font-bold text-white hover:bg-white hover:text-black transition"
  >
    📞 اتصل الآن
  </a>

</div>

      </div>

    </div>
  </div>
</section>
      </>
  );
}