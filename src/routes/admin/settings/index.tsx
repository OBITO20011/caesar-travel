import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { SettingsManager } from "@/components/admin/settings-manager";

export const Route = createFileRoute("/admin/settings/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return <SettingsManager />;
}
