import { createFileRoute, Link } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";
import { getPackageDestination } from "@/data/package-destinations";

export const Route = createFileRoute("/admin/packages/$slug")({
  component: withAdminAuth(PackageManagerPage),
});

function PackageManagerPage() {
  const { slug } = Route.useParams();
  const destination = getPackageDestination(slug);

  if (!destination) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center bg-slate-100 text-center"
        dir="rtl"
      >
        <div>
          <h1 className="text-2xl font-black text-slate-900">القسم غير موجود</h1>
          <Link to="/admin/packages" className="mt-5 inline-block font-bold text-amber-700">
            العودة إلى الأقسام
          </Link>
        </div>
      </main>
    );
  }

  return (
    <TripManager
      category="tourism"
      pageKey={destination.pageKey}
      title={`إدارة ${destination.adminTitle}`}
      description={`أضف باقات ${destination.title} وعدّل الاسم والسعر والصورة والتواريخ والتفاصيل.`}
    />
  );
}
