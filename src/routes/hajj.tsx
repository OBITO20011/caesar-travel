import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

import { TripOfferCountdown } from "@/components/trip-offer-countdown";
import { usePublicTrips } from "@/hooks/use-site-content";
import {
  formatTripAmount,
  formatTripDate,
  formatTripPrice,
  getTripDiscountPercentage,
  getTripSeatState,
} from "@/lib/trip-format";

export const Route = createFileRoute("/hajj")({
  component: HajjPage,
});

const statusLabels = {
  available: "التسجيل مفتوح الآن",
  fully_booked: "اكتمل التسجيل",
  cancelled: "البرنامج ملغى",
  completed: "انتهى البرنامج",
} as const;

const HAJJ_FORM_URL =
  "https://script.google.com/macros/s/AKfycbwaZvJJn5XpGzh1f8sMuWXbabdLE8N13L4an_p_vwhhm7NkmlwNiTCalgtUG1XqwBNg/exec";

function HajjPage() {
  const tripsQuery = usePublicTrips("hajj");
  const trips = tripsQuery.data ?? [];

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleHajjRegistration(
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const payload = new URLSearchParams({
    fullName: String(formData.get("fullName") || ""),
    phone: String(formData.get("phone") || ""),
    governorate: String(formData.get("governorate") || ""),
    age: String(formData.get("age") || ""),
    performedHajj: String(formData.get("performedHajj") || ""),
  });

  setSubmitting(true);

  try {
    const request = fetch(HAJJ_FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: payload,
    });

    // لا نخلي العميل ينتظر Google Apps Script فترة طويلة
    await Promise.race([
      request,
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);

    form.reset();
    setSubmitted(true);

    // نترك الطلب يكمل بالخلفية إن كان Google ما زال يعالجه
    void request;
  } catch {
    alert("تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat py-16"
      style={{ backgroundImage: "url('/images/hajj-banner.jpg')" }}
    >
      <h1 className="sr-only">
        رحلات الحج من الأردن مع قيصر للسياحة والسفر
      </h1>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        {tripsQuery.isLoading ? (
          <div className="rounded-3xl bg-white/35 p-10 text-center text-lg backdrop-blur-md">
            جاري تحميل برامج الحج...
          </div>
        ) : tripsQuery.isError ? (
          <div className="rounded-3xl bg-white/35 p-10 text-center text-lg backdrop-blur-md">
            تعذر تحميل برامج الحج حالياً. حاول تحديث الصفحة.
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-3xl bg-white/35 p-10 text-center text-lg backdrop-blur-md">
            لا توجد برامج حج معروضة حالياً.
          </div>
        ) : (
          trips.map((trip) => {
            const seatState = getTripSeatState(trip);
            const discount = getTripDiscountPercentage(trip);

            const available =
              trip.status === "available" && !seatState.soldOut;

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="rounded-3xl border border-white/30 bg-white/35 p-6 shadow-2xl backdrop-blur-md md:p-10"
              >
                <span
                  className={`rounded-full px-5 py-2 font-bold text-white ${
                    available ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {seatState.soldOut
                    ? "اكتمل التسجيل"
                    : statusLabels[
                        trip.status as keyof typeof statusLabels
                      ] || "غير متاح"}
                </span>

                <h2 className="mt-6 flex items-center justify-center gap-3 text-center text-3xl font-bold text-blue-900 md:text-5xl">
                  🕋
                  <span>{trip.title}</span>
                </h2>

                {trip.description ? (
                  <p className="mt-6 text-lg leading-9 text-gray-700 md:text-xl">
                    {trip.description}
                  </p>
                ) : null}

                {trip.start_date || trip.end_date ? (
                  <div className="mt-10 rounded-2xl bg-slate-50 p-6">
                    <h3 className="mb-4 text-2xl font-bold">
                      📅 موعد الحج المتوقع
                    </h3>

                    {trip.start_date ? (
                      <p className="text-lg">
                        بداية الحج:{" "}
                        <b>
                          {formatTripDate(trip.start_date, true)}
                        </b>
                      </p>
                    ) : null}

                    {trip.end_date ? (
                      <p className="mt-2 text-lg">
                        نهاية المناسك:{" "}
                        <b>
                          {formatTripDate(trip.end_date, true)}
                        </b>
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {trip.price !== undefined &&
                  trip.price !== null ? (
                    <div className="rounded-2xl bg-white/70 px-5 py-3">
                      {trip.old_price && discount > 0 ? (
                        <p className="text-sm text-gray-500 line-through">
                          {formatTripAmount(
                            trip.old_price,
                            trip.currency,
                          )}
                        </p>
                      ) : null}

                      <p className="text-2xl font-black text-blue-900">
                        {formatTripPrice(trip)}
                      </p>
                    </div>
                  ) : null}

                  {discount > 0 ? (
                    <span className="rounded-full bg-rose-600 px-4 py-2 font-black text-white">
                      خصم {discount}%
                    </span>
                  ) : null}

                  {seatState.tracksSeats ? (
                    <span
                      className={`rounded-full px-4 py-2 font-bold ${
                        seatState.soldOut
                          ? "bg-rose-600 text-white"
                          : "bg-amber-300 text-slate-900"
                      }`}
                    >
                      {seatState.soldOut
                        ? "اكتمل التسجيل"
                        : seatState.lastSeats
                          ? trip.remaining_seats === 1
                            ? "آخر مقعد"
                            : "آخر مقعدين"
                          : `متبقي ${trip.remaining_seats} مقعد`}
                    </span>
                  ) : null}

                  <TripOfferCountdown
                    endsAt={trip.offer_ends_at}
                    className="rounded-full bg-slate-900/80 px-4 py-2 font-bold text-white"
                  />
                </div>

                {available ? (
                  <div className="mt-10 rounded-3xl border border-white/50 bg-white/85 p-6 shadow-xl backdrop-blur-xl md:p-8">
                    <div className="mb-7 text-center">
                      <div className="mb-3 text-4xl">🕋</div>

                      <h3 className="text-3xl font-black text-blue-900">
                        سجّل اهتمامك بالحج
                      </h3>

                      <p className="mt-2 text-gray-600">
                        أدخل بياناتك وسيقوم فريق قيصر للسياحة
                        والسفر بالتواصل معك.
                      </p>
                    </div>

                    {submitted ? (
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                        <div className="mb-2 text-4xl">✅</div>

                        <h4 className="text-xl font-black text-green-700">
                          تم استلام طلبك بنجاح
                        </h4>

                        <p className="mt-2 text-gray-600">
                          سيتم التواصل معك عند توفر تفاصيل التسجيل
                          وبرامج الحج.
                        </p>

                        <button
                          type="button"
                          onClick={() => setSubmitted(false)}
                          className="mt-5 rounded-xl bg-blue-900 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                        >
                          تسجيل شخص آخر
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleHajjRegistration}
                        className="grid gap-5 md:grid-cols-2"
                      >
                        <div>
                          <label
                            htmlFor="fullName"
                            className="mb-2 block font-bold text-gray-800"
                          >
                            الاسم الرباعي
                          </label>

                          <input
                            id="fullName"
                            name="fullName"
                            required
                            type="text"
                            autoComplete="name"
                            placeholder="اكتب الاسم الرباعي"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="mb-2 block font-bold text-gray-800"
                          >
                            رقم الهاتف
                          </label>

                          <input
                            id="phone"
                            name="phone"
                            required
                            type="tel"
                            inputMode="numeric"
                            pattern="0[0-9]{9}"
                            maxLength={10}
                            autoComplete="tel"
                            placeholder="0791234567"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="governorate"
                            className="mb-2 block font-bold text-gray-800"
                          >
                            المحافظة
                          </label>

                          <select
                            id="governorate"
                            name="governorate"
                            required
                            defaultValue=""
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          >
                            <option value="" disabled>
                              اختر المحافظة
                            </option>

                            <option value="عمّان">عمّان</option>
                            <option value="إربد">إربد</option>
                            <option value="الزرقاء">الزرقاء</option>
                            <option value="البلقاء">البلقاء</option>
                            <option value="المفرق">المفرق</option>
                            <option value="جرش">جرش</option>
                            <option value="عجلون">عجلون</option>
                            <option value="مادبا">مادبا</option>
                            <option value="الكرك">الكرك</option>
                            <option value="الطفيلة">الطفيلة</option>
                            <option value="معان">معان</option>
                            <option value="العقبة">العقبة</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="age"
                            className="mb-2 block font-bold text-gray-800"
                          >
                            العمر
                          </label>

                          <input
                            id="age"
                            name="age"
                            required
                            type="number"
                            min={1}
                            max={120}
                            placeholder="أدخل العمر"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <p className="mb-3 font-bold text-gray-800">
                            هل سبق لك أداء فريضة الحج؟
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 font-bold transition hover:border-blue-400">
                              <input
                                required
                                type="radio"
                                name="performedHajj"
                                value="نعم"
                              />
                              نعم
                            </label>

                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 font-bold transition hover:border-blue-400">
                              <input
                                required
                                type="radio"
                                name="performedHajj"
                                value="لا"
                              />
                              لا
                            </label>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-2xl bg-blue-900 px-8 py-4 text-lg font-black text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {submitting
                              ? "جاري إرسال الطلب..."
                              : "إرسال طلب التسجيل"}
                          </button>

                          <p className="mt-3 text-center text-xs text-gray-500">
                            سيتم استخدام البيانات للتواصل معك بخصوص
                            الحج فقط.
                          </p>
                        </div>
                      </form>
                    )}
                  </div>
                ) : null}
              </motion.div>
            );
          })
        )}
      </div>
    </main>
  );
}