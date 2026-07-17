import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

const navigationItems = [
  { label: "لوحة التحكم", to: "/admin/dashboard" },
  { label: "الرحلات", to: "/admin/trips" },
  { label: "العمرة", to: "/admin/umrah" },
  { label: "الفنادق", to: "/admin/hotels" },
  { label: "التأشيرات", to: "/admin/visa" },
  { label: "الطلبات", to: "/admin/orders" },
  { label: "الموظفون", to: "/admin/users" },
  { label: "الإعدادات", to: "/admin/settings" },
] as const;

export function AdminNavigation() {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setSigningOut(false);
      window.alert(error.message);
      return;
    }

    await navigate({ to: "/admin/login", replace: true });
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white shadow-lg backdrop-blur"
      dir="rtl"
      aria-label="التنقل في لوحة الإدارة"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-8">
        <Link to="/admin" className="shrink-0 font-black text-amber-400">
          Caesar Travel
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-amber-400 font-bold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          disabled={signingOut}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">تسجيل الخروج</span>
        </button>
      </div>
    </nav>
  );
}
