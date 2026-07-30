import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
export const generatedManifestPath = path.join(
  projectRoot,
  "node_modules",
  ".cache",
  "caesar-seo-routes.json",
);

const configPath = path.join(projectRoot, "seo.config.json");
export const seoConfig = JSON.parse(await fs.readFile(configPath, "utf8"));
export const site = seoConfig.site;

const legacyVisaSlugs = new Set(["saudi", "uae", "qatar", "syria", "schengen", "uk", "usa"]);

const tripParentPages = {
  egypt: { name: "رحلات مصر", path: "/egypt" },
  turkey: { name: "رحلات تركيا", path: "/turkey-trip" },
  dubai: { name: "رحلات دبي", path: "/dubai" },
  switzerland: { name: "رحلات سويسرا", path: "/packages/switzerland" },
  maldives: { name: "رحلات المالديف", path: "/packages/maldives" },
  georgia: { name: "رحلات جورجيا", path: "/packages/georgia" },
  domestic: { name: "السياحة الداخلية", path: "/packages/domestic" },
  flights: { name: "حجوزات الطيران", path: "/packages/flights" },
  hotels: { name: "حجوزات الفنادق", path: "/packages/hotels" },
};

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export function absoluteUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `${site.url}${value.startsWith("/") ? value : `/${value}`}`;
}

export function staticBreadcrumbs(page) {
  if (page.path === "/") return [];
  const items = [{ name: "الرئيسية", path: "/" }];
  if (page.parentPath && page.parentName) {
    items.push({ name: page.parentName, path: page.parentPath });
  }
  items.push({ name: page.breadcrumbName, path: page.path });
  return items;
}

function cleanText(value, fallback) {
  const text = String(value || fallback || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 175) return text;
  const shortened = text.slice(0, 172);
  return `${shortened.replace(/\s+\S*$/, "")}…`;
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const itemPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(itemPath)));
    else files.push(itemPath);
  }
  return files;
}

async function discoverAuthoredRoutes() {
  const routesDirectory = path.join(projectRoot, "src", "routes");
  const routeFiles = (await walk(routesDirectory)).filter((file) => file.endsWith(".tsx"));
  const routes = new Set();

  for (const file of routeFiles) {
    const content = await fs.readFile(file, "utf8");
    const match = content.match(/createFileRoute\(\s*["']([^"']+)["']\s*\)/);
    if (!match) continue;
    const routePath = normalizePath(match[1]);
    if (routePath.startsWith("/admin") || routePath.includes("$")) continue;
    routes.add(routePath);
  }

  return [...routes];
}

async function loadLocalEnvironment() {
  const environment = { ...process.env };
  for (const name of [".env", ".env.production", ".env.local", ".env.production.local"]) {
    const envPath = path.join(projectRoot, name);
    let content;
    try {
      content = await fs.readFile(envPath, "utf8");
    } catch {
      continue;
    }

    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match || match[2] === "" || environment[match[1]]) continue;
      let value = match[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      environment[match[1]] = value;
    }
  }
  return environment;
}

async function fetchSupabaseRows(table, query, warnings) {
  const environment = await loadLocalEnvironment();
  const supabaseUrl = environment.VITE_SUPABASE_URL?.replace(/\/+$/, "");
  const anonKey = environment.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    warnings.push(
      `Skipped dynamic ${table} URLs because Supabase build variables are unavailable.`,
    );
    return [];
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      warnings.push(
        `Skipped dynamic ${table} URLs because Supabase returned HTTP ${response.status}.`,
      );
      return [];
    }
    return await response.json();
  } catch (error) {
    warnings.push(
      `Skipped dynamic ${table} URLs because the public data request failed: ${error instanceof Error ? error.message : "unknown error"}.`,
    );
    return [];
  }
}

function visibleTrip(trip) {
  if (trip.status === "hidden" || trip.is_visible === false) return false;
  if (!trip.offer_ends_at) return true;
  const expiresAt = new Date(trip.offer_ends_at).getTime();
  return Number.isNaN(expiresAt) || expiresAt > Date.now();
}

function dynamicTripRoute(trip) {
  if (!visibleTrip(trip)) return null;

  if (trip.page_key === "umrah") {
    const routePath = `/umrah/${trip.id}`;
    const title = trip.makkah_hotel || trip.title;
    return {
      path: routePath,
      title: `${title} | رحلة عمرة مع قيصر للسياحة والسفر`,
      description: cleanText(
        `${title}: ${
          trip.description ||
          `تفاصيل رحلة العمرة والإقامة والأسعار والمواعيد وخيارات الغرف مع قيصر للسياحة والسفر.`
        }`,
      ),
      image: trip.main_image_url || "/images/hajj-banner.jpg",
      breadcrumbName: title,
      breadcrumbs: [
        { name: "الرئيسية", path: "/" },
        { name: "رحلات العمرة", path: "/umrah" },
        { name: title, path: routePath },
      ],
      lastModified: trip.updated_at,
      source: "supabase-trip",
    };
  }

  if (trip.category !== "tourism") return null;
  const parent = tripParentPages[trip.page_key] || { name: "الرحلات", path: "/" };
  const routePath = `/trips/${trip.id}`;
  return {
    path: routePath,
    title: `${trip.title} | قيصر للسياحة والسفر`,
    description: cleanText(
      `${trip.title}: ${
        trip.description || `صور وأسعار وبرنامج الرحلة والمقاعد المتبقية مع قيصر للسياحة والسفر.`
      }`,
    ),
    image: trip.main_image_url || site.defaultImage,
    breadcrumbName: trip.title,
    breadcrumbs: [{ name: "الرئيسية", path: "/" }, parent, { name: trip.title, path: routePath }],
    lastModified: trip.updated_at,
    source: "supabase-trip",
  };
}

