import fs from "node:fs/promises";
import path from "node:path";

import {
  absoluteUrl,
  buildSeoRouteManifest,
  projectRoot,
  writeGeneratedManifest,
} from "./seo-routes.mjs";

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function validLastModified(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

const manifest = await buildSeoRouteManifest();
const urlEntries = manifest.routes
  .filter((route) => !route.noIndex)
  .map((route) => {
    const lastModified = validLastModified(route.lastModified);
    return [
      "  <url>",
      `    <loc>${xmlEscape(absoluteUrl(route.path))}</loc>`,
      ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlEntries,
  "</urlset>",
  "",
].join("\n");

await fs.writeFile(path.join(projectRoot, "public", "sitemap.xml"), sitemap, "utf8");
await writeGeneratedManifest(manifest);

console.log(`SEO sitemap generated with ${manifest.routes.length} canonical routes.`);
for (const warning of manifest.warnings) console.warn(`SEO warning: ${warning}`);
