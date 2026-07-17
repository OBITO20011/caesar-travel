import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { BookingManager } from "@/components/admin/booking-manager";

export const Route = createFileRoute("/admin/orders/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return <BookingManager />;
}
