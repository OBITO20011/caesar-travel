import type { Trip } from "@/types/admin";

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatTripDate(value?: string, long = false) {
  if (!value) return "";

  return new Intl.DateTimeFormat(
    "ar-JO",
    long
      ? { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "numeric", day: "numeric" },
  ).format(parseDate(value));
}

export function formatTripPrice(trip: Pick<Trip, "price" | "currency">) {
  if (trip.price === undefined || trip.price === null) return "اضغط هنا لمعرفة الأسعار";

  const currencyLabel: Record<string, string> = {
    JOD: "د.أ",
    AED: "د.إ",
    USD: "$",
    EUR: "€",
  };
  const amount = new Intl.NumberFormat("ar-JO", { maximumFractionDigits: 2 }).format(trip.price);
  return `${amount} ${currencyLabel[trip.currency] || trip.currency}`;
}

export function normalizeJordanPhoneNumber(value: string | undefined, fallback = "") {
  const number = (value?.trim() || fallback).replace(/\D/g, "");
  if (number.startsWith("00")) return number.slice(2);
  if (number.startsWith("0")) return `962${number.slice(1)}`;
  return number;
}

export function buildWhatsAppUrl(whatsapp: string | undefined, message?: string) {
  const number = normalizeJordanPhoneNumber(whatsapp, "962798337711");
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
