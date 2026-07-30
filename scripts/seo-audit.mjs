import fs from "node:fs/promises";
import path from "node:path";

import { absoluteUrl, projectRoot, readGeneratedManifest, site } from "./seo-routes.mjs";

const errors = [];
const warnings = [];
const passes = [];

function expect(condition, message, level = "error") {
  if (condition) {
    passes.push(message);
  } else if (level === "warning") {
    warnings.push(message);
  } else {
    errors.push(message);
  }
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function attribute(html, elementPattern, attributeName) {
  const match = html.match(elementPattern);
  if (!match) return null;
  return match[0].match(new RegExp(`${attributeName}=["']([^"']+)["']`, "i"))?.[1] || null;
}

const manifest = await readGeneratedManifest();
const distDirectory = path.join(projectRoot, "dist");
const titles = new Map();
const descriptions = new Map();

for (const route of manifest.routes) {
  const htmlPath =
    route.path === "/"
      ? path.join(distDirectory, "index.html")
      : path.join(distDirectory, ...route.path.split("/").filter(Boolean), "index.html");
  let html;
  try {
    html = await fs.readFile(htmlPath, "utf8");
  } catch {
    errors.push(`${route.path}: missing generated HTML shell.`);
    continue;
  }

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = attribute(html, /<meta\b[^>]*name=["']description["'][^>]*>/i, "content");
  const canonical = attribute(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/i, "href");
  const robots = attribute(html, /<meta\b[^>]*name=["']robots["'][^>]*>/i, "content");

  expect(count(html, /<title\b/gi) === 1, `${route.path}: exactly one title.`);
  expect(Boolean(title), `${route.path}: title is present.`);
  expect(Boolean(description), `${route.path}: meta description is present.`);
  expect(canonical === absoluteUrl(route.path), `${route.path}: canonical is self-referential.`);
  expect(Boolean(robots), `${route.path}: robots directive is present.`);
  expect(
    count(html, /property=["']og:(?:title|description|image|url|type|site_name)["']/gi) >= 6,
    `${route.path}: required Open Graph fields are present.`,
  );
  expect(
    count(html, /name=["']twitter:(?:card|title|description|image)["']/gi) >= 4,
    `${route.path}: Twitter Card fields are present.`,
  );
  if (route.path !== "/" && !route.noIndex) {
    expect(html.includes('"@type":"BreadcrumbList"'), `${route.path}: BreadcrumbList is present.`);
  }
  if (route.path === "/") {
    expect(html.includes('"TravelAgency"'), "/: TravelAgency schema is present.");
    expect(html.includes('"Organization"'), "/: Organization schema is present.");
    expect(html.includes('"WebSite"'), "/: WebSite schema is present.");
  }

  if (title) {
    const matches = titles.get(title) || [];
    matches.push(route.path);
    titles.set(title, matches);
  }
  if (description) {
    const matches = descriptions.get(description) || [];
    matches.push(route.path);
    descriptions.set(description, matches);
  }
}

for (const [title, routes] of titles) {
  if (routes.length > 1) errors.push(`Duplicate title "${title}" on ${routes.join(", ")}.`);
}
for (const [description, routes] of descriptions) {
  if (routes.length > 1) {
    warnings.push(`Duplicate description on ${routes.join(", ")}.`);
  }
}

const sourceFiles = [];
async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(entryPath);
    else if (entry.name.endsWith(".tsx")) sourceFiles.push(entryPath);
  }
}
await walk(path.join(projectRoot, "src"));

for (const file of sourceFiles) {
  const content = await fs.readFile(file, "utf8");
  for (const match of content.matchAll(/<img\b[\s\S]*?\/>/g)) {
    const line = content.slice(0, match.index).split("\n").length;
    for (const attributeName of ["alt", "title", "loading", "width", "height"]) {
      if (!new RegExp(`\\b${attributeName}=`).test(match[0])) {
        errors.push(
          `${path.relative(projectRoot, file)}:${line}: image is missing ${attributeName}.`,
        );
      }
    }
  }
}

const robots = await fs.readFile(path.join(projectRoot, "dist", "robots.txt"), "utf8");
expect(robots.includes("Allow: /"), "robots.txt allows crawling.");
expect(
  robots.includes(`Sitemap: ${site.url}/sitemap.xml`),
  "robots.txt references the canonical sitemap.",
);

const sitemap = await fs.readFile(path.join(projectRoot, "dist", "sitemap.xml"), "utf8");
for (const route of manifest.routes.filter((item) => !item.noIndex)) {
  expect(
    sitemap.includes(`<loc>${absoluteUrl(route.path)}</loc>`),
    `${route.path}: listed in sitemap.`,
  );
}

const headers = await fs.readFile(path.join(projectRoot, "dist", "_headers"), "utf8");
for (const header of [
  "Content-Security-Policy:",
  "X-Frame-Options:",
  "X-Content-Type-Options:",
  "Referrer-Policy:",
  "Permissions-Policy:",
]) {
  expect(headers.includes(header), `_headers includes ${header.slice(0, -1)}.`);
}

const manifestJson = JSON.parse(
  await fs.readFile(path.join(projectRoot, "dist", "manifest.json"), "utf8"),
);
expect(manifestJson.name === site.name, "Web app manifest has the correct business name.");
for (const icon of manifestJson.icons || []) {
  const iconPath = path.join(projectRoot, "dist", icon.src.replace(/^\//, ""));
  try {
    await fs.access(iconPath);
    passes.push(`Manifest icon ${icon.src} exists.`);
  } catch {
    errors.push(`Manifest icon ${icon.src} is missing.`);
  }
}

for (const warning of manifest.warnings || []) warnings.push(warning);
warnings.push(
  "SearchAction was intentionally omitted: Google retired the sitelinks search box and the site has no real URL-based search endpoint.",
);
warnings.push(
  "Unknown SPA URLs can still return an HTTP 200 shell on Cloudflare Pages; the client renders a noindex 404. A strict HTTP 404 for unknown dynamic URLs requires a Pages Function or SSR.",
);

console.log(
  `SEO audit: ${passes.length} passed, ${warnings.length} warnings, ${errors.length} errors.`,
);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) process.exitCode = 1;
