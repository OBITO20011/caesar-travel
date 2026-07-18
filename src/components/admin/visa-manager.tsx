import { useMemo, useState } from "react";
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
import type { Visa, VisaTypeOption } from "@/types/admin";

type VisaForm = {
  country_name: string;
  slug: string;
  headline: string;
  summary: string;
  description: string;
  price: string;
  currency: string;
  card_image_url: string;
  banner_image_url: string;
  visa_types: string;
  requirements: string;
  processing_time: string;
  validity: string;
  availability: string;
  notice: string;
  display_order: string;
  is_active: boolean;
};

function emptyForm(): VisaForm {
  return {
    country_name: "",
    slug: "",
    headline: "",
    summary: "",
    description: "",
    price: "",
    currency: "JOD",
    card_image_url: "",
    banner_image_url: "",
    visa_types: "",
    requirements: "",
    processing_time: "1 - 3 أيام عمل",
    validity: "حسب النوع",
    availability: "متاحة لمعظم الجنسيات",
    notice: "",
    display_order: "0",
    is_active: true,
  };
}

function typesToText(types: VisaTypeOption[]) {
  return types.map((item) => `${item.icon} | ${item.title} | ${item.description}`).join("\n");
}

function parseTypes(value: string): VisaTypeOption[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon = "📋", title = "", ...description] = line.split("|").map((part) => part.trim());
      return { icon, title, description: description.join(" | ") };
    })
    .filter((item) => item.title);
}

function formFromVisa(visa: Visa): VisaForm {
  return {
    country_name: visa.country_name,
    slug: visa.slug,
    headline: visa.headline,
    summary: visa.summary,
    description: visa.description,
    price: visa.price?.toString() ?? "",
    currency: visa.currency,
    card_image_url: visa.card_image_url ?? "",
    banner_image_url: visa.banner_image_url ?? "",
    visa_types: typesToText(visa.visa_types ?? []),
    requirements: (visa.requirements ?? []).join("\n"),
    processing_time: visa.processing_time,
    validity: visa.validity,
    availability: visa.availability,
    notice: visa.notice ?? "",
    display_order: visa.display_order.toString(),
    is_active: visa.is_active,
  };
}

