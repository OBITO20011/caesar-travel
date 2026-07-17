import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, ImagePlus, Loader2, Plus, Search, Trash2 } from "lucide-react";

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
import { imageService, visasService } from "@/services/admin";
import type { Visa } from "@/types/admin";

type VisaForm = {
  country: string;
  description: string;
  requirements: string;
  processing_time: string;
  price: string;
  currency: string;
  image_url: string;
  enabled: boolean;
  featured: boolean;
};

const emptyForm: VisaForm = {
  country: "",
  description: "",
  requirements: "",
  processing_time: "",
  price: "",
  currency: "JOD",
  image_url: "",
  enabled: true,
  featured: false,
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية.";
}

function formFromVisa(visa: Visa): VisaForm {
  return {
    country: visa.country,
    description: visa.description ?? "",
    requirements: visa.requirements ?? "",
    processing_time: visa.processing_time ?? "",
    price: visa.price?.toString() ?? "",
    currency: visa.currency,
    image_url: visa.image_url ?? "",
    enabled: visa.enabled,
    featured: visa.featured,
  };
}

function payloadFromForm(form: VisaForm): Omit<Visa, "id" | "created_at" | "updated_at"> {
  return {
    country: form.country.trim(),
    description: form.description.trim() || undefined,
    requirements: form.requirements.trim() || undefined,
    processing_time: form.processing_time.trim() || undefined,
    price: form.price ? Number(form.price) : undefined,
    currency: form.currency.trim().toUpperCase() || "JOD",
    image_url: form.image_url.trim() || undefined,
    enabled: form.enabled,
    featured: form.featured,
  };
}

export function VisaManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Visa | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<VisaForm>(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const visasQuery = useQuery({
    queryKey: ["admin-visas", search],
    queryFn: () => visasService.getAll({ search: search.trim() || undefined }),
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-visas"] });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = payloadFromForm(form);
      return editing ? visasService.update(editing.id, payload) : visasService.create(payload);
    },
    onSuccess: async () => {
      await refresh();
      setDialogOpen(false);
      setFeedback(editing ? "تم تحديث التأشيرة." : "تمت إضافة التأشيرة.");
    },
    onError: (error) => setFormError(errorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: visasService.delete,
    onSuccess: async () => {
      await refresh();
      setFeedback("تم حذف التأشيرة.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(visa: Visa) {
    setEditing(visa);
    setForm(formFromVisa(visa));
    setFormError(null);
    setDialogOpen(true);
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await imageService.uploadToStorage(file, "admin-media", "visas");
      setForm((current) => ({ ...current, image_url: url }));
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!form.country.trim()) {
      setFormError("اسم الدولة مطلوب.");
      return;
    }
    saveMutation.mutate();
  }

  const visas = visasQuery.data ?? [];

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
              خدمات السفر
            </Badge>
            <h1 className="text-3xl font-black text-slate-900">إدارة التأشيرات</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              إدارة الدول والمتطلبات ومدة المعالجة والأسعار وحالة ظهور الخدمة.
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            إضافة تأشيرة
          </Button>
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
          <CardContent className="p-5">
            <label className="relative block">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pr-9"
                placeholder="بحث بالدولة أو الوصف"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardContent className="p-0">
            {visasQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري تحميل التأشيرات...
              </div>
            ) : visasQuery.isError ? (
              <div className="p-8 text-center text-sm text-rose-600">
                {errorMessage(visasQuery.error)}
              </div>
            ) : visas.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">لا توجد تأشيرات مطابقة.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">الدولة</th>
                      <th className="px-5 py-4 font-medium">مدة المعالجة</th>
                      <th className="px-5 py-4 font-medium">السعر</th>
                      <th className="px-5 py-4 font-medium">الحالة</th>
                      <th className="px-5 py-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visas.map((visa) => (
                      <tr key={visa.id} className="text-slate-700">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 overflow-hidden rounded-xl bg-slate-100">
                              {visa.image_url ? (
                                <img
                                  src={visa.image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{visa.country}</p>
                              {visa.featured ? (
                                <span className="text-xs text-amber-600">مميزة</span>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">{visa.processing_time || "—"}</td>
                        <td className="px-5 py-4 font-semibold">
                          {visa.price ?? "—"} {visa.currency}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            className={
                              visa.enabled
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }
                          >
                            {visa.enabled ? "ظاهرة" : "مخفية"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => openEdit(visa)}>
                              <Edit3 className="h-4 w-4" />
                              تعديل
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-rose-600"
                              onClick={() => {
                                if (window.confirm(`حذف تأشيرة ${visa.country}؟`))
                                  deleteMutation.mutate(visa.id);
                              }}
                              aria-label="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>{editing ? "تعديل التأشيرة" : "إضافة تأشيرة"}</DialogTitle>
            <DialogDescription>حدّث تفاصيل خدمة التأشيرة ومتطلبات التقديم.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <Field label="الدولة">
              <Input
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
              />
            </Field>
            <Field label="الوصف">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </Field>
            <Field label="المتطلبات">
              <Textarea
                rows={4}
                value={form.requirements}
                onChange={(event) => setForm({ ...form, requirements: event.target.value })}
                placeholder="اكتب كل متطلب في سطر"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="مدة المعالجة">
                <Input
                  value={form.processing_time}
                  onChange={(event) => setForm({ ...form, processing_time: event.target.value })}
                  placeholder="5-7 أيام"
                />
              </Field>
              <Field label="السعر">
                <Input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </Field>
              <Field label="العملة">
                <Input
                  maxLength={3}
                  value={form.currency}
                  onChange={(event) => setForm({ ...form, currency: event.target.value })}
                />
              </Field>
            </div>
            <Field label="الصورة">
              <div className="flex gap-2">
                <Input
                  value={form.image_url}
                  onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                  placeholder="رابط الصورة"
                />
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  رفع
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => void uploadImage(event.target.files?.[0])}
                  />
                </label>
              </div>
            </Field>
            <div className="flex flex-wrap gap-5 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(event) => setForm({ ...form, enabled: event.target.checked })}
                />
                ظاهرة في الموقع
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                />
                تأشيرة مميزة
              </label>
            </div>
            {formError ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending || uploading}
                className="bg-slate-900 text-white"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}حفظ
                التأشيرة
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
