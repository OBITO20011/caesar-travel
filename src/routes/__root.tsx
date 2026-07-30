import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/header";
import { Seo, SiteStructuredData } from "../components/seo";
import { getRouteFallbackSeo, getStaticSeoPage } from "../lib/seo-config";

const TravelAssistant = lazy(() =>
  import("../components/travel-assistant/travel-assistant").then((module) => ({
    default: module.TravelAssistant,
  })),
);

function NotFoundComponent() {
  return (
    <>
      <Seo
        title="الصفحة غير موجودة | قيصر للسياحة والسفر"
        description="الصفحة المطلوبة غير موجودة. عد إلى موقع قيصر للسياحة والسفر لاستعراض الرحلات والخدمات المتاحة."
        path={window.location.pathname}
        noIndex
      />
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <>
      <Seo
        title="تعذر تحميل الصفحة | قيصر للسياحة والسفر"
        description="تعذر تحميل هذه الصفحة مؤقتاً. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية."
        path={window.location.pathname}
        noIndex
      />
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            حدث خطأ في تحميل الصفحة
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            حدث خطأ ما. يمكنك تحديث الصفحة أو العودة للرئيسية.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              المحاولة مرة أخرى
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const routeSeo = getRouteFallbackSeo(location.pathname);
  const staticSeoPage = getStaticSeoPage(location.pathname);
  const isHomePage = staticSeoPage?.path === "/";
  const hasDedicatedSeo =
    ["/", "/services", "/gallery", "/egypt", "/dubai", "/turkey-trip", "/visa"].includes(
      location.pathname,
    ) ||
    ["/saudi", "/uae", "/qatar", "/syria", "/schengen", "/uk", "/usa"].includes(
      location.pathname,
    ) ||
    location.pathname.startsWith("/visa/") ||
    location.pathname.startsWith("/packages/") ||
    location.pathname.startsWith("/trips/") ||
    (location.pathname.startsWith("/umrah/") && location.pathname !== "/umrah");
  const shouldRenderRootSeo =
    !hasDedicatedSeo && (Boolean(staticSeoPage) || location.pathname.startsWith("/admin"));

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {shouldRenderRootSeo ? (
          <Seo
            title={routeSeo.title}
            description={routeSeo.description}
            path={routeSeo.path}
            image={routeSeo.image}
            noIndex={routeSeo.noIndex}
          />
        ) : null}
        {isHomePage ? <SiteStructuredData /> : null}
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only"
        >
          تجاوز إلى المحتوى الرئيسي
        </a>
        <Header />
        <div id="main-content" tabIndex={-1}>
          <Outlet />
        </div>
        <Suspense fallback={null}>
          <TravelAssistant />
        </Suspense>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
