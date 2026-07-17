import { createFileRoute } from "@tanstack/react-router";

import { withAdminAuth } from "@/components/admin/admin-auth";
import { EmployeeManager } from "@/components/admin/employee-manager";

export const Route = createFileRoute("/admin/users/")({
  component: withAdminAuth(RouteComponent),
});

function RouteComponent() {
  return <EmployeeManager />;
}