function dynamicVisaRoute(visa) {
  const routePath = legacyVisaSlugs.has(visa.slug) ? `/${visa.slug}` : `/visa/${visa.slug}`;
  return {
    path: routePath,
    title: `${visa.headline} | قيصر للسياحة والسفر`,
    description: cleanText(
      visa.description,
      `تفاصيل ${visa.headline} والمتطلبات وخطوات التقديم مع قيصر للسياحة والسفر.`,
    ),
    image: visa.banner_image_url || visa.card_image_url || "/images/visaa-banner.png",
    breadcrumbName: visa.headline,
    breadcrumbs: [
      { name: "الرئيسية", path: "/" },
      { name: "التأشيرات", path: "/visa" },
      { name: visa.headline, path: routePath },
    ],
    lastModified: visa.updated_at,
    source: "supabase-visa",
  };
}

export async function buildSeoRouteManifest() {
  const warnings = [];
  const routeMap = new Map(
    seoConfig.pages.map((page) => [
      page.path,
      {
        ...page,
        breadcrumbs: staticBreadcrumbs(page),
        source: "config",
      },
    ]),
  );

  const authoredRoutes = await discoverAuthoredRoutes();
  for (const routePath of authoredRoutes) {
    if (routeMap.has(routePath)) continue;
    const segment = routePath.split("/").filter(Boolean).at(-1) || "الصفحة";
    warnings.push(`Route ${routePath} is auto-discovered but has no tailored SEO config.`);
    routeMap.set(routePath, {
      path: routePath,
      title: `${segment} | قيصر للسياحة والسفر`,
      description: site.description,
      image: site.defaultImage,
      breadcrumbName: segment,
      breadcrumbs: [
        { name: "الرئيسية", path: "/" },
        { name: segment, path: routePath },
      ],
      source: "auto-discovered",
    });
  }

  const trips = await fetchSupabaseRows(
    "trips",
    "select=id,title,description,page_key,category,main_image_url,makkah_hotel,status,is_visible,offer_ends_at,updated_at&status=neq.hidden",
    warnings,
  );
  for (const trip of trips) {
    const route = dynamicTripRoute(trip);
    if (route) routeMap.set(route.path, route);
  }

  const visas = await fetchSupabaseRows(
    "visas",
    "select=slug,headline,description,card_image_url,banner_image_url,is_active,updated_at&is_active=eq.true",
    warnings,
  );
  for (const visa of visas) {
    const route = dynamicVisaRoute(visa);
    routeMap.set(route.path, route);
  }

  const routes = [...routeMap.values()].sort((left, right) => {
    if (left.path === "/") return -1;
    if (right.path === "/") return 1;
    return left.path.localeCompare(right.path, "en");
  });

  return { generatedAt: new Date().toISOString(), routes, warnings };
}

export async function writeGeneratedManifest(manifest) {
  await fs.mkdir(path.dirname(generatedManifestPath), { recursive: true });
  await fs.writeFile(generatedManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export async function readGeneratedManifest() {
  try {
    return JSON.parse(await fs.readFile(generatedManifestPath, "utf8"));
  } catch {
    const manifest = await buildSeoRouteManifest();
    await writeGeneratedManifest(manifest);
    return manifest;
  }
}

export function organizationWebsiteGraph() {
  const organizationId = `${site.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "TravelAgency"],
        "@id": organizationId,
        name: site.name,
        alternateName: site.alternateName,
        description: site.description,
        url: `${site.url}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(site.logo),
          width: 512,
          height: 512,
        },
        image: absoluteUrl(site.defaultImage),
        telephone: site.telephone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          ...site.address,
        },
        areaServed: {
          "@type": "Country",
          name: "Jordan",
        },
        sameAs: site.sameAs,
        contactPoint: [site.telephone, ...site.additionalTelephones].map((telephone) => ({
          "@type": "ContactPoint",
          telephone,
          contactType: "customer service",
          areaServed: "JO",
          availableLanguage: ["ar", "en"],
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        alternateName: site.alternateName,
        inLanguage: site.language,
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };
}

export function breadcrumbGraph(items) {
  if (!items || items.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
