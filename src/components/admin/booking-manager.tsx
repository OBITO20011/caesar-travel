import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingsService } from "@/services/admin";
import type { Booking, BookingStatus } from "@/types/admin";

const PAGE_SIZE = 10;

const statusLabels: Record<BookingStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
};

const statusClasses: Record<BookingStatus, string> = {
  new: "bg-amber-100 text-amber-700",
  contacted: "bg-sky-100 text-sky-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-slate-100 text-slate-700",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية.";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function BookingManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [status, setStatus] = useState<BookingStatus>("new");
  const [internalNotes, setInternalNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const bookingsQuery = useQuery({
    queryKey: ["admin-bookings", search, statusFilter, page],
    queryFn: () =>
      bookingsService.getAll(
        {
          search: search.trim() || undefined,
          status: statusFilter || undefined,
        },
        page,
        PAGE_SIZE,
      ),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      await bookingsService.updateStatus(editing.id, status);
      await bookingsService.addInternalNote(editing.id, internalNotes);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      setEditing(null);
      setFeedback("تم تحديث الطلب بنجاح.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  const bookings = bookingsQuery.data?.data ?? [];
  const count = bookingsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  function editBooking(booking: Booking) {
    setEditing(booking);
    setStatus(booking.status);
    setInternalNotes(booking.internal_notes ?? "");
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
          <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
            متابعة العملاء
          </Badge>
          <h1 className="text-3xl font-black text-slate-900">إدارة الطلبات والحجوزات</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            راجع طلبات الموقع والحجوزات المباشرة، حدّث حالة المتابعة، واحفظ ملاحظات الفريق الداخلية.
          </p>
        </header>

        {feedback ? (
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-right text-sm text-sky-700"
          >
            {feedback}
          </button>
        ) : null}

        <Card className="border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pr-9"
                placeholder="بحث بالاسم أو الهاتف أو البريد"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-input bg-white px-3 text-sm"
            >
              <option value="">كل الحالات</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="p-0">
            {bookingsQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري تحميل الطلبات...
              </div>
            ) : bookingsQuery.isError ? (
              <div className="p-8 text-center text-sm text-rose-600">
                {errorMessage(bookingsQuery.error)}
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">لا توجد طلبات مطابقة.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">العميل</th>
                      <th className="px-5 py-4 font-medium">الهاتف</th>
                      <th className="px-5 py-4 font-medium">الرحلة / الخدمة</th>
                      <th className="px-5 py-4 font-medium">الأشخاص</th>
                      <th className="px-5 py-4 font-medium">التاريخ</th>
                      <th className="px-5 py-4 font-medium">الحالة</th>
                      <th className="px-5 py-4 font-medium">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="text-slate-700">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{booking.customer_name}</p>
                          <p className="text-xs text-slate-500">{booking.customer_email || "—"}</p>
                        </td>
                        <td className="px-5 py-4" dir="ltr">
                          {booking.customer_phone}
                        </td>
                        <td className="px-5 py-4">{booking.trip_name || "طلب عام"}</td>
                        <td className="px-5 py-4">{booking.people_count}</td>
                        <td className="px-5 py-4">{formatDate(booking.booking_date)}</td>
                        <td className="px-5 py-4">
                          <Badge className={statusClasses[booking.status]}>
                            {statusLabels[booking.status]}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Button size="sm" variant="outline" onClick={() => editBooking(booking)}>
                            <Edit3 className="h-4 w-4" />
                            متابعة
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{count} طلب</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              السابق
            </Button>
            <span>
              صفحة {page} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>متابعة طلب {editing?.customer_name}</DialogTitle>
            <DialogDescription>
              غيّر حالة الطلب وأضف ملاحظات داخلية لا تظهر للعميل.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-700">الحالة</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as BookingStatus)}
                className="h-9 rounded-md border border-input bg-white px-3"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-700">ملاحظات داخلية</span>
              <Textarea
                rows={5}
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
              />
            </label>
            {editing?.notes ? (
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <span className="font-medium text-slate-800">ملاحظات العميل: </span>
                {editing.notes}
              </div>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                إلغاء
              </Button>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="bg-slate-900 text-white"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حفظ المتابعة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
