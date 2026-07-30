import type { ReactNode } from "react";

import { Seo } from "@/components/seo";
import { getFallbackVisa } from "@/data/visas";
import { usePublicVisa, useSiteSettings } from "@/hooks/use-site-content";
import { getBreadcrumbItems } from "@/lib/seo-config";
import { buildWhatsAppUrl, normalizeJordanPhoneNumber } from "@/lib/trip-format";
import { formatVisaPrice } from "@/lib/visa-utils";
import type { Visa } from "@/types/admin";

const legacyPaths = new Set(["saudi", "uae", "qatar", "syria", "schengen", "uk", "usa"]);

export function VisaCountryPage({
  slug,
  fallbackContent,
}: {
  slug: string;
  fallbackContent?: ReactNode;
}) {
  const fallback = getFallbackVisa(slug);
  const visaQuery = usePublicVisa(slug);
  const settingsQuery = useSiteSettings();

  if (visaQuery.isError && fallbackContent) {
    const detailPath = legacyPaths.has(slug) ? `/${slug}` : `/visa/${slug}`;
    return (
      <>
        {fallbackContent}
        {fallback ? (
          <Seo
            title={`${fallback.headline} | قيصر للسياحة والسفر`}
            description={fallback.description}
            path={detailPath}
            image={fallback.banner_image_url || fallback.card_image_url}
            breadcrumbs={getBreadcrumbItems(detailPath, fallback.headline, {
              name: "التأشيرات",
              path: "/visa",
            })}
          />
        ) : null}
      </>
    );
  }

  const visa = visaQuery.isError || visaQuery.isPending ? fallback : visaQuery.data;

  if (!visa) {
    return (
      <>
        <Seo
          title="التأشيرة غير متاحة | قيصر للسياحة والسفر"
          description="هذه التأشيرة غير متاحة حالياً. يمكنك استعراض خدمات التأشيرات الأخرى لدى قيصر للسياحة والسفر."
          path={`/visa/${slug}`}
          noIndex
        />
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6" dir="rtl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <h1 className="text-3xl font-black">هذه التأشيرة غير متاحة حالياً</h1>
            <p className="mt-3 text-slate-600">يمكنك العودة إلى صفحة التأشيرات واختيار دولة أخرى.</p>
            <a
              href="/visa"
              className="mt-6 inline-block rounded-full bg-yellow-400 px-8 py-3 font-bold text-black"
            >
              عرض التأشيرات
            </a>
          </div>
        </main>
      </>
    );
  }

  const settings = settingsQuery.data;
  const phoneDisplay = settings?.phone?.split(/[,،;\n]+/)[0]?.trim() || "0798 337 711";
  const phone = normalizeJordanPhoneNumber(phoneDisplay);
  const detailPath = legacyPaths.has(slug) ? `/${slug}` : `/visa/${slug}`;
  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsapp,
    `مرحباً، أود التقديم على ${visa.headline}.`,
  );

  return (
    <>
      <Seo
        title={`${visa.headline} | قيصر للسياحة والسفر`}
        description={visa.description}
        path={detailPath}
        image={visa.banner_image_url || visa.card_image_url}
        imageAlt={visa.headline}
        breadcrumbs={getBreadcrumbItems(detailPath, visa.headline, {
          name: "التأشيرات",
          path: "/visa",
        })}
      />

      <main>
      <section
        className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${visa.banner_image_url || visa.card_image_url || ""}')` }}
      >
        {visa.notice ? (
          <div className="absolute left-0 top-0 z-30 w-full bg-gradient-to-r from-green-600 to-emerald-500 py-3">
            <div className="mx-auto max-w-7xl px-4 text-center">
              <span className="text-sm font-bold text-white md:text-lg">{visa.notice}</span>
            </div>
          </div>
        ) : null}
        <div className="absolute inset-0 bg-black/55" />
        <div
          className={`relative z-10 max-w-3xl px-6 text-center text-white ${visa.notice ? "pt-20" : ""}`}
        >
          <span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold">
            خدمات التأشيرات
          </span>
          <h1 className="mt-6 text-5xl font-black">{visa.headline}</h1>
          <p className="mt-6 text-xl leading-9 text-white/90">{visa.description}</p>
          <a
            href="#requirements"
            className="mt-10 inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            ابدأ طلب التأشيرة
          </a>
        </div>
      </section>

      <section id="available-visas" className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-5xl font-black">انواع التأشيرات المتوفرة</h2>
          <p className="mt-4 text-center text-gray-600">
            اختر نوع التأشيرة التي ترغب بالتقديم عليها
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(visa.visa_types ?? []).map((type, index) => (
              <div
                key={`${type.title}-${index}`}
                className="rounded-3xl bg-white p-8 text-center shadow-lg transition hover:shadow-2xl"
              >
                <div className="mb-4 text-6xl">{type.icon}</div>
                <h3 className="text-2xl font-bold">{type.title}</h3>
                <p className="mt-3 text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="requirements" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-5xl font-black">متطلبات {visa.headline}</h2>
            <p className="mt-4 text-gray-600">تأكد من تجهيز المستندات التالية قبل تقديم الطلب.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold">📄 المستندات المطلوبة</h3>
              <ul className="space-y-4 text-lg">
                {(visa.requirements ?? []).map((requirement, index) => (
                  <li key={`${requirement}-${index}`}>✅ {requirement}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
              <h3 className="mb-6 text-2xl font-bold">معلومات التأشيرة</h3>
              <div className="space-y-4 text-lg">
                <p>
                  💰 السعر: {formatVisaPrice(visa.price, visa.currency, "تواصل معنا لمعرفة السعر")}
                </p>
                <p>⏱ مدة الإنجاز: {visa.processing_time}</p>
                <p>📅 صلاحية التأشيرة: {visa.validity}</p>
                <p>🌍 {visa.availability}</p>
                <p>📞 متابعة كاملة حتى إصدار التأشيرة</p>
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:scale-105"
                >
                  💬 التقديم عبر واتساب
                </a>
                <a
                  href={`tel:+${phone}`}
                  className="rounded-full border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-black"
                >
                  📞 اتصل الآن
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
