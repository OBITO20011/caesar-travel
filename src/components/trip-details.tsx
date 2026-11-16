import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  type LucideIcon,
} from "lucide-react";

import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import { formatTripAmount } from "@/lib/trip-format";

/*
 * Shared building blocks for every offer details page (Umrah, tourism packages…),
 * so all of them read the same way: photo → name → key facts → price & booking → details.
 * Each fact appears once; nothing is repeated between the hero, the booking card and the sections.
 */

export interface DetailFact {
  icon: LucideIcon;
  text: string;
}

export function DetailPage({ children }: { children: ReactNode }) {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F5EFD9] pb-20 pt-24 text-[#15343A] md:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </main>
  );
}

export function DetailHero({
  backHref,
  backLabel,
  image,
  imageAlt,
  badges,
  title,
  lines,
  facts,
  lead,
}: {
  backHref: string;
  backLabel: string;
  image?: string;
  imageAlt: string;
  badges: string[];
  title: string;
  lines?: DetailFact[];
  facts: DetailFact[];
  lead?: string;
}) {
  return (
    <header>
      <a
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-[#15343A]/70 transition hover:text-[#15343A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37]/50"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </a>

      {image ? (
        <img
          src={image}
          alt={imageAlt}
          title={imageAlt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={1600}
          height={900}
          className="mt-3 aspect-[16/9] max-h-[460px] w-full rounded-3xl bg-[#15343A] object-cover shadow-lg"
        />
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-[#15343A] px-3.5 py-1.5 text-xs font-bold text-[#F3CF63] sm:text-sm"
          >
            {badge}
          </span>
        ))}
      </div>

      <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{title}</h1>

      {lines?.length ? (
        <ul className="mt-3 space-y-1.5">
          {lines.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2 text-base font-bold text-[#15343A]/80">
              <Icon className="mt-1 h-4 w-4 shrink-0 text-[#B88912]" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      ) : null}

      {lead ? <p className="mt-3 max-w-3xl leading-8 text-[#15343A]/75">{lead}</p> : null}

      {facts.length ? (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="معلومات سريعة">
          {facts.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 py-2 text-sm font-bold"
            >
              <Icon className="h-4 w-4 text-[#B88912]" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

/** Two columns on desktop (details + sticky booking card); on phones the booking card comes first. */
export function DetailBody({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="order-2 min-w-0 space-y-6 lg:order-1">{main}</div>
      <aside className="order-1 lg:sticky lg:top-28 lg:order-2">{aside}</aside>
    </div>
  );
}

export interface PriceOption {
  key: string;
  label: string;
  price: number;
}

export function BookingCard({
  heading,
  options,
  currency,
  oldPrice,
  discount,
  available,
  badges,
  offerEndsAt,
  footnote,
  buildBookingUrl,
}: {
  heading: string;
  options: PriceOption[];
  currency: string;
  oldPrice?: number | null;
  discount?: number;
  available: boolean;
  badges?: string[];
  offerEndsAt?: string | null;
  footnote?: string;
  buildBookingUrl: (option?: PriceOption) => string;
}) {
  const [selectedKey, setSelectedKey] = useState(options[0]?.key);
  const selected = options.find((option) => option.key === selectedKey) ?? options[0];

  return (
    <section
      aria-labelledby="booking-title"
      className="rounded-3xl border border-[#D4AF37]/35 bg-white p-5 shadow-[0_16px_45px_rgba(70,53,17,0.10)]"
    >
      <h2 id="booking-title" className="text-lg font-black">
        {heading}
      </h2>

      {discount && discount > 0 && oldPrice ? (
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-rose-600 px-2.5 py-0.5 font-black text-white">
            خصم {discount}%
          </span>
          <span className="text-[#15343A]/50 line-through">{formatTripAmount(oldPrice, currency)}</span>
        </p>
      ) : null}

      {options.length > 1 ? (
        <div className="mt-4 space-y-2" role="radiogroup" aria-label={heading}>
          {options.map((option) => {
            const isSelected = option.key === selected?.key;
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedKey(option.key)}
                className={`flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-right transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37]/50 ${
                  isSelected
                    ? "border-[#B88912] bg-[#FFF8E6]"
                    : "border-[#15343A]/10 hover:border-[#B88912]/50"
                }`}
              >
                <span className="flex items-center gap-2 font-bold">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected ? "border-[#B88912] bg-[#B88912] text-white" : "border-[#15343A]/25"
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  {option.label}
                </span>
                <span className="text-lg font-black text-[#9B7617]">
                  {formatTripAmount(option.price, currency)}
                </span>
              </button>
            );
          })}
        </div>
      ) : selected ? (
        <p className="mt-3 text-4xl font-black text-[#9B7617]">
          {formatTripAmount(selected.price, currency)}
        </p>
      ) : (
        <p className="mt-3 font-bold text-[#15343A]/70">تواصل معنا لمعرفة السعر</p>
      )}

      {badges?.length || offerEndsAt ? (
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          {badges?.map((badge) => (
            <span key={badge} className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
              {badge}
            </span>
          ))}
          <TripOfferCountdown
            endsAt={offerEndsAt}
            className="rounded-full bg-rose-50 px-3 py-1 text-rose-700"
          />
        </div>
      ) : null}

      {available ? (
        <a
          href={buildBookingUrl(selected)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3.5 text-lg font-black text-[#102F3A] transition hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#15343A]/30"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          احجز عبر واتساب
        </a>
      ) : (
        <span className="mt-5 block rounded-2xl bg-[#15343A]/5 px-5 py-3.5 text-center font-black text-[#15343A]/60">
          العرض غير متاح للحجز حاليًا
        </span>
      )}

      {footnote ? (
        <p className="mt-3 text-center text-xs leading-6 text-[#15343A]/60">{footnote}</p>
      ) : null}
    </section>
  );
}

export function DetailSection({
  title,
  items,
  children,
}: {
  title: string;
  items?: string[];
  children?: ReactNode;
}) {
  if (!items?.length && !children) return null;

  return (
    <section className="rounded-3xl border border-[#15343A]/10 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-black">{title}</h2>
      {items?.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-3 leading-7">
              <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#B88912]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </section>
  );
}

export function PhotoGallery({ title, images, alt }: { title: string; images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  const close = () => setOpenIndex(null);
  const step = (delta: number) =>
    setOpenIndex((current) =>
      current === null ? null : (current + delta + images.length) % images.length,
    );

  return (
    <section className="rounded-3xl border border-[#15343A]/10 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((imageUrl, index) => (
          <button
            key={imageUrl}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`تكبير صورة ${index + 1} من ${alt}`}
            className="group aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl bg-[#15343A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37]"
          >
            <img
              src={imageUrl}
              alt={`${alt} - صورة ${index + 1}`}
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`صور ${alt}`}
          tabIndex={-1}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
            if (event.key === "ArrowLeft") step(1);
            if (event.key === "ArrowRight") step(-1);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06171d]/95 p-4 backdrop-blur-md focus:outline-none sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق الصور"
            className="absolute left-4 top-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#15343A] transition hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3CF63] sm:left-8 sm:top-8"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <img
            src={images[openIndex]}
            alt={`${alt} - صورة ${openIndex + 1}`}
            decoding="async"
            className="max-h-[84vh] max-w-full rounded-3xl object-contain shadow-2xl"
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="الصورة السابقة"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#15343A] transition hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white sm:right-8"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="الصورة التالية"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#15343A] transition hover:bg-[#F3CF63] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white sm:left-8"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          ) : null}
          <span className="absolute bottom-5 rounded-full bg-black/55 px-4 py-2 text-sm font-bold text-white">
            {openIndex + 1} / {images.length}
          </span>
        </div>
      ) : null}
    </section>
  );
}
