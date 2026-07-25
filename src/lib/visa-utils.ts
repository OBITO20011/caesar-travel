export function normalizeVisaSlug(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidCurrencyCode(value: string) {
  return /^[A-Z]{3}$/.test(value.trim().toUpperCase());
}

export function formatVisaPrice(
  price: number | null | undefined,
  currency: string,
  emptyLabel: string,
) {
  if (price === undefined || price === null) return emptyLabel;

  const normalizedCurrency = currency.trim().toUpperCase();
  const safeCurrency = isValidCurrencyCode(normalizedCurrency) ? normalizedCurrency : "JOD";

  return new Intl.NumberFormat("ar-JO", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 2,
  }).format(price);
}
