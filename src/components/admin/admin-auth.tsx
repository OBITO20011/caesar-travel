import { useEffect, useState, type ComponentType } from "react";
import { useNavigate } from "@tanstack/react-router";

import { isLoggedIn } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export function withAdminAuth(Component: ComponentType) {
  function AuthenticatedAdminRoute() {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      let mounted = true;

      void isLoggedIn().then((loggedIn) => {
        if (!mounted) return;

        setAuthenticated(loggedIn);
        setChecking(false);

        if (!loggedIn) {
          void navigate({ to: "/admin/login", replace: true });
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;

        const loggedIn = Boolean(session);
        setAuthenticated(loggedIn);
        setChecking(false);

        if (!loggedIn) {
          void navigate({ to: "/admin/login", replace: true });
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }, [navigate]);

    if (checking || !authenticated) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
          <div className="text-center text-sm text-slate-500">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
            جاري التحقق من جلسة الإدارة...
          </div>
        </div>
      );
    }

    return (
      <>
        <AdminNavigation />
        <Component />
      </>
    );
  }

  AuthenticatedAdminRoute.displayName = `withAdminAuth(${Component.displayName || Component.name || "Component"})`;

  return AuthenticatedAdminRoute;
}
