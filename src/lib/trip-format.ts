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

  return formatTripAmount(trip.price, trip.currency);
}

export function formatTripAmount(amount: number, currency: string) {
  // 0 means the price was never entered; never show "0 JOD" to a customer.
  if (!Number.isFinite(amount) || amount <= 0) return "تواصل لمعرفة السعر";

  const currencyLabel: Record<string, string> = {
    JOD: "د.أ",
    AED: "د.إ",
    USD: "$",
    EUR: "€",
  };
  const formattedAmount = new Intl.NumberFormat("ar-JO", { maximumFractionDigits: 2 }).format(
    amount,
  );
  return `${formattedAmount} ${currencyLabel[currency] || currency}`;
}

export function getTripDiscountPercentage(trip: Pick<Trip, "price" | "old_price">) {
  if (
    trip.price === undefined ||
    trip.price === null ||
    trip.old_price === undefined ||
    trip.old_price === null ||
    trip.old_price <= trip.price
  ) {
    return 0;
  }

  return Math.round(((trip.old_price - trip.price) / trip.old_price) * 100);
}

export function isTripOfferExpired(trip: Pick<Trip, "offer_ends_at">, now = Date.now()) {
  if (!trip.offer_ends_at) return false;
  const endTime = new Date(trip.offer_ends_at).getTime();
  return Number.isFinite(endTime) && endTime <= now;
}

/** Today's date in Jordan as YYYY-MM-DD, so expiry follows the office's calendar day. */
export function jordanToday(now = Date.now()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Amman",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now));
}

/**
 * A trip is past once its last date (end date, or start date when there is no end date)
 * is before today in Jordan. Trips with no dates never expire by date.
 */
export function isTripDatePassed(
  trip: Pick<Trip, "start_date" | "end_date">,
  now = Date.now(),
) {
  const lastDate = (trip.end_date || trip.start_date || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastDate)) return false;
  return lastDate < jordanToday(now);
}

export function getTripSeatState(trip: Pick<Trip, "status" | "total_seats" | "remaining_seats">) {
  const tracksSeats = trip.total_seats > 0;
  const soldOut = trip.status === "fully_booked" || (tracksSeats && trip.remaining_seats <= 0);
  const lastSeats =
    trip.status === "available" &&
    tracksSeats &&
    trip.remaining_seats > 0 &&
    trip.remaining_seats <= 2;

  return { tracksSeats, soldOut, lastSeats };
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
