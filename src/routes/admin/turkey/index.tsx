import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { TripManager } from "@/components/admin/trip-manager";

export const Route = createFileRoute("/admin/turkey/")({
  component: withAdminAuth(TurkeyPackagesManagerPage),
});

function TurkeyPackagesManagerPage() {
  return (
    <TripManager
      category="tourism"
      pageKey="turkey"
      title="إدارة فنادق وباقات تركيا"
      description="أضف فنادق وباقات تركيا وعدّل الصور والأسعار والتواريخ والمقاعد وتفاصيل الإقامة."
    />
  );
}