function toPayload(form: VisaForm): Omit<Visa, "id" | "created_at" | "updated_at"> {
  return {
    country_name: form.country_name.trim(),
    slug: form.slug.trim().toLowerCase(),
    headline: form.headline.trim(),
    summary: form.summary.trim(),
    description: form.description.trim(),
    price: form.price ? Number(form.price) : undefined,
    currency: form.currency.trim().toUpperCase() || "JOD",
    card_image_url: form.card_image_url.trim() || undefined,
    banner_image_url: form.banner_image_url.trim() || undefined,
    visa_types: parseTypes(form.visa_types),
    requirements: form.requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    processing_time: form.processing_time.trim(),
    validity: form.validity.trim(),
    availability: form.availability.trim(),
    notice: form.notice.trim() || undefined,
    display_order: Number(form.display_order) || 0,
    is_active: form.is_active,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية. حاول مرة أخرى.";
}

function formatPrice(visa: Visa) {
  if (visa.price === undefined || visa.price === null) return "تواصل معنا";

  return new Intl.NumberFormat("ar-JO", {
    style: "currency",
    currency: visa.currency || "JOD",
    maximumFractionDigits: 2,
  }).format(visa.price);
}

export function VisaManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);
  const [form, setForm] = useState<VisaForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const visasQuery = useQuery({
    queryKey: ["admin-visas"],
    queryFn: visasService.getAll,
  });

  const refreshVisas = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-visas"] });
    await queryClient.invalidateQueries({ queryKey: ["public-visas"] });
    await queryClient.invalidateQueries({ queryKey: ["public-visa"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = toPayload(form);
      return editingVisa
        ? visasService.update(editingVisa.id, payload)
        : visasService.create(payload);
    },
    onSuccess: async () => {
      await refreshVisas();
      setDialogOpen(false);
      setFeedback(editingVisa ? "تم تحديث التأشيرة بنجاح." : "تمت إضافة التأشيرة بنجاح.");
      setEditingVisa(null);
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: visasService.delete,
    onSuccess: async () => {
      await refreshVisas();
      setFeedback("تم حذف التأشيرة.");
    },
    onError: (error) => setFeedback(getErrorMessage(error)),
  });

  const visas = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("ar");
    const items = visasQuery.data ?? [];
    if (!normalizedSearch) return items;

    return items.filter(
      (visa) =>
        visa.country_name.toLocaleLowerCase("ar").includes(normalizedSearch) ||
        visa.headline.toLocaleLowerCase("ar").includes(normalizedSearch) ||
        visa.slug.toLowerCase().includes(normalizedSearch),
    );
  }, [search, visasQuery.data]);

  function openCreateDialog() {
    setEditingVisa(null);
    setForm(emptyForm());
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(visa: Visa) {
    setEditingVisa(visa);
    setForm(formFromVisa(visa));
    setFormError(null);
    setDialogOpen(true);
  }

  async function uploadImage(file: File | undefined, field: "card_image_url" | "banner_image_url") {
    if (!file) return;

    setUploading(true);
    setFormError(null);
    try {
      const url = await imageService.uploadToStorage(file, "admin-media", "visas");
      setForm((current) => ({ ...current, [field]: url }));
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.country_name.trim() || !form.slug.trim() || !form.headline.trim()) {
      setFormError("اسم الدولة والرابط وعنوان الصفحة مطلوبة.");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(form.slug.trim())) {
      setFormError("الرابط المختصر يقبل حروفاً إنجليزية وأرقاماً وشرطة فقط.");
      return;
    }

    saveMutation.mutate();
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
              إدارة المحتوى
            </Badge>
            <h1 className="text-3xl font-black text-slate-900">إدارة التأشيرات</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              عدّل الدول والأسعار والصور والأنواع والمتطلبات وحالة الظهور.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
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
            className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right text-sm text-emerald-700"
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
                placeholder="بحث بالدولة أو عنوان التأشيرة"
                className="pr-9"
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
                {getErrorMessage(visasQuery.error)}
              </div>
            ) : visas.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">لا توجد تأشيرات مطابقة.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">الدولة</th>
                      <th className="px-5 py-4 font-medium">السعر</th>
                      <th className="px-5 py-4 font-medium">الترتيب</th>
                      <th className="px-5 py-4 font-medium">الحالة</th>
                      <th className="px-5 py-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visas.map((visa) => (
                      <tr key={visa.id} className="text-slate-700">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-14 overflow-hidden rounded-xl bg-slate-100">
                              {visa.card_image_url ? (
                                <img
                                  src={visa.card_image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{visa.country_name}</p>
                              <p className="text-xs text-slate-500">/{visa.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">{formatPrice(visa)}</td>
                        <td className="px-5 py-4">{visa.display_order}</td>
                        <td className="px-5 py-4">
                          <Badge
                            className={
                              visa.is_active
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                            }
                          >
                            {visa.is_active ? "ظاهرة" : "مخفية"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => openEditDialog(visa)}
                              aria-label={`تعديل ${visa.country_name}`}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                if (window.confirm(`هل تريد حذف تأشيرة ${visa.country_name}؟`)) {
                                  deleteMutation.mutate(visa.id);
                                }
                              }}
                              aria-label={`حذف ${visa.country_name}`}
                              className="text-rose-600 hover:text-rose-700"
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
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingVisa ? "تعديل التأشيرة" : "إضافة تأشيرة"}</DialogTitle>
            <DialogDescription>
              هذه البيانات تظهر مباشرة في صفحة التأشيرات وصفحة الدولة.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="اسم الدولة" required>
                <Input
                  value={form.country_name}
                  onChange={(event) => setForm({ ...form, country_name: event.target.value })}
                />
              </Field>
              <Field label="الرابط المختصر بالإنجليزية" required>
                <Input
                  dir="ltr"
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                  placeholder="saudi"
                />
              </Field>
            </div>
            <Field label="عنوان الصفحة" required>
              <Input
                value={form.headline}
                onChange={(event) => setForm({ ...form, headline: event.target.value })}
              />
            </Field>
            <Field label="الوصف المختصر في بطاقة الدولة">
              <Input
                value={form.summary}
                onChange={(event) => setForm({ ...form, summary: event.target.value })}
              />
            </Field>
            <Field label="وصف التأشيرة">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="السعر">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  placeholder="اتركه فارغاً للتواصل"
                />
              </Field>
              <Field label="العملة">
                <Input
                  maxLength={3}
                  value={form.currency}
                  onChange={(event) => setForm({ ...form, currency: event.target.value })}
                />
              </Field>
              <Field label="ترتيب العرض">
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(event) => setForm({ ...form, display_order: event.target.value })}
                />
              </Field>
            </div>
            <ImageField
              label="صورة بطاقة الدولة"
              value={form.card_image_url}
              uploading={uploading}
              onChange={(value) => setForm({ ...form, card_image_url: value })}
              onUpload={(file) => void uploadImage(file, "card_image_url")}
            />
            <ImageField
              label="صورة واجهة صفحة الدولة"
              value={form.banner_image_url}
              uploading={uploading}
              onChange={(value) => setForm({ ...form, banner_image_url: value })}
              onUpload={(file) => void uploadImage(file, "banner_image_url")}
            />
            <Field label="أنواع التأشيرات">
              <Textarea
                rows={7}
                value={form.visa_types}
                onChange={(event) => setForm({ ...form, visa_types: event.target.value })}
                placeholder="🧳 | التأشيرة السياحية | وصف التأشيرة (نوع واحد في كل سطر)"
              />
            </Field>
            <Field label="المستندات المطلوبة">
              <Textarea
                rows={6}
                value={form.requirements}
                onChange={(event) => setForm({ ...form, requirements: event.target.value })}
                placeholder="مستند واحد في كل سطر"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="مدة الإنجاز">
                <Input
                  value={form.processing_time}
                  onChange={(event) => setForm({ ...form, processing_time: event.target.value })}
                />
              </Field>
              <Field label="صلاحية التأشيرة">
                <Input
                  value={form.validity}
                  onChange={(event) => setForm({ ...form, validity: event.target.value })}
                />
              </Field>
              <Field label="الجنسيات المتاحة">
                <Input
                  value={form.availability}
                  onChange={(event) => setForm({ ...form, availability: event.target.value })}
                />
              </Field>
            </div>
            <Field label="شريط إعلان اختياري">
              <Textarea
                rows={2}
                value={form.notice}
                onChange={(event) => setForm({ ...form, notice: event.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
                className="h-4 w-4 rounded border-slate-300"
              />
              إظهار التأشيرة في الموقع
            </label>
            {formError ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending || uploading}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حفظ التأشيرة
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function ImageField({
  label,
  value,
  uploading,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file?: File) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="رابط الصورة أو ارفع ملفاً"
        />
        <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium hover:bg-slate-50">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          رفع صورة
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(event) => onUpload(event.target.files?.[0])}
          />
        </label>
      </div>
    </Field>
  );
}
