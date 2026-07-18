import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  PlaneTakeoff,
  ShieldCheck,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { buildWhatsAppUrl } from "@/lib/trip-format";
import type { SiteSettings } from "@/types/admin";

const destinations = [
  "الحج",
  "العمرة",
  "تركيا",
  "دبي",
  "مصر",
  "سويسرا",
  "المالديف",
  "جورجيا",
  "السياحة الداخلية",
  "حجز طيران",
  "حجز فنادق",
  "تأشيرة",
];

export function QuickQuoteSection({ settings }: { settings?: SiteSettings }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("quote-name") || "").trim();
    const phone = String(data.get("quote-phone") || "").trim();
    const destination = String(data.get("quote-destination") || "").trim();
    const date = String(data.get("quote-date") || "").trim();
    const peopleCount = Math.max(1, Number(data.get("quote-people") || 1));
    const notes = `طلب عرض سعر سريع — الوجهة: ${destination}، التاريخ: ${date || "مرن"}، عدد المسافرين: ${peopleCount}.`;
    const message = [
      "السلام عليكم، أرغب بالحصول على عرض سعر من قيصر للسياحة.",
      `الاسم: ${name}`,
      `رقم الهاتف: ${phone}`,
      `الوجهة أو الخدمة: ${destination}`,
      `التاريخ المتوقع: ${date || "مرن"}`,
      `عدد المسافرين: ${peopleCount}`,
    ].join("\n");

    window.open(buildWhatsAppUrl(settings?.whatsapp, message), "_blank", "noopener,noreferrer");

    void supabase
      .from("bookings")
      .insert([{ customer_name: name, phone, people_count: peopleCount, notes }])
      .then(({ error }) => {
        if (error) console.error("تعذر حفظ طلب عرض السعر", error);
      });

    setSubmitted(true);
    form.reset();
    window.setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <section id="quick-quote" className="relative bg-cream py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center md:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-black text-gold-dark">
            <PlaneTakeoff className="h-4 w-4" />
            رحلتك تبدأ من هنا
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-teal sm:text-4xl md:text-5xl">
            احصل على عرض سعر مناسب خلال أقل من دقيقة
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            أخبرنا بالوجهة وعدد المسافرين، وسيفتح واتساب برسالة مرتبة حتى نساعدك بسرعة ومن دون خطوات
            معقدة.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "خدمة موثوقة", text: "متابعة من التخطيط حتى العودة" },
              { icon: CalendarDays, title: "مرونة بالمواعيد", text: "خيارات تناسب وقتك وميزانيتك" },
              { icon: MessageCircle, title: "رد سريع", text: "تواصل مباشر عبر واتساب" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-white/70 p-5 shadow-sm"
              >
                <item.icon className="h-6 w-6 text-gold-dark" />
                <h3 className="mt-3 font-black text-teal">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-gold/25 bg-white p-6 shadow-[0_24px_70px_rgba(19,48,76,0.12)] sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-teal">طلب عرض سعر سريع</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                جميع الحقول مطلوبة ما عدا التاريخ.
              </p>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal sm:flex">
              <PlaneTakeoff className="h-7 w-7" />
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-foreground">
              الاسم الكامل
              <input
                name="quote-name"
                required
                autoComplete="name"
                placeholder="اكتب اسمك"
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-cream/50 px-4 font-normal outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
              />
            </label>
            <label className="text-sm font-bold text-foreground">
              رقم الهاتف
              <input
                name="quote-phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="07XXXXXXXX"
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-cream/50 px-4 text-right font-normal outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
              />
            </label>
            <label className="text-sm font-bold text-foreground">
              الوجهة أو الخدمة
              <select
                name="quote-destination"
                required
                defaultValue=""
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-cream/50 px-4 font-normal outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
              >
                <option value="" disabled>
                  اختر الوجهة
                </option>
                {destinations.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-foreground">
              التاريخ المتوقع
              <input
                name="quote-date"
                type="date"
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-cream/50 px-4 font-normal outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
              />
            </label>
            <label className="text-sm font-bold text-foreground sm:col-span-2">
              عدد المسافرين
              <div className="relative mt-2">
                <Users className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="quote-people"
                  required
                  type="number"
                  min="1"
                  max="99"
                  defaultValue="1"
                  className="h-12 w-full rounded-2xl border border-input bg-cream/50 pr-12 pl-4 font-normal outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-[#20bd5a]"
          >
            {submitted ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
            {submitted ? "تم تجهيز طلبك على واتساب" : "أرسل الطلب عبر واتساب"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            لن نشارك بياناتك مع أي جهة خارجية.
          </p>
        </form>
      </div>
    </section>
  );
}
