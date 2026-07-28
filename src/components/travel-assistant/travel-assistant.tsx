import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  ChevronLeft,
  CircleAlert,
  Clock3,
  ExternalLink,
  LoaderCircle,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  assistantFallbackIcon,
  budgetChoices,
  destinationChoices,
  directPageByService,
  durationChoices,
  getDestination,
  getServiceChoice,
  serviceChoices,
  type AssistantChoice,
  type AssistantServiceId,
} from "@/components/travel-assistant/assistant-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSiteSettings, useTravelAssistantTrips } from "@/hooks/use-site-content";
import { buildWhatsAppUrl, formatTripAmount, getTripSeatState } from "@/lib/trip-format";
import { cn } from "@/lib/utils";
import type { Trip, TripPageKey } from "@/types/admin";

type AssistantStep = "services" | "destination" | "preferences" | "results" | "direct";

interface AssistantPreferences {
  month: number | null;
  duration: number | null;
  budget: number | null;
}

const initialPreferences: AssistantPreferences = {
  month: null,
  duration: null,
  budget: null,
};

function getStartingPrice(trip: Trip) {
  const stayPrices = (trip.stay_options ?? [])
    .map((option) => option.price)
    .filter((price) => Number.isFinite(price));

  return stayPrices.length > 0 ? Math.min(...stayPrices) : trip.price;
}

function getTripDurations(trip: Trip) {
  const stayDurations = (trip.stay_options ?? []).map((option) => option.days);
  if (stayDurations.length > 0) return stayDurations;
  return trip.nights > 0 ? [trip.nights + 1] : [];
}

function getTripMonths(trip: Trip) {
  const months = new Set<number>();
  const scheduleNumbers = trip.schedule_label?.match(/\d{1,2}/g) ?? [];

  scheduleNumbers.forEach((value) => {
    const month = Number(value);
    if (month >= 1 && month <= 12) months.add(month);
  });

  if (trip.start_date) {
    const [, month] = trip.start_date.split("-").map(Number);
    if (month >= 1 && month <= 12) months.add(month);
  }

  return [...months];
}

function getTripDetailsRoute(trip: Trip) {
  return trip.page_key === "umrah" ? "/umrah/$id" : "/trips/$id";
}

function ChoiceButton({
  choice,
  selected = false,
  onClick,
}: {
  choice: AssistantChoice;
  selected?: boolean;
  onClick: () => void;
}) {
  const Icon = choice.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-20 w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-right transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 motion-reduce:transition-none",
        selected
          ? "border-gold bg-gold/10 shadow-sm"
          : "border-teal/10 bg-white hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-gold text-teal-dark" : "bg-teal/8 text-teal group-hover:bg-teal/12",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black text-teal">{choice.label}</span>
        <span className="mt-1 block text-xs leading-5 text-foreground/60">
          {choice.description}
        </span>
      </span>
      <ChevronLeft className="mr-auto h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
    </button>
  );
}

function StepHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-black text-gold-dark">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-black leading-8 text-teal">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-foreground/65">{description}</p>
    </div>
  );
}

function FilterChoice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "min-h-11 cursor-pointer rounded-xl border px-3 py-2 text-sm font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 motion-reduce:transition-none",
        selected
          ? "border-teal bg-teal text-white"
          : "border-teal/15 bg-white text-teal hover:border-gold hover:bg-gold/8",
      )}
    >
      {children}
    </button>
  );
}

