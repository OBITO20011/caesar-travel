import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/caesar-mark.png";
import { useSiteSettings } from "@/hooks/use-site-content";
import { BUILTIN_LOGO_URL, resolveSiteAsset } from "@/lib/site-assets";

const NAV_LINKS = [
  { label: "الرئيسية", path: "/" },
  { label: "خدماتنا", path: "/services" },
  { label: "آراء العملاء", path: "/", hash: "reviews" },
  { label: "تواصل معنا", path: "/", hash: "contact" },
];

function scrollToElement(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = (item: (typeof NAV_LINKS)[0]) => {
    if (item.hash) {
      // إذا كان هناك hash، انتظر قليلاً ثم تمرر إلى العنصر
      setTimeout(() => scrollToElement(item.hash), 100);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-md shadow-teal/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-8 md:py-3">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src={resolveSiteAsset(settings?.logo_url, BUILTIN_LOGO_URL, logo)}
            alt="شعار قيصر للسياحة والسفر"
            className="h-11 w-11 object-contain"
          />
          <div className="text-right leading-tight">
            <span className="block text-lg font-black text-teal tracking-tight">قيصر</span>
            <span className="block text-[11px] font-medium text-gold-dark tracking-wide">
              CAESAR TRAVEL
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <Link
              key={`${item.path}-${item.hash || ""}`}
              to={item.path}
              onClick={() => handleLinkClick(item)}
              className={`text-sm font-semibold transition-colors ${
                isActive(item.path)
                  ? "text-teal"
                  : scrolled
                    ? "text-foreground/80 hover:text-teal"
                    : "text-foreground/90 hover:text-teal"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/gallery"
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
          >
            احجز الآن
          </Link>
        </div>

      </div>

      {/* Mobile links stay visible like the desktop navigation. */}
      <nav
        className="grid grid-cols-5 items-center gap-1 border-t border-teal/10 bg-cream/95 px-2 pb-2 pt-1.5 backdrop-blur-md md:hidden"
        aria-label="التنقل الرئيسي"
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={`${item.path}-${item.hash || ""}`}
            to={item.path}
            onClick={() => handleLinkClick(item)}
            className={`flex min-h-8 items-center justify-center whitespace-nowrap rounded-full px-1 text-center text-[10px] font-bold transition-colors sm:text-xs ${
              isActive(item.path)
                ? "bg-teal/10 text-teal"
                : "text-foreground/75 hover:bg-teal/5 hover:text-teal"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/gallery"
          className="flex min-h-8 items-center justify-center whitespace-nowrap rounded-full bg-teal px-1 text-center text-[10px] font-bold text-primary-foreground shadow-md shadow-teal/15 transition-colors hover:bg-teal-dark sm:text-xs"
        >
          احجز الآن
        </Link>
      </nav>
    </header>
  );
}
