import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";

export const Route = createFileRoute("/admin/egypt/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return (
    <TripManager
      category="tourism"
      pageKey="egypt"
      title="إدارة رحلات مصر"
      description="أضف عروض مصر وعدّل الاسم والسعر والصورة والتواريخ والتفاصيل."
    />
  );
}
