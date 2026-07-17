import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { HotelManager } from "@/components/admin/hotel-manager";

export const Route = createFileRoute("/admin/hotels/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return <HotelManager />;
}
