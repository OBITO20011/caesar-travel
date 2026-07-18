import { createFileRoute, Link } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { packageDestinations } from "@/data/package-destinations";

export const Route = createFileRoute("/admin/packages/")({
  component: withAdminAuth(PackageSectionsPage),
});

function PackageSectionsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
            إدارة المحتوى
          </span>
          <h1 className="mt-5 text-3xl font-black text-slate-950 sm:text-4xl">
            باقات الأقسام الإضافية
          </h1>
          <p className="mt-3 text-slate-500">
            اختر القسم لإضافة الباقات أو تعديلها أو حذفها. إذا لم توجد باقات ستظهر رسالة «قريباً»
            تلقائياً للزائر.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packageDestinations.map((destination) => (
            <Link
              key={destination.slug}
              to="/admin/packages/$slug"
              params={{ slug: destination.slug }}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={destination.image}
                alt={destination.adminTitle}
                className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-black text-slate-900">
                  {destination.icon} {destination.adminTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">إضافة وتعديل وحذف الباقات</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
