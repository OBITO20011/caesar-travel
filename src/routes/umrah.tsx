import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/umrah")({
  component: UmrahLayout,
});

function UmrahLayout() {
  return <Outlet />;
}