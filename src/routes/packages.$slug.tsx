import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { PublicTripGrid } from "@/components/public-trip-grid";
import { getPackageDestination } from "@/data/package-destinations";

export const Route = createFileRoute("/packages/$slug")({
  component: PackageDestinationPage,
});

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="col-span-full mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#D4AF37]/35 bg-gradient-to-br from-[#171717] via-[#102d32] to-[#171717] p-1 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
      <div className="relative overflow-hidden rounded-[1.8rem] px-6 py-14 text-center sm:px-12">
        <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2 text-sm font-bold text-[#F3CF63]">
            <Sparkles className="h-4 w-4" />
            قريباً في قيصر للسياحة
          </span>

          <div className="mx-auto mt-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-[#F3CF63] shadow-inner">
            <CalendarClock className="h-10 w-10" />
          </div>

          <h2 className="mt-7 text-3xl font-black text-white sm:text-4xl">
            نحضّر لكم {title} بكل عناية
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            نعمل الآن على اختيار أجمل البرامج وأفضل الأسعار لنقدّم لكم تجربة سفر استثنائية تليق
            بتطلعاتكم. ستظهر الباقات هنا فور جاهزيتها، فترقّبوا الجديد قريباً.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-8 py-3 font-black text-[#101010] transition hover:-translate-y-1 hover:bg-[#F3CF63]"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function PackageDestinationPage() {
  const { slug } = Route.useParams();
  const destination = getPackageDestination(slug);

  if (!destination) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6 text-center">
        <div>
          <h1 className="text-3xl font-black text-[#15343A]">القسم غير موجود</h1>
          <Link to="/" className="mt-6 inline-block font-bold text-[#9B7617]">
            العودة للرئيسية
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{destination.title} | قيصر للسياحة والسفر</title>
        <meta name="description" content={destination.description} />
      </Helmet>

      <main className="min-h-screen bg-[#F5EFD9]">
        <section
          className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-cover bg-center px-6 text-center"
          style={{ backgroundImage: `url(${destination.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#092d3b]/75 to-[#092d3b]/90" />
          <div className="relative z-10 mx-auto max-w-4xl text-white">
            <span className="text-6xl drop-shadow-xl">{destination.icon}</span>
            <h1 className="mt-6 text-4xl font-black drop-shadow-xl sm:text-6xl">
              {destination.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              {destination.description}
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 text-center">
              <span className="font-bold text-[#9B7617]">باقات قيصر المختارة</span>
              <h2 className="mt-3 text-3xl font-black text-[#15343A] sm:text-4xl">
                البرامج والعروض المتاحة
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PublicTripGrid
                pageKey={destination.pageKey}
                fallbackImage={destination.image}
                emptyContent={<ComingSoon title={destination.title} />}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
