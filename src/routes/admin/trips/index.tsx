import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";

export const Route = createFileRoute("/admin/trips/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return (
    <TripManager
      title="إدارة الرحلات"
      description="أضف الرحلات السياحية وبرامج الحج والطيران، وحدّث الأسعار والمقاعد وحالة العرض من مكان واحد."
    />
  );
}
