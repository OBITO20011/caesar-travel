import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";

export const Route = createFileRoute("/admin/hajj/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return (
    <TripManager
      category="tourism"
      pageKey="hajj"
      title="إدارة برامج الحج"
      description="عدّل إعلان الحج وتواريخه وتفاصيل التسجيل وحالة عرضه."
    />
  );
}
