import fs from "node:fs/promises";
import path from "node:path";

import {
  absoluteUrl,
  breadcrumbGraph,
  organizationWebsiteGraph,
  projectRoot,
  readGeneratedManifest,
  site,
} from "./seo-routes.mjs";

const managedAttribute = 'data-rh="true" data-seo-managed="true"';

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsonForHtml(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function imageType(image) {
  const pathname = String(image).split(/[?#]/, 1)[0].toLowerCase();
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

function removeManagedSeo(html) {
  return html
    .replace(/<title\b(?=[^>]*data-seo-managed)[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<(?:meta|link)\b(?=[^>]*data-seo-managed)[^>]*\/?>/gi, "")
    .replace(/<script\b(?=[^>]*data-seo-managed)[^>]*>[\s\S]*?<\/script>/gi, "");
}

function routeHead(route) {
  const canonicalUrl = absoluteUrl(route.path);
  const imageUrl = absoluteUrl(route.image || site.defaultImage);
  const robots = route.noIndex
    ? "noindex,nofollow,noarchive"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const schemas = [];

  if (route.path === "/") schemas.push(organizationWebsiteGraph());
  const breadcrumb = breadcrumbGraph(route.breadcrumbs);
  if (breadcrumb) schemas.push(breadcrumb);

  const lines = [
    `<title ${managedAttribute}>${escapeHtml(route.title)}</title>`,
    `<meta ${managedAttribute} name="description" content="${escapeHtml(route.description)}" />`,
    `<meta ${managedAttribute} name="robots" content="${robots}" />`,
    `<meta ${managedAttribute} name="googlebot" content="${robots}" />`,
    `<link ${managedAttribute} rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<link ${managedAttribute} rel="alternate" hreflang="ar-JO" href="${escapeHtml(canonicalUrl)}" />`,
    `<link ${managedAttribute} rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrl)}" />`,
    `<meta ${managedAttribute} property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta ${managedAttribute} property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta ${managedAttribute} property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta ${managedAttribute} property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />`,
    `<meta ${managedAttribute} property="og:image:type" content="${imageType(imageUrl)}" />`,
    ...(route.image === site.defaultImage
      ? [
          `<meta ${managedAttribute} property="og:image:width" content="1200" />`,
          `<meta ${managedAttribute} property="og:image:height" content="630" />`,
        ]
      : []),
    `<meta ${managedAttribute} property="og:image:alt" content="${escapeHtml(route.breadcrumbName || route.title)}" />`,
    `<meta ${managedAttribute} property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta ${managedAttribute} property="og:type" content="website" />`,
    `<meta ${managedAttribute} property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `<meta ${managedAttribute} property="og:locale" content="${site.locale}" />`,
    `<meta ${managedAttribute} name="twitter:card" content="summary_large_image" />`,
    `<meta ${managedAttribute} name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta ${managedAttribute} name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta ${managedAttribute} name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta ${managedAttribute} name="twitter:image:alt" content="${escapeHtml(route.breadcrumbName || route.title)}" />`,
    ...schemas.map((schema) => {
      const id = route.path === "/" ? "seo-site-structured-data" : "seo-route-structured-data";
      return `<script id="${id}" ${managedAttribute} type="application/ld+json">${jsonForHtml(schema)}</script>`;
    }),
  ];

  return `\n    ${lines.join("\n    ")}\n`;
}

function withRouteSeo(baseHtml, route) {
  const cleaned = removeManagedSeo(baseHtml);
  return cleaned.replace("</head>", `${routeHead(route)}  </head>`);
}

const manifest = await readGeneratedManifest();
const distDirectory = path.join(projectRoot, "dist");
const rootIndexPath = path.join(distDirectory, "index.html");
const baseHtml = await fs.readFile(rootIndexPath, "utf8");

for (const route of manifest.routes) {
  const routeSegments = route.path.split("/").filter(Boolean);
  const outputPath =
    route.path === "/"
      ? rootIndexPath
      : path.join(distDirectory, ...routeSegments.slice(0, -1), `${routeSegments.at(-1)}.html`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, withRouteSeo(baseHtml, route), "utf8");
}

console.log(`SEO HTML shells generated for ${manifest.routes.length} routes.`);
