import { createFileRoute } from "@tanstack/react-router";

import { VisaCountryPage } from "@/components/visa-country-page";

export const Route = createFileRoute("/visa/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <VisaCountryPage slug={slug} />;
}
