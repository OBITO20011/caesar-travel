import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/visa")({
  component: VisaLayout,
});

function VisaLayout() {
  return <Outlet />;
}
