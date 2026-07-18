import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";

export const Route = createFileRoute("/admin/dubai/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return (
    <TripManager
      category="tourism"
      pageKey="dubai"
      title="إدارة رحلات دبي"
      description="أضف عروض دبي وعدّل الاسم والسعر والصورة والتواريخ والتفاصيل."
    />
  );
}
