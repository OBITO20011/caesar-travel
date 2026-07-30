import seoConfigJson from "../../seo.config.json";

export interface SeoPageConfig {
  path: string;
  title: string;
  description: string;
  image: string;
  breadcrumbName: string;
  parentPath?: string;
  parentName?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SeoConfig {
  site: {
    url: string;
    name: string;
    alternateName: string;
    language: string;
    locale: string;
    description: string;
    defaultImage: string;
    logo: string;
    telephone: string;
    additionalTelephones: string[];
    email: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    sameAs: string[];
  };
  pages: SeoPageConfig[];
}

export const seoConfig = seoConfigJson as SeoConfig;
export const siteConfig = seoConfig.site;
export const staticSeoPages = seoConfig.pages;

export function normalizeSeoPath(pathname: string) {
  const cleanPath = pathname.split(/[?#]/, 1)[0] || "/";
  if (cleanPath === "/") return cleanPath;
  return cleanPath.replace(/\/+$/, "");
}

export function toAbsoluteSiteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${siteConfig.url}${path}`;
}

export function getStaticSeoPage(pathname: string) {
  const normalizedPath = normalizeSeoPath(pathname);
  return staticSeoPages.find((page) => page.path === normalizedPath);
}

export function getBreadcrumbItems(
  pathname: string,
  currentName?: string,
  parent?: BreadcrumbItem,
): BreadcrumbItem[] {
  const normalizedPath = normalizeSeoPath(pathname);
  if (normalizedPath === "/") return [];

  const page = getStaticSeoPage(normalizedPath);
  const items: BreadcrumbItem[] = [{ name: "الرئيسية", path: "/" }];

  if (parent) {
    items.push(parent);
  } else if (page?.parentPath && page.parentName) {
    items.push({ name: page.parentName, path: page.parentPath });
  } else if (normalizedPath.startsWith("/visa/")) {
    items.push({ name: "التأشيرات", path: "/visa" });
  } else if (normalizedPath.startsWith("/umrah/")) {
    items.push({ name: "رحلات العمرة", path: "/umrah" });
  } else if (normalizedPath.startsWith("/packages/")) {
    items.push({ name: "الوجهات", path: "/gallery" });
  }

  items.push({
    name: currentName || page?.breadcrumbName || "الصفحة الحالية",
    path: normalizedPath,
  });

  return items;
}

export function getRouteFallbackSeo(pathname: string): SeoPageConfig & { noIndex?: boolean } {
  const normalizedPath = normalizeSeoPath(pathname);
  const staticPage = getStaticSeoPage(normalizedPath);
  if (staticPage) return staticPage;

  if (normalizedPath.startsWith("/admin")) {
    const section = normalizedPath.split("/").filter(Boolean).slice(1).join(" — ");
    return {
      path: normalizedPath,
      title: `${section || "الرئيسية"} | لوحة إدارة قيصر`,
      description: "صفحة خاصة بإدارة محتوى موقع قيصر للسياحة والسفر.",
      image: siteConfig.defaultImage,
      breadcrumbName: "لوحة الإدارة",
      noIndex: true,
    };
  }

  if (normalizedPath.startsWith("/umrah/")) {
    return {
      path: normalizedPath,
      title: "تفاصيل رحلة العمرة | قيصر للسياحة والسفر",
      description:
        "تفاصيل فندق ورحلة العمرة والأسعار والمواعيد وخيارات الغرف مع قيصر للسياحة والسفر.",
      image: "/images/hajj-banner.jpg",
      breadcrumbName: "تفاصيل رحلة العمرة",
    };
  }

  if (normalizedPath.startsWith("/trips/")) {
    return {
      path: normalizedPath,
      title: "تفاصيل الرحلة | قيصر للسياحة والسفر",
      description:
        "شاهد تفاصيل الرحلة والصور والبرنامج والأسعار والمقاعد المتبقية مع قيصر للسياحة والسفر.",
      image: siteConfig.defaultImage,
      breadcrumbName: "تفاصيل الرحلة",
    };
  }

  if (normalizedPath.startsWith("/visa/")) {
    return {
      path: normalizedPath,
      title: "تفاصيل التأشيرة | قيصر للسياحة والسفر",
      description:
        "تعرف إلى أنواع التأشيرة والمتطلبات ومدة الإنجاز وخطوات التقديم مع قيصر للسياحة والسفر.",
      image: "/images/visaa-banner.png",
      breadcrumbName: "تفاصيل التأشيرة",
    };
  }

  return {
    path: normalizedPath,
    title: "الصفحة غير موجودة | قيصر للسياحة والسفر",
    description:
      "الصفحة المطلوبة غير موجودة. عد إلى موقع قيصر للسياحة والسفر لاستعراض الرحلات والخدمات المتاحة.",
    image: siteConfig.defaultImage,
    breadcrumbName: "الصفحة غير موجودة",
    noIndex: true,
  };
}
