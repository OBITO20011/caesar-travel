import { createFileRoute, useParams } from "@tanstack/react-router";
import { Bus, CalendarDays, MapPin, Moon, Plane, Star, UtensilsCrossed } from "lucide-react";

import { Seo } from "@/components/seo";
import {
  BookingCard,
  DetailBody,
  DetailHero,
  DetailPage,
  DetailSection,
  PhotoGallery,
  type DetailFact,
  type PriceOption,
} from "@/components/trip-details";
import { usePublicTrip, useSiteSettings } from "@/hooks/use-site-content";
import { getBreadcrumbItems } from "@/lib/seo-config";
import {
  buildWhatsAppUrl,
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";
import type { TripPageKey } from "@/types/admin";

export const Route = createFileRoute("/trips/$id")({
  component: TripPackageDetailsPage,
});

interface PageMeta {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  destination: string;
  programTitle: string;
}

const pageMeta: Partial<Record<TripPageKey, PageMeta>> = {
  general: {
    backHref: "/",
    backLabel: "العودة للرئيسية",
    eyebrow: "عرض سياحي من قيصر",
    destination: "وجهة سياحية",
    programTitle: "تفاصيل البرنامج",
  },
  hajj: {
    backHref: "/hajj",
    backLabel: "جميع برامج الحج",
    eyebrow: "برنامج حج",
    destination: "مكة المكرمة والمدينة المنورة",
    programTitle: "تفاصيل برنامج الحج",
  },
  egypt: {
    backHref: "/egypt",
    backLabel: "جميع فنادق وباقات مصر",
    eyebrow: "فندق وباقة في مصر",
    destination: "مصر",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  turkey: {
    backHref: "/turkey-trip",
    backLabel: "جميع فنادق وباقات تركيا",
    eyebrow: "فندق وباقة في تركيا",
    destination: "تركيا",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  dubai: {
    backHref: "/dubai",
    backLabel: "جميع فنادق وباقات دبي",
    eyebrow: "فندق وباقة في دبي",
    destination: "دبي",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  switzerland: {
    backHref: "/packages/switzerland",
    backLabel: "جميع باقات سويسرا",
    eyebrow: "باقة سياحية في سويسرا",
    destination: "سويسرا",
    programTitle: "تفاصيل الباقة والبرنامج",
  },
  maldives: {
    backHref: "/packages/maldives",
    backLabel: "جميع باقات المالديف",
    eyebrow: "إقامة سياحية في المالديف",
    destination: "المالديف",
    programTitle: "تفاصيل الإقامة والبرنامج",
  },
  georgia: {
    backHref: "/packages/georgia",
    backLabel: "جميع باقات جورجيا",
    eyebrow: "باقة سياحية في جورجيا",
    destination: "جورجيا",
    programTitle: "تفاصيل الباقة والبرنامج",
  },
  domestic: {
    backHref: "/packages/domestic",
    backLabel: "جميع الرحلات الداخلية",
    eyebrow: "رحلة داخل الأردن",
    destination: "الأردن",
    programTitle: "برنامج الرحلة",
  },
  flights: {
    backHref: "/packages/flights",
    backLabel: "جميع عروض الطيران",
    eyebrow: "عرض طيران",
    destination: "رحلة جوية",
    programTitle: "تفاصيل عرض الطيران",
  },
  hotels: {
    backHref: "/packages/hotels",
    backLabel: "جميع عروض الفنادق",
    eyebrow: "إقامة فندقية",
    destination: "فندق مختار",
    programTitle: "تفاصيل الفندق والإقامة",
  },
};

const optionalTripsLabel = "الرحلات الداخلية الأخرى اختيارية";

function TripPackageDetailsPage() {
  const { id } = useParams({ from: "/trips/$id" });
  const tripQuery = usePublicTrip(id);
  const { data: settings } = useSiteSettings();

  if (tripQuery.isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6">
        <p className="text-lg font-bold text-[#15343A]">جاري تحميل تفاصيل العرض...</p>
      </main>
    );
  }

  const trip = tripQuery.data;
  const meta = trip ? pageMeta[trip.page_key] : undefined;

  if (tripQuery.isError || !trip || trip.category !== "tourism" || !meta) {
    return (
      <>
        <Seo
          title="العرض غير موجود | قيصر للسياحة والسفر"
          description="العرض المطلوب غير موجود أو لم يعد متاحاً. استعرض الرحلات والباقات الحالية لدى قيصر للسياحة والسفر."
          path={`/trips/${id}`}
          noIndex
        />
        <main
          className="flex min-h-[70vh] items-center justify-center bg-[#F5EFD9] px-6 text-center"
          dir="rtl"
        >
          <div>
            <h1 className="text-3xl font-black text-[#15343A]">العرض غير موجود</h1>
            <a
              href="/"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#15343A] px-7 py-3 font-bold text-white"
            >
              العودة للرئيسية
            </a>
          </div>
        </main>
      </>
    );
  }

  const seatState = getTripSeatState(trip);
  const discount = getTripDiscountPercentage(trip);
  const available = trip.status === "available" && !seatState.soldOut;
  const programItems = (trip.description || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const optionalTripsItem = programItems.find((item) => item.startsWith(optionalTripsLabel));
  const standardProgramItems = programItems.filter((item) => item !== optionalTripsItem);
  const optionalTripOptions = optionalTripsItem
    ? optionalTripsItem
        .replace(new RegExp(`^${optionalTripsLabel}\\s*[:：]?\\s*`), "")
        .replace(/\.$/, "")
        .split(/[،,]/)
        .map((option) => option.trim())
        .filter(Boolean)
        .map((option) => {
          const priceStart = option.indexOf("+");

          return priceStart > 0
            ? {
                label: option.slice(0, priceStart).trim(),
                price: option.slice(priceStart).trim(),
              }
            : { label: option, price: "" };
        })
    : [];
  const hotelFeatures = trip.hotel_features ?? [];
  const gallery = Array.from(new Set((trip.additional_image_urls ?? []).filter(Boolean)));
  const heroImage = trip.main_image_url || gallery[0] || undefined;
  const stayOptions = [...(trip.stay_options ?? [])].sort(
    (first, second) => first.days - second.days,
  );
  const roomOptions: PriceOption[] = (
    [
      ["double_price", "غرفة ثنائية"],
      ["triple_price", "غرفة ثلاثية"],
      ["quad_price", "غرفة رباعية"],
    ] as const
  ).flatMap(([field, label]) => {
    const price = trip[field];
    return typeof price === "number" && price > 0 ? [{ key: field, label, price }] : [];
  });
  const priceOptions: PriceOption[] =
    stayOptions.length > 0
      ? stayOptions.map((option) => ({
          key: `${option.days}-${option.nights}-${option.price}`,
          label: `${option.days} أيام / ${option.nights} ليالٍ`,
          price: option.price,
        }))
      : roomOptions.length > 0
        ? roomOptions
        : typeof trip.price === "number" && trip.price > 0
          ? [{ key: "price", label: "السعر للشخص", price: trip.price }]
          : [];
  const isHotelPackage =
    Boolean(trip.hotel_location || trip.hotel_stars || roomOptions.length || hotelFeatures.length) ||
    ["egypt", "turkey", "dubai", "hotels"].includes(trip.page_key);
  const duration =
    stayOptions.length === 0 && trip.nights > 0 ? `${trip.nights + 1} يوم / ${trip.nights} ليلة` : "";
  const dateLabel =
    trip.schedule_label || (trip.start_date ? formatTripDate(trip.start_date, true) : "");
  const destinationLabel = trip.hotel_location || meta.destination;
  const seatBadge = seatState.tracksSeats
    ? seatState.soldOut
      ? "اكتمل الحجز"
      : `متبقي ${trip.remaining_seats} مقعد`
    : undefined;

  const lines: DetailFact[] = [{ icon: MapPin, text: destinationLabel }];
  if (trip.hotel_stars) {
    lines.push({ icon: Star, text: `فندق ${trip.hotel_stars} نجوم` });
  }
  const facts: DetailFact[] = [];
  if (dateLabel) facts.push({ icon: CalendarDays, text: dateLabel });
  if (duration) facts.push({ icon: Moon, text: duration });
  if (trip.airline) facts.push({ icon: Plane, text: trip.airline });
  if (trip.meals) facts.push({ icon: UtensilsCrossed, text: trip.meals });

  const buildBookingUrl = (option?: PriceOption) =>
    buildWhatsAppUrl(
      settings?.whatsapp,
      [
        `السلام عليكم، أرغب بحجز ${trip.title}`,
        option ? `(${option.label} بسعر ${formatTripAmount(option.price, trip.currency)} للشخص)` : "",
        dateLabel ? `الموعد: ${dateLabel}` : "",
      ]
        .filter(Boolean)
        .join(" ") + ".",
    );
  const seoDescription =
    `${trip.title}: ${
      programItems[0] || "صور وأسعار وتفاصيل الرحلة مع قيصر للسياحة والسفر."
    }`.slice(0, 180);

  return (
    <>
      <Seo
        title={`${trip.title} | قيصر للسياحة والسفر`}
        description={seoDescription}
        path={`/trips/${trip.id}`}
        image={heroImage}
        imageAlt={trip.title}
        breadcrumbs={getBreadcrumbItems(`/trips/${trip.id}`, trip.title, {
          name: meta.backLabel,
          path: meta.backHref,
        })}
      />

      <DetailPage>
        <DetailHero
          backHref={meta.backHref}
          backLabel={meta.backLabel}
          image={heroImage}
          imageAlt={trip.title}
          badges={[meta.eyebrow]}
          title={trip.title}
          lines={lines}
          facts={facts}
        />

        <DetailBody
          aside={
            <BookingCard
              heading={stayOptions.length > 0 ? "اختر مدة الإقامة (السعر للشخص)" : "السعر للشخص"}
              options={priceOptions}
              currency={trip.currency}
              oldPrice={trip.old_price}
              discount={discount}
              available={available}
              badges={seatBadge ? [seatBadge] : undefined}
              offerEndsAt={trip.offer_ends_at}
              footnote="الموعد والسعر النهائي يتأكدوا مع موظف الحجز على واتساب."
              buildBookingUrl={buildBookingUrl}
            />
          }
          main={
            <>
              <DetailSection
                title={isHotelPackage ? "تفاصيل الإقامة" : meta.programTitle}
                items={standardProgramItems}
              />

              {optionalTripOptions.length > 0 ? (
                <DetailSection title="رحلات داخلية اختيارية">
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#15343A]/70">
                    <Bus className="h-4 w-4 text-[#B88912]" aria-hidden="true" />
                    المبلغ الإضافي محسوب للشخص.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {optionalTripOptions.map((option) => (
                      <div
                        key={`${option.label}-${option.price}`}
                        className="rounded-2xl border border-[#D4AF37]/30 bg-[#FFF9E8] px-3 py-3 text-center"
                      >
                        <span className="block text-sm font-bold text-[#15343A]/75">
                          {option.label}
                        </span>
                        {option.price ? (
                          <strong className="mt-1 block font-black text-[#9B7617]">
                            {option.price}
                          </strong>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </DetailSection>
              ) : null}

              <DetailSection title="مميزات الفندق" items={hotelFeatures} />
              <PhotoGallery
                title={isHotelPackage ? "صور الفندق" : "صور الرحلة"}
                images={gallery}
                alt={trip.title}
              />
            </>
          }
        />
      </DetailPage>
    </>
  );
}
