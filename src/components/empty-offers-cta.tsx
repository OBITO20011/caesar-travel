import { MessageCircle } from "lucide-react";

import { useSiteSettings } from "@/hooks/use-site-content";
import { buildWhatsAppUrl } from "@/lib/trip-format";

interface EmptyOffersCtaProps {
  /** What the customer is looking for, e.g. "العمرة" or "تركيا". */
  topic: string;
  /** "dark" for the gold-on-black sections, "light" for pale backgrounds. */
  tone?: "dark" | "light";
}

/**
 * Shown when a section has no published offers, so the visitor still has a next step
 * (WhatsApp) instead of a dead end.
 */
export function EmptyOffersCta({ topic, tone = "dark" }: EmptyOffersCtaProps) {
  const { data: settings } = useSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsapp,
    `مرحبا، بدي أعرف أحدث عروض ${topic}`,
  );
  const dark = tone === "dark";

  return (
    <div
      className={`col-span-full rounded-3xl px-6 py-12 text-center ${
        dark
          ? "border border-[#D4AF37]/30 bg-black/35 text-white backdrop-blur-xl"
          : "bg-white/70 text-slate-900 backdrop-blur-md"
      }`}
    >
      <h3 className={`text-2xl font-black ${dark ? "text-[#F8E4A1]" : ""}`}>
        عروض {topic} الجديدة بتنزل قريباً
      </h3>
      <p className={`mt-3 leading-8 ${dark ? "text-white/70" : "text-slate-600"}`}>
        راسلنا على واتساب وبنبعتلك أحدث العروض والأسعار المتاحة.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 font-bold text-white transition hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        اسألنا على واتساب
      </a>
    </div>
  );
}
