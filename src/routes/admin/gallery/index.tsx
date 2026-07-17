import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const Route = createFileRoute("/admin/gallery/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return <GalleryManager />;
}
