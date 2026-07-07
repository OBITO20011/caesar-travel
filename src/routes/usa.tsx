import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
export const Route = createFileRoute("/usa")({
  component: VisaPage,
});

function VisaPage() {
  return (
  <><section
      className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/visa-banner.png')",
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

        <button className="mt-10 rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:scale-105 transition">
          ابدأ طلب التأشيرة
        </button>
      </div>
    </section><section className="py-20 bg-white">
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
      <section className="py-20 bg-slate-100">
      <div className="mx-auto max-w-7xl px-6">

  <h2 className="text-center text-5xl font-black">
    التأشيرات المتوفرة
  </h2>

  <p className="mt-4 text-center text-gray-600">
    اختر الدولة التي ترغب باستخراج التأشيرة إليها
  </p>
<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

  <Link to="/saudi" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-saudi.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇸🇦 السعودية</h3>
      <p className="mt-2 text-gray-600">تأشيرات سياحية وزيارة وأعمال</p>
    </div>
  </Link>

  <Link to="/uae" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-uae.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇦🇪 الإمارات</h3>
      <p className="mt-2 text-gray-600">تأشيرات سياحية وتجارية</p>
    </div>
  </Link>

  <Link to="/qatar" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-qatar.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇶🇦 قطر</h3>
      <p className="mt-2 text-gray-600">تأشيرات سياحية وزيارة</p>
    </div>
  </Link>

  <Link to="/turkey" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-turkey.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇹🇷 تركيا</h3>
      <p className="mt-2 text-gray-600">تأشيرات سياحية</p>
    </div>
  </Link>

  <Link to="/schengen" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-schengen.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇪🇺 شنغن</h3>
      <p className="mt-2 text-gray-600">دول الاتحاد الأوروبي</p>
    </div>
  </Link>

  <Link to="/uk" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-uk.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇬🇧 بريطانيا</h3>
      <p className="mt-2 text-gray-600">تأشيرات زيارة وسياحة</p>
    </div>
  </Link>

  <Link to="/usa" className="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition">
    <img src="/images/visa-usa.jpg" className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
    <div className="p-6 text-center">
      <h3 className="text-2xl font-bold">🇺🇸 أمريكا</h3>
      <p className="mt-2 text-gray-600">تأشيرات سياحية وأعمال</p>
    </div>
  </Link>

</div>
</div>
</section>
      </>
  );
}