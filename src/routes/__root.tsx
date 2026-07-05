import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { httpEquiv: "content-language", content: "ar-JO" },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "قيصر للسياحة والسفر | حج وعمرة وتذاكر طيران — الرمثا، الأردن" },
      { name: "description", content: "قيصر للسياحة والسفر: باقات حج وعمرة، حجز تذاكر طيران وفنادق، تأشيرات، وسياحة داخلية وخارجية بأفضل الأسعار. مكتبنا في الرمثا، الأردن. اتصل الآن." },
      { name: "keywords", content: "قيصر للسياحة, حج, عمرة, تذاكر طيران, حجز فنادق, تأشيرات, سياحة الأردن, الرمثا, سفر, رحلات" },
      { name: "author", content: "قيصر للسياحة والسفر" },
      { name: "theme-color", content: "#1a3a63" },
      { name: "robots", content: "index, follow" },
      {name: "google-site-verification",
       content: "FZhxerkdCr06h5-QNca3YCE_DWx6K0dmSOR0YUcgACw",
},
      { property: "og:site_name", content: "قيصر للسياحة والسفر" },
      { property: "og:locale", content: "ar_JO" },
      { property: "og:title", content: "قيصر للسياحة والسفر | حج وعمرة وتذاكر طيران — الرمثا، الأردن" },
      { property: "og:description", content: "باقات حج وعمرة، حجز طيران وفنادق، تأشيرات، وسياحة داخلية وخارجية بأفضل الأسعار من قيصر للسياحة في الرمثا، الأردن." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://f0911b23.caesar-travel.pages.dev" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "قيصر للسياحة والسفر | حج وعمرة وتذاكر طيران" },
      { name: "twitter:description", content: "باقات حج وعمرة، حجز طيران وفنادق، تأشيرات، وسياحة داخلية وخارجية بأفضل الأسعار من قيصر للسياحة في الرمثا، الأردن." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/tIH6T0Gnr1UOPZS4hACNAkJAhk53/social-images/social-1783212733647-IMG_3642.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/tIH6T0Gnr1UOPZS4hACNAkJAhk53/social-images/social-1783212733647-IMG_3642.webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "قيصر للسياحة والسفر والحج والعمرة",
          alternateName: "Caesar Travel & Tourism",
          description: "وكالة سياحة وسفر متخصصة في الحج والعمرة وحجز الطيران والفنادق والتأشيرات والسياحة الداخلية والخارجية.",
          url: "https://f0911b23.caesar-travel.pages.dev",
          telephone: "+962795207900",
          address: {
            "@type": "PostalAddress",
            addressLocality: "الرمثا",
            addressCountry: "JO",
          },
          areaServed: "JO",
          openingHours: "Sa-Th 09:30-19:00",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.1",
            reviewCount: "58",
          },
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" },
      {
  rel: "canonical",
  href: "https://f0911b23.caesar-travel.pages.dev",},
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
