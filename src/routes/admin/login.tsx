import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function authErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { code: "unknown", message: String(error) };
  }

  const authError = error as { code?: unknown; message?: unknown };
  return {
    code: typeof authError.code === "string" ? authError.code : "unknown",
    message: typeof authError.message === "string" ? authError.message : "Unknown auth error",
  };
}

function loginErrorMessage(error: unknown) {
  const { code, message } = authErrorDetails(error);
  const normalizedCode = code.toLowerCase();
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedCode === "invalid_credentials" ||
    normalizedMessage.includes("invalid login credentials")
  ) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن التطبيق متصل بمشروع Supabase مختلف.";
  }

  if (
    normalizedCode === "email_not_confirmed" ||
    normalizedMessage.includes("email not confirmed")
  ) {
    return "يجب تأكيد البريد الإلكتروني أولًا من رسالة التأكيد أو من لوحة Supabase.";
  }

  if (
    normalizedMessage.includes("missing environment variable") ||
    normalizedMessage.includes("supabase configuration")
  ) {
    return "إعدادات Supabase ناقصة. تحقق من VITE_SUPABASE_URL وVITE_SUPABASE_ANON_KEY ثم أعد تشغيل الخادم.";
  }

  if (
    normalizedCode.includes("network") ||
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("networkerror") ||
    normalizedMessage.includes("network request failed")
  ) {
    return "تعذر الاتصال بـ Supabase. تحقق من الإنترنت وعنوان المشروع ثم حاول مرة أخرى.";
  }

  return "تعذر تسجيل الدخول. حاول مرة أخرى وتحقق من إعدادات مشروع Supabase.";
}

function logAuthError(error: unknown) {
  if (!import.meta.env.DEV) return;

  const { code, message } = authErrorDetails(error);
  console.error("[Supabase Auth]", { code, message });
}

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      alert("أدخل البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        logAuthError(error);
        alert(loginErrorMessage(error));
        return;
      }

      if (!data.session) {
        throw new Error("Supabase login succeeded without creating a session.");
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session) throw new Error("Supabase session is unavailable after login.");

      await navigate({ to: "/admin", replace: true });
    } catch (error) {
      logAuthError(error);
      alert(loginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Tajawal",
      }}
    >
      <div
        style={{
          width: 380,
          padding: 30,
          border: "1px solid #ddd",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <h2>تسجيل دخول الإدارة</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 15,
          }}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
          }}
        />

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
            cursor: "pointer",
          }}
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </div>
    </div>
  );
}