function RecommendationCard({ trip, closeAssistant }: { trip: Trip; closeAssistant: () => void }) {
  const startingPrice = getStartingPrice(trip);
  const seatState = getTripSeatState(trip);

  return (
    <article className="overflow-hidden rounded-2xl border border-teal/10 bg-white shadow-sm">
      <div className="grid grid-cols-[92px_1fr] gap-3 p-3">
        <div className="h-[92px] overflow-hidden rounded-xl bg-teal/8">
          {trip.main_image_url ? (
            <img
              src={trip.main_image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-teal/60">
              {(() => {
                const FallbackIcon = assistantFallbackIcon;
                return <FallbackIcon className="h-7 w-7" aria-hidden="true" />;
              })()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-black leading-6 text-teal">{trip.title}</h4>
            {trip.hotel_stars ? (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-2 py-1 text-xs font-black text-gold-dark"
                aria-label={`${trip.hotel_stars} نجوم`}
              >
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                {trip.hotel_stars}
              </span>
            ) : null}
          </div>

          {trip.schedule_label ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/65">
              <CalendarDays className="h-3.5 w-3.5 text-gold-dark" aria-hidden="true" />
              {trip.schedule_label}
            </p>
          ) : null}
          {trip.hotel_location ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/65">
              <MapPin className="h-3.5 w-3.5 text-gold-dark" aria-hidden="true" />
              <span className="truncate">{trip.hotel_location}</span>
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="block text-[11px] text-foreground/55">يبدأ من</span>
              <span className="text-base font-black text-gold-dark">
                {startingPrice !== undefined && startingPrice !== null
                  ? formatTripAmount(startingPrice, trip.currency)
                  : "تواصل لمعرفة السعر"}
              </span>
            </div>
            {seatState.tracksSeats && !seatState.soldOut ? (
              <span className="text-[11px] font-bold text-emerald-700">
                متبقي {trip.remaining_seats} مقعد
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Link
        to={getTripDetailsRoute(trip)}
        params={{ id: trip.id }}
        onClick={closeAssistant}
        className="flex min-h-11 w-full items-center justify-center gap-2 border-t border-teal/10 bg-teal px-4 text-sm font-black text-white transition-colors hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-gold/60"
      >
        شاهد التفاصيل واحجز
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function TravelAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<AssistantStep>("services");
  const [serviceId, setServiceId] = useState<AssistantServiceId | null>(null);
  const [pageKey, setPageKey] = useState<TripPageKey | null>(null);
  const [preferences, setPreferences] = useState<AssistantPreferences>(initialPreferences);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const tripsQuery = useTravelAssistantTrips(open);
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const availableTrips = useMemo(
    () =>
      (tripsQuery.data ?? []).filter((trip) => {
        const seatState = getTripSeatState(trip);
        return trip.status === "available" && !seatState.soldOut;
      }),
    [tripsQuery.data],
  );

  const tripsForPage = useMemo(
    () => availableTrips.filter((trip) => trip.page_key === pageKey),
    [availableTrips, pageKey],
  );

  const availableMonths = useMemo(
    () =>
      [...new Set(tripsForPage.flatMap(getTripMonths))].sort(
        (firstMonth, secondMonth) => firstMonth - secondMonth,
      ),
    [tripsForPage],
  );

  const availableDurations = useMemo(() => {
    const durations = new Set(tripsForPage.flatMap(getTripDurations));
    const preferredDurations = durationChoices.filter((duration) => durations.has(duration));
    return preferredDurations.length > 0 ? preferredDurations : [...durations].sort();
  }, [tripsForPage]);

  const recommendations = useMemo(() => {
    if (!pageKey) return [];

    return tripsForPage
      .filter((trip) => {
        if (preferences.month && !getTripMonths(trip).includes(preferences.month)) return false;
        if (preferences.duration && !getTripDurations(trip).includes(preferences.duration)) {
          return false;
        }
        const startingPrice = getStartingPrice(trip);
        if (
          preferences.budget &&
          (startingPrice === undefined ||
            startingPrice === null ||
            startingPrice > preferences.budget)
        ) {
          return false;
        }
        return true;
      })
      .sort((first, second) => {
        const firstPrice = getStartingPrice(first) ?? Number.MAX_SAFE_INTEGER;
        const secondPrice = getStartingPrice(second) ?? Number.MAX_SAFE_INTEGER;
        return firstPrice - secondPrice;
      })
      .slice(0, 3);
  }, [pageKey, preferences, tripsForPage]);

  if (location.pathname.startsWith("/admin")) return null;

  const selectedService = serviceId ? getServiceChoice(serviceId) : undefined;
  const selectedDestination = pageKey ? getDestination(pageKey) : undefined;
  const directPage = serviceId ? directPageByService[serviceId] : undefined;
  const destinationPath = selectedDestination?.path || directPage?.path || "/gallery";
  const destinationTitle = selectedDestination?.label || directPage?.title || "العروض";

  function resetAssistant() {
    setStep("services");
    setServiceId(null);
    setPageKey(null);
    setPreferences(initialPreferences);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      window.setTimeout(resetAssistant, 200);
    }
  }

  function chooseService(id: AssistantServiceId) {
    setServiceId(id);
    setPreferences(initialPreferences);

    if (id === "packages") {
      setPageKey(null);
      setStep("destination");
      return;
    }

    const page = directPageByService[id];
    if (page?.pageKey) {
      setPageKey(page.pageKey);
      setStep("preferences");
    } else {
      setPageKey(null);
      setStep("direct");
    }
  }

  function goBack() {
    if (step === "destination") {
      setStep("services");
      return;
    }
    if (step === "preferences") {
      setStep(serviceId === "packages" ? "destination" : "services");
      return;
    }
    if (step === "results") {
      setStep("preferences");
      return;
    }
    setStep("services");
  }

  const whatsappMessage = [
    "السلام عليكم، أحتاج مساعدة من قيصر لاختيار رحلة.",
    selectedService ? `الخدمة: ${selectedService.label}` : "",
    destinationTitle ? `الوجهة: ${destinationTitle}` : "",
    preferences.month ? `الشهر: ${preferences.month}` : "",
    preferences.duration ? `المدة: ${preferences.duration} أيام` : "",
    preferences.budget ? `الميزانية: حتى ${preferences.budget} دينار` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="fixed bottom-5 left-4 z-40 flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-gold/40 bg-teal px-4 py-3 text-sm font-black text-white shadow-[0_16px_40px_rgba(14,45,78,0.3)] transition-all duration-200 hover:-translate-y-1 hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 motion-reduce:transition-none sm:bottom-6 sm:left-6"
          aria-label="افتح مساعد قيصر لاختيار الرحلة"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold text-teal-dark">
            <Bot className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-teal bg-emerald-400" />
          </span>
          <span className="hidden sm:inline">ساعدني أختار</span>
        </button>
      </DialogTrigger>

      <DialogContent
        dir="rtl"
        className="bottom-0 left-0 top-auto max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-t-[2rem] border-x-0 border-b-0 border-t border-gold/30 bg-cream p-0 shadow-[0_-24px_80px_rgba(4,25,48,0.3)] sm:bottom-6 sm:left-6 sm:top-auto sm:max-h-[calc(100dvh-3rem)] sm:w-[min(440px,calc(100vw-3rem))] sm:translate-x-0 sm:translate-y-0 sm:rounded-[2rem] sm:border"
      >
        <DialogHeader className="relative overflow-hidden border-b border-white/10 bg-teal px-5 pb-5 pt-6 text-right text-white sm:px-6">
          <div className="absolute -left-10 -top-12 h-32 w-32 rounded-full bg-gold/15 blur-2xl" />
          <div className="relative flex items-start gap-3 pl-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold text-teal-dark shadow-lg">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-xl font-black leading-8 text-white">
                مساعد قيصر الذكي
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-sm leading-6 text-white/75">
                نختار لك من عروض قيصر الحقيقية
              </DialogDescription>
            </div>
          </div>
          <div className="relative mt-4 flex items-center gap-2 text-xs font-bold text-white/75">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(74,222,128,0.12)]" />
            متصل بالعروض المحدثة
          </div>
        </DialogHeader>

        <div
          ref={scrollAreaRef}
          className="max-h-[calc(92dvh-152px)] overflow-y-auto overscroll-contain px-4 py-5 sm:max-h-[calc(100dvh-200px)] sm:px-5"
        >
          {step !== "services" ? (
            <button
              type="button"
              onClick={goBack}
              className="mb-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-bold text-teal transition-colors hover:bg-teal/8 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              رجوع
            </button>
          ) : null}

          {step === "services" ? (
            <section aria-labelledby="assistant-services-title">
              <StepHeading
                eyebrow="لنبدأ"
                title="ما الخدمة التي تبحث عنها؟"
                description="اختر نوع الرحلة وسأقترح عليك الخيارات المناسبة خلال أقل من دقيقة."
              />
              <div className="grid gap-2.5 sm:grid-cols-2">
                {serviceChoices.map((service) => (
                  <ChoiceButton
                    key={service.id}
                    choice={service}
                    onClick={() => chooseService(service.id as AssistantServiceId)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "destination" ? (
            <section aria-labelledby="assistant-destination-title">
              <StepHeading
                eyebrow="الخطوة ١ من ٢"
                title="إلى أين تحب السفر؟"
                description="اختر الوجهة لنقرأ فنادقها وباقاتها المتاحة الآن."
              />
              <div className="grid gap-2.5 sm:grid-cols-2">
                {destinationChoices.map((destination) => (
                  <ChoiceButton
                    key={destination.id}
                    choice={destination}
                    selected={pageKey === destination.pageKey}
                    onClick={() => {
                      setPageKey(destination.pageKey);
                      setPreferences(initialPreferences);
                      setStep("preferences");
                    }}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "preferences" ? (
            <section aria-labelledby="assistant-preferences-title">
              <StepHeading
                eyebrow={serviceId === "packages" ? "الخطوة ٢ من ٢" : "اختياراتك"}
                title={`خصص بحثك عن ${destinationTitle}`}
                description="يمكنك ترك أي خيار على «الكل» إذا لم تحسم قرارك بعد."
              />

              {tripsQuery.isLoading ? (
                <div
                  className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-teal/10 bg-white text-center"
                  role="status"
                >
                  <LoaderCircle className="h-7 w-7 animate-spin text-gold-dark motion-reduce:animate-none" />
                  <p className="mt-3 text-sm font-bold text-teal">نقرأ العروض المتاحة...</p>
                </div>
              ) : tripsQuery.isError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
                  <CircleAlert className="mx-auto h-6 w-6 text-red-600" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold text-red-900">
                    تعذر تحميل العروض الآن، لكن يمكنك متابعة جميع عروض القسم أو التواصل معنا.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {availableMonths.length > 0 ? (
                    <fieldset>
                      <legend className="mb-2 flex items-center gap-2 text-sm font-black text-teal">
                        <CalendarDays className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                        شهر السفر
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        <FilterChoice
                          selected={preferences.month === null}
                          onClick={() => setPreferences((current) => ({ ...current, month: null }))}
                        >
                          كل الأشهر
                        </FilterChoice>
                        {availableMonths.map((month) => (
                          <FilterChoice
                            key={month}
                            selected={preferences.month === month}
                            onClick={() => setPreferences((current) => ({ ...current, month }))}
                          >
                            شهر {new Intl.NumberFormat("ar-JO").format(month)}
                          </FilterChoice>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}

                  {availableDurations.length > 0 ? (
                    <fieldset>
                      <legend className="mb-2 flex items-center gap-2 text-sm font-black text-teal">
                        <Clock3 className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                        مدة الرحلة
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        <FilterChoice
                          selected={preferences.duration === null}
                          onClick={() =>
                            setPreferences((current) => ({ ...current, duration: null }))
                          }
                        >
                          كل المدد
                        </FilterChoice>
                        {availableDurations.map((duration) => (
                          <FilterChoice
                            key={duration}
                            selected={preferences.duration === duration}
                            onClick={() => setPreferences((current) => ({ ...current, duration }))}
                          >
                            {new Intl.NumberFormat("ar-JO").format(duration)} أيام
                          </FilterChoice>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}

                  <fieldset>
                    <legend className="mb-2 flex items-center gap-2 text-sm font-black text-teal">
                      <WalletCards className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                      الميزانية للشخص
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {budgetChoices.map((budget) => (
                        <FilterChoice
                          key={budget.label}
                          selected={preferences.budget === budget.value}
                          onClick={() =>
                            setPreferences((current) => ({
                              ...current,
                              budget: budget.value,
                            }))
                          }
                        >
                          {budget.label}
                        </FilterChoice>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              <button
                type="button"
                disabled={tripsQuery.isLoading || tripsQuery.isError}
                onClick={() => setStep("results")}
                className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-black text-teal-dark shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/25 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                اعرض أفضل الخيارات
              </button>
            </section>
          ) : null}

          {step === "results" ? (
            <section aria-labelledby="assistant-results-title">
              <StepHeading
                eyebrow="اقتراحات قيصر"
                title={
                  recommendations.length > 0
                    ? `وجدنا ${new Intl.NumberFormat("ar-JO").format(recommendations.length)} خيارات مناسبة`
                    : "لم نجد تطابقًا كاملًا"
                }
                description={
                  recommendations.length > 0
                    ? "مرتبة حسب أقل سعر متاح. افتح أي عرض لمشاهدة الصور والتفاصيل."
                    : "جرّب توسيع الميزانية أو تغيير الشهر، أو شاهد جميع عروض الوجهة."
                }
              />

              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((trip) => (
                    <RecommendationCard
                      key={trip.id}
                      trip={trip}
                      closeAssistant={() => setOpen(false)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gold/30 bg-gold/8 p-5 text-center">
                  <Search className="mx-auto h-7 w-7 text-gold-dark" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold leading-6 text-teal">
                    العروض تتغير باستمرار، وفريق قيصر يستطيع تجهيز خيار خاص حسب طلبك.
                  </p>
                </div>
              )}

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a
                  href={destinationPath}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-teal/15 bg-white px-3 text-sm font-black text-teal transition-colors hover:border-gold hover:bg-gold/8 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                >
                  جميع عروض {destinationTitle}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={buildWhatsAppUrl(settings?.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#128C4A] px-3 text-sm font-black text-white transition-colors hover:bg-[#0f743e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/35"
                >
                  اسأل فريق قيصر
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <button
                type="button"
                onClick={resetAssistant}
                className="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold text-foreground/60 transition-colors hover:bg-teal/6 hover:text-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/30"
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                ابدأ اختيارًا جديدًا
              </button>
            </section>
          ) : null}

          {step === "direct" ? (
            <section aria-labelledby="assistant-direct-title">
              <StepHeading
                eyebrow="خدمة قيصر"
                title={`كل ما تحتاجه عن ${destinationTitle}`}
                description="شاهد الدول والمتطلبات والأسعار المحدثة، أو اسأل فريقنا عن حالتك."
              />
              <div className="rounded-3xl border border-gold/30 bg-white p-5 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h4 className="mt-4 text-lg font-black text-teal">القسم جاهز لك</h4>
                <p className="mt-2 text-sm leading-6 text-foreground/65">
                  افتح القسم واختر الدولة أو الخدمة، وستجد التفاصيل المتوفرة قبل التواصل.
                </p>
                <a
                  href={directPage?.path || "/visa"}
                  onClick={() => setOpen(false)}
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold px-4 text-sm font-black text-teal-dark transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/25"
                >
                  افتح قسم {destinationTitle}
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={buildWhatsAppUrl(settings?.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-teal/15 text-sm font-black text-teal transition-colors hover:border-gold hover:bg-gold/8 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/35"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  اسألنا مباشرة
                </a>
              </div>
            </section>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
