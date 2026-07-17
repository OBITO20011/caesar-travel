import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { VisaManager } from "@/components/admin/visa-manager";

export const Route = createFileRoute("/admin/visa/")({
  component: withAdminAuth(VisaPage),
});

function VisaPage() {
  return <VisaManager />;
}
