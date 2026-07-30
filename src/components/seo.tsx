import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

import {
  getBreadcrumbItems,
  normalizeSeoPath,
  siteConfig,
  toAbsoluteSiteUrl,
  type BreadcrumbItem,
} from "@/lib/seo-config";

type JsonLdNode = Record<string, unknown>;

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: JsonLdNode | JsonLdNode[];
}

const indexRobots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const noIndexRobots = "noindex,nofollow,noarchive";

function imageMimeType(imageUrl: string) {
  const pathname = imageUrl.split(/[?#]/, 1)[0].toLowerCase();
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

function breadcrumbSchema(items: BreadcrumbItem[]) {
  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteSiteUrl(item.path),
    })),
  };
}

export function Seo({
  title,
  description,
  path,
  image = siteConfig.defaultImage,
  imageAlt,
  type = "website",
  noIndex = false,
  breadcrumbs,
  structuredData,
}: SeoProps) {
  useEffect(() => {
    document.head
      .querySelectorAll("[data-seo-managed='true']")
      .forEach((element) => element.remove());
  }, []);

  const normalizedPath = normalizeSeoPath(path);
  const canonicalUrl = toAbsoluteSiteUrl(normalizedPath);
  const imageUrl = toAbsoluteSiteUrl(image);
  const isDefaultSocialImage = image === siteConfig.defaultImage;
  const robots = noIndex ? noIndexRobots : indexRobots;
  const resolvedBreadcrumbs =
    breadcrumbs ?? getBreadcrumbItems(normalizedPath, title.split("|", 1)[0].trim());
  const schemaNodes = [
    breadcrumbSchema(resolvedBreadcrumbs),
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
  ].filter(Boolean) as JsonLdNode[];

  return (
    <Helmet prioritizeSeoTags>
      <html lang={siteConfig.language} dir="rtl" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ar-JO" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content={imageMimeType(imageUrl)} />
      {isDefaultSocialImage ? <meta property="og:image:width" content="1200" /> : null}
      {isDefaultSocialImage ? <meta property="og:image:height" content="630" /> : null}
      <meta property="og:image:alt" content={imageAlt || title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt || title} />

      {schemaNodes.length > 0 ? (
        <script id="seo-route-structured-data" type="application/ld+json">
          {JSON.stringify(
            schemaNodes.length === 1
              ? schemaNodes[0]
              : {
                  "@context": "https://schema.org",
                  "@graph": schemaNodes.map(({ ["@context"]: _context, ...node }) => node),
                },
          )}
        </script>
      ) : null}
    </Helmet>
  );
}

export function SiteStructuredData() {
  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${siteConfig.url}/#website`;
  const contactPoints = [siteConfig.telephone, ...siteConfig.additionalTelephones].map(
    (telephone) => ({
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "JO",
      availableLanguage: ["ar", "en"],
    }),
  );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "TravelAgency"],
        "@id": organizationId,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        description: siteConfig.description,
        url: `${siteConfig.url}/`,
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteSiteUrl(siteConfig.logo),
          width: 512,
          height: 512,
        },
        image: toAbsoluteSiteUrl(siteConfig.defaultImage),
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          ...siteConfig.address,
        },
        areaServed: {
          "@type": "Country",
          name: "Jordan",
        },
        sameAs: siteConfig.sameAs,
        contactPoint: contactPoints,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${siteConfig.url}/`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        inLanguage: siteConfig.language,
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };

  return (
    <Helmet>
      <script id="seo-site-structured-data" type="application/ld+json">
        {JSON.stringify(graph)}
      </script>
    </Helmet>
  );
}
