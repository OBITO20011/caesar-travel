import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";

export const Route = createFileRoute("/admin/umrah/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return (
    <TripManager
      category="umrah"
      title="إدارة برامج العمرة"
      description="إدارة باقات العمرة والفنادق والمقاعد والتواريخ الموسمية باستخدام سجل الرحلات الموحد."
    />
  );
}
