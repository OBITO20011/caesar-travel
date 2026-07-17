import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/caesar-mark.png";
import { useSiteSettings } from "@/hooks/use-site-content";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = (item: (typeof NAV_LINKS)[0]) => {
    if (item.hash) {
      // إذا كان هناك hash، انتظر قليلاً ثم تمرر إلى العنصر
      setTimeout(() => scrollToElement(item.hash), 100);
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-md shadow-teal/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src={settings?.logo_url || logo}
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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-cream-dark transition-colors"
          aria-label="القائمة"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cream/98 backdrop-blur-md border-t border-border px-6 py-5"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={`${item.path}-${item.hash || ""}`}
                to={item.path}
                onClick={() => handleLinkClick(item)}
                className={`text-right text-base font-semibold transition-colors py-2.5 ${
                  isActive(item.path) ? "text-teal" : "text-foreground/80 hover:text-teal"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/gallery"
              className="mt-3 rounded-full bg-teal px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              احجز الآن
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
