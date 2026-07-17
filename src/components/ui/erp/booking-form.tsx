import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type BookingFormState = {
  full_name: string;
  phone: string;
  service: string;
  destination: string;
  travel_date: string;
  notes: string;
};

const emptyForm: BookingFormState = {
  full_name: "",
  phone: "",
  service: "حج",
  destination: "مكة المكرمة",
  travel_date: "",
  notes: "",
};

export function DirectBookingForm() {
  const [form, setForm] = useState<BookingFormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: insertError } = await supabase.from("bookings").insert([
      {
        full_name: form.full_name,
        phone: form.phone,
        service: form.service,
        destination: form.destination,
        travel_date: form.travel_date || null,
        notes: form.notes,
        status: "new",
      },
    ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message || "تعذر إنشاء الحجز.");
      return;
    }

    setMessage("تم حفظ الحجز بنجاح وظهر في قائمة الطلبات.");
    setForm(emptyForm);
  }

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">إضافة حجز مباشر</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">الاسم الكامل</span>
              <input
                required
                value={form.full_name}
                onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                className="rounded-xl border border-input bg-background px-3 py-2"
                placeholder="مثال: أحمد محمد"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">رقم الهاتف</span>
              <input
                required
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="rounded-xl border border-input bg-background px-3 py-2"
                placeholder="مثال: 0795xxxxxx"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">الخدمة</span>
              <select
                value={form.service}
                onChange={(event) => setForm({ ...form, service: event.target.value })}
                className="rounded-xl border border-input bg-background px-3 py-2"
              >
                <option value="حج">حج</option>
                <option value="عمرة">عمرة</option>
                <option value="تأشيرة">تأشيرة</option>
                <option value="طيران">طيران</option>
                <option value="فندق">فندق</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">الوجهة</span>
              <input
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
                className="rounded-xl border border-input bg-background px-3 py-2"
                placeholder="مثال: مكة المكرمة"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">تاريخ السفر</span>
            <input
              type="date"
              value={form.travel_date}
              onChange={(event) => setForm({ ...form, travel_date: event.target.value })}
              className="rounded-xl border border-input bg-background px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">ملاحظات</span>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="rounded-xl border border-input bg-background px-3 py-2"
              placeholder="أي تفاصيل إضافية عن الحجز"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "جاري حفظ الحجز..." : "حفظ الحجز"}
          </button>

          {message ? <p className="text-sm text-green-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
