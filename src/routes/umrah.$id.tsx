import { createFileRoute, useParams } from "@tanstack/react-router";
import { Building2, CalendarDays, Moon, Plane, UtensilsCrossed } from "lucide-react";

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
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";

export const Route = createFileRoute("/umrah/$id")({
  component: UmrahDetailsPage,
});

// Lines the page already says elsewhere (price heading, booking footnote, airline chip),
// so they are not repeated in the notes / flight lists.
const REDUNDANT_LINE =
  /^الأسعار للشخص|الموعد والمقاعد يتأكد|^على متن .*(الموعد|موظف الحجز)/;
// "عمرة جو 5 أيام / 4 ليالي في مكة المكرمة على …" only repeats the chips under the title.
const GENERIC_AIR_DESCRIPTION = /^عمرة جو \d+ أيام/;

const roomLabels = [
  ["quad_price", "غرفة رباعية"],
  ["triple_price", "غرفة ثلاثية"],
  ["double_price", "غرفة ثنائية"],
] as const;

function UmrahDetailsPage() {
  const { id } = useParams({ from: "/umrah/$id" });
  const tripQuery = usePublicTrip(id);
  const { data: settings } = useSiteSettings();

  if (tripQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFD9]">
        <p className="text-lg text-gray-600">جاري تحميل تفاصيل الرحلة...</p>
      </main>
    );
  }

  const trip = tripQuery.data;
  if (tripQuery.isError || !trip || trip.page_key !== "umrah") {
    return (
      <>
        <Seo
          title="رحلة العمرة غير موجودة | قيصر للسياحة والسفر"
          description="رحلة العمرة المطلوبة غير موجودة أو لم تعد متاحة. استعرض رحلات العمرة الحالية لدى قيصر للسياحة والسفر."
          path={`/umrah/${id}`}
          noIndex
        />
        <main className="flex min-h-screen items-center justify-center bg-[#F5EFD9]">
          <h1 className="text-2xl font-bold">رحلة العمرة غير موجودة</h1>
        </main>
      </>
    );
  }

  const isAir = trip.umrah_transport === "air";
  const programName = trip.title || trip.makkah_hotel || "برنامج عمرة";
  const routeName = isAir
    ? trip.umrah_route === "makkah"
      ? "مكة فقط"
      : "مكة والمدينة"
    : "مكة والمدينة";
  const transportName = isAir ? "عمرة جو" : "عمرة بر";

  const lines: DetailFact[] = [];
  if (trip.makkah_hotel) lines.push({ icon: Building2, text: `فندق مكة: ${trip.makkah_hotel}` });
  if (trip.madinah_hotel)
    lines.push({ icon: Building2, text: `فندق المدينة: ${trip.madinah_hotel}` });

  const scheduleText = trip.schedule_label || (trip.start_date ? formatTripDate(trip.start_date) : "");
  const facts: DetailFact[] = [];
  if (scheduleText) facts.push({ icon: CalendarDays, text: scheduleText });
  if (isAir && trip.nights > 0)
    facts.push({ icon: Moon, text: `${trip.nights + 1} أيام / ${trip.nights} ليالٍ` });
  if (trip.airline) facts.push({ icon: Plane, text: trip.airline });
  if (trip.meals) facts.push({ icon: UtensilsCrossed, text: trip.meals });

  const lead =
    trip.description && !GENERIC_AIR_DESCRIPTION.test(trip.description.trim())
      ? trip.description
      : undefined;

  const options: PriceOption[] = roomLabels.flatMap(([field, label]) => {
    const price = trip[field];
    return typeof price === "number" && price > 0 ? [{ key: field, label, price }] : [];
  });
  if (options.length === 0 && typeof trip.price === "number" && trip.price > 0) {
    options.push({ key: "price", label: "سعر الباقة", price: trip.price });
  }

  const seatState = getTripSeatState(trip);
  const available = trip.status === "available" && !seatState.soldOut;
  const seatBadge = seatState.tracksSeats
    ? seatState.soldOut
      ? "اكتمل الحجز"
      : seatState.lastSeats
        ? trip.remaining_seats === 1
          ? "آخر مقعد"
          : "آخر مقعدين"
        : `متبقي ${trip.remaining_seats} مقعد`
    : undefined;

  const flightLines = (trip.flight_details ?? []).filter((line) => !REDUNDANT_LINE.test(line));
  const notes = (trip.program_notes ?? []).filter((line) => !REDUNDANT_LINE.test(line));
  const gallery = Array.from(
    new Set([...(trip.additional_image_urls ?? []), trip.madinah_image_url].filter(Boolean)),
  ) as string[];

  const buildBookingUrl = (option?: PriceOption) =>
    buildWhatsAppUrl(
      settings?.whatsapp,
      [
        `السلام عليكم، أرغب بحجز ${transportName} – ${programName}`,
        trip.airline ? `على ${trip.airline}` : "",
        option ? `(${option.label} بسعر ${formatTripAmount(option.price, trip.currency)} للشخص)` : "",
      ]
        .filter(Boolean)
        .join(" ") + ".",
    );

  return (
    <>
      <Seo
        title={`${programName} | برنامج ${transportName} ${routeName} مع قيصر`}
        description={`${programName}، برنامج ${transportName} إلى ${routeName}${
          trip.airline ? ` على ${trip.airline}` : ""
        }: ${trip.description || "الأسعار والفندق والمواعيد وخيارات الغرف مع قيصر للسياحة والسفر."}`.slice(
          0,
          180,
        )}
        path={`/umrah/${trip.id}`}
        image={trip.main_image_url || gallery[0] || undefined}
        imageAlt={programName}
        breadcrumbs={getBreadcrumbItems(`/umrah/${trip.id}`, programName, {
          name: "رحلات العمرة",
          path: "/umrah",
        })}
      />
      <DetailPage>
        <DetailHero
          backHref="/umrah"
          backLabel="كل برامج العمرة"
          image={trip.main_image_url || gallery[0] || undefined}
          imageAlt={programName}
          badges={[transportName, routeName]}
          title={programName}
          lines={lines}
          lead={lead}
          facts={facts}
        />

        <DetailBody
          aside={
            <BookingCard
              heading="السعر للشخص حسب الغرفة"
              options={options}
              currency={trip.currency}
              oldPrice={trip.old_price}
              discount={getTripDiscountPercentage(trip)}
              available={available}
              badges={seatBadge ? [seatBadge] : undefined}
              offerEndsAt={trip.offer_ends_at}
              footnote="الموعد والمقاعد يتأكدوا مع موظف الحجز على واتساب."
              buildBookingUrl={buildBookingUrl}
            />
          }
          main={
            <>
              <DetailSection title="يشمل البرنامج" items={trip.program_inclusions} />
              <DetailSection title="مواعيد الطيران" items={flightLines} />
              <div
                className={
                  trip.program_requirements?.length && notes.length
                    ? "grid gap-6 md:grid-cols-2"
                    : "space-y-6"
                }
              >
                <DetailSection title="الأوراق المطلوبة" items={trip.program_requirements} />
                <DetailSection title="ملاحظات مهمة" items={notes} />
              </div>
              <PhotoGallery title="صور الفندق" images={gallery} alt={programName} />
            </>
          }
        />
      </DetailPage>
    </>
  );
}
