import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
export const Route = createFileRoute("/hajj")({
  component: HajjPage,
});

function HajjPage() {
  return (
    <main
  className="min-h-screen bg-cover bg-center bg-no-repeat py-16"
  style={{
    backgroundImage: "url('/images/hajj-banner.jpg')",
  }}
>
      <div className="mx-auto max-w-6xl px-6 py-16">

        

        <motion.div
  initial={{ opacity: 0, y: 40, scale: 0.96 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="rounded-3xl bg-white/35 backdrop-blur-md p-10 shadow-2xl border border-white/30"
>

          <span className="rounded-full bg-green-600 px-5 py-2 text-white font-bold">
            التسجيل مفتوح الآن
          </span>

          <h1 className="mt-6 flex items-center justify-center gap-3 text-5xl font-bold text-blue-900">
  🕋
  <span>الحج 1448 هـ / 2027 م</span>
</h1>

          <p className="mt-6 text-xl leading-9 text-gray-700">
            يسر شركة قيصر للسياحة والسفر الإعلان عن فتح باب التسجيل لموسم الحج
            لعام <b>1448 هـ / 2027 م</b>.
          </p>

          <div className="mt-10 rounded-2xl bg-slate-50 p-6">

            <h2 className="mb-4 text-2xl font-bold">
              📅 موعد الحج المتوقع
            </h2>

            <p className="text-lg">
              بداية الحج:
              <b> الجمعة 14 مايو 2027 </b>
            </p>

            <p className="mt-2 text-lg">
              نهاية المناسك:
              <b> الأربعاء 19 مايو 2027 </b>
            </p>

          </div>

          <a
            href="https://wa.me/962798337711?text=السلام عليكم، أرغب بالتسجيل لموسم الحج 1448 هـ / 2027 م."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-2xl bg-green-600 px-8 py-4 text-xl font-bold text-white hover:bg-green-700"
          >
            سجل الآن عبر واتساب
          </a>

        </motion.div>

      </div>
    </main>
  );
}