import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  faqService,
  galleryService,
  imageService,
  servicesService,
  testimonialsService,
} from "@/services/admin";
import type { FAQ, GalleryImage, Service, Testimonial } from "@/types/admin";

type CollectionKind = "service" | "gallery" | "testimonial" | "faq";
type FormValue = string | number | boolean;
type Editor = {
  kind: CollectionKind;
  id?: string;
  form: Record<string, FormValue>;
};

const titles: Record<CollectionKind, string> = {
  service: "الخدمة",
  gallery: "صورة المعرض",
  testimonial: "رأي العميل",
  faq: "السؤال الشائع",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية.";
}

function emptyEditor(kind: CollectionKind): Editor {
  const forms: Record<CollectionKind, Record<string, FormValue>> = {
    service: { title: "", description: "", icon_name: "Compass", display_order: 0 },
    gallery: {
      image_url: "",
      title: "",
      destination: "",
      description: "",
      display_order: 0,
      enabled: true,
      link: "",
    },
    testimonial: {
      customer_name: "",
      photo_url: "",
      comment: "",
      rating: 5,
      display_order: 0,
    },
    faq: { question: "", answer: "", sort_order: 0 },
  };
  return { kind, form: forms[kind] };
}

function editorFromItem(
  kind: CollectionKind,
  item: Service | GalleryImage | Testimonial | FAQ,
): Editor {
  if (kind === "service") {
    const service = item as Service;
    return {
      kind,
      id: service.id,
      form: {
        title: service.title,
        description: service.description ?? "",
        icon_name: service.icon_name,
        display_order: service.display_order,
      },
    };
  }
  if (kind === "gallery") {
    const image = item as GalleryImage;
    return {
      kind,
      id: image.id,
      form: {
        image_url: image.image_url,
        title: image.title,
        destination: image.destination ?? "",
        description: image.description ?? "",
        display_order: image.display_order,
        enabled: image.enabled,
        link: image.link ?? "",
      },
    };
  }
  if (kind === "testimonial") {
    const testimonial = item as Testimonial;
    return {
      kind,
      id: testimonial.id,
      form: {
        customer_name: testimonial.customer_name,
        photo_url: testimonial.photo_url ?? "",
        comment: testimonial.comment,
        rating: testimonial.rating,
        display_order: testimonial.display_order,
      },
    };
  }
  const faq = item as FAQ;
  return {
    kind,
    id: faq.id,
    form: { question: faq.question, answer: faq.answer, sort_order: faq.sort_order },
  };
}

export function CmsCollections() {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const servicesQuery = useQuery({ queryKey: ["admin-services"], queryFn: servicesService.getAll });
  const galleryQuery = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => galleryService.getAll(1, 100),
  });
  const testimonialsQuery = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: testimonialsService.getAll,
  });
  const faqQuery = useQuery({ queryKey: ["admin-faq"], queryFn: faqService.getAll });

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-services"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-faq"] }),
    ]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editor) return;
      const form = editor.form;

      if (editor.kind === "service") {
        const payload = {
          title: String(form.title).trim(),
          description: String(form.description).trim() || undefined,
          icon_name: String(form.icon_name).trim() || "Compass",
          display_order: Number(form.display_order) || 0,
        };
        return editor.id
          ? servicesService.update(editor.id, payload)
          : servicesService.create(payload);
      }
      if (editor.kind === "gallery") {
        const payload = {
          image_url: String(form.image_url).trim(),
          title: String(form.title).trim(),
          destination: String(form.destination).trim() || undefined,
          description: String(form.description).trim() || undefined,
          display_order: Number(form.display_order) || 0,
          enabled: Boolean(form.enabled),
          link: String(form.link).trim() || undefined,
        };
        return editor.id
          ? galleryService.update(editor.id, payload)
          : galleryService.create(payload);
      }
      if (editor.kind === "testimonial") {
        const payload = {
          customer_name: String(form.customer_name).trim(),
          photo_url: String(form.photo_url).trim() || undefined,
          comment: String(form.comment).trim(),
          rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
          display_order: Number(form.display_order) || 0,
        };
        return editor.id
          ? testimonialsService.update(editor.id, payload)
          : testimonialsService.create(payload);
      }

      const payload = {
        question: String(form.question).trim(),
        answer: String(form.answer).trim(),
        sort_order: Number(form.sort_order) || 0,
      };
      return editor.id ? faqService.update(editor.id, payload) : faqService.create(payload);
    },
    onSuccess: async () => {
      await refresh();
      setFeedback("تم حفظ المحتوى بنجاح.");
      setEditor(null);
    },
    onError: (error) => setFormError(errorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ kind, id }: { kind: CollectionKind; id: string }) => {
      if (kind === "service") return servicesService.delete(id);
      if (kind === "gallery") return galleryService.delete(id);
      if (kind === "testimonial") return testimonialsService.delete(id);
      return faqService.delete(id);
    },
    onSuccess: async () => {
      await refresh();
      setFeedback("تم حذف المحتوى.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  function setValue(key: string, value: FormValue) {
    setEditor((current) =>
      current ? { ...current, form: { ...current.form, [key]: value } } : current,
    );
  }

  function openCreate(kind: CollectionKind) {
    setFormError(null);
    setEditor(emptyEditor(kind));
  }

  function openEdit(kind: CollectionKind, item: Service | GalleryImage | Testimonial | FAQ) {
    setFormError(null);
    setEditor(editorFromItem(kind, item));
  }

  function remove(kind: CollectionKind, id: string, label: string) {
    if (window.confirm(`حذف ${label}؟`)) deleteMutation.mutate({ kind, id });
  }

  async function uploadGalleryImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await imageService.uploadToStorage(file, "admin-media", "gallery");
      setValue("image_url", url);
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    saveMutation.mutate();
  }

  const loading =
    servicesQuery.isLoading ||
    galleryQuery.isLoading ||
    testimonialsQuery.isLoading ||
    faqQuery.isLoading;

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
        جاري تحميل محتوى الموقع...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {feedback ? (
        <button
          type="button"
          onClick={() => setFeedback(null)}
          className="w-full rounded-xl bg-emerald-50 px-4 py-3 text-right text-sm text-emerald-700"
        >
          {feedback}
        </button>
      ) : null}

      <CollectionCard title="الخدمات" onAdd={() => openCreate("service")}>
        {(servicesQuery.data ?? []).map((service) => (
          <CollectionRow
            key={service.id}
            title={service.title}
            subtitle={`${service.icon_name} · ترتيب ${service.display_order}`}
            onEdit={() => openEdit("service", service)}
            onDelete={() => remove("service", service.id, service.title)}
          />
        ))}
      </CollectionCard>

      <CollectionCard title="معرض الصور" onAdd={() => openCreate("gallery")}>
        {(galleryQuery.data?.data ?? []).map((image) => (
          <CollectionRow
            key={image.id}
            title={image.title}
            subtitle={image.destination || "بدون وجهة"}
            image={image.image_url}
            badge={image.enabled ? "ظاهرة" : "مخفية"}
            onEdit={() => openEdit("gallery", image)}
            onDelete={() => remove("gallery", image.id, image.title)}
          />
        ))}
      </CollectionCard>

      <CollectionCard title="آراء العملاء" onAdd={() => openCreate("testimonial")}>
        {(testimonialsQuery.data ?? []).map((testimonial) => (
          <CollectionRow
            key={testimonial.id}
            title={testimonial.customer_name}
            subtitle={testimonial.comment}
            badge={`${testimonial.rating}/5`}
            onEdit={() => openEdit("testimonial", testimonial)}
            onDelete={() => remove("testimonial", testimonial.id, testimonial.customer_name)}
          />
        ))}
      </CollectionCard>

      <CollectionCard title="الأسئلة الشائعة" onAdd={() => openCreate("faq")}>
        {(faqQuery.data ?? []).map((faq) => (
          <CollectionRow
            key={faq.id}
            title={faq.question}
            subtitle={faq.answer}
            onEdit={() => openEdit("faq", faq)}
            onDelete={() => remove("faq", faq.id, faq.question)}
          />
        ))}
      </CollectionCard>

      <Dialog open={Boolean(editor)} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>
              {editor?.id ? "تعديل" : "إضافة"} {editor ? titles[editor.kind] : "محتوى"}
            </DialogTitle>
          </DialogHeader>
          {editor ? (
            <form onSubmit={submit} className="grid gap-4">
              <EditorFields
                editor={editor}
                setValue={setValue}
                uploading={uploading}
                uploadGalleryImage={uploadGalleryImage}
              />
              {formError ? (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditor(null)}>
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={saveMutation.isPending || uploading}
                  className="bg-slate-900 text-white"
                >
                  {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  حفظ
                </Button>
              </div>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CollectionCard({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          إضافة
        </Button>
      </CardHeader>
      <CardContent className="grid gap-2">{children}</CardContent>
    </Card>
  );
}

function CollectionRow({
  title,
  subtitle,
  image,
  badge,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  image?: string;
  badge?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {image ? <img src={image} alt="" className="h-12 w-16 rounded-lg object-cover" /> : null}
        <div className="min-w-0">
          <p className="font-medium text-slate-900">{title}</p>
          <p className="line-clamp-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={onEdit} aria-label="تعديل">
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-rose-600"
          onClick={onDelete}
          aria-label="حذف"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function EditorFields({
  editor,
  setValue,
  uploading,
  uploadGalleryImage,
}: {
  editor: Editor;
  setValue: (key: string, value: FormValue) => void;
  uploading: boolean;
  uploadGalleryImage: (file?: File) => Promise<void>;
}) {
  const form = editor.form;
  if (editor.kind === "service") {
    return (
      <>
        <Field label="العنوان">
          <Input
            value={String(form.title)}
            onChange={(event) => setValue("title", event.target.value)}
            required
          />
        </Field>
        <Field label="الوصف">
          <Textarea
            rows={4}
            value={String(form.description)}
            onChange={(event) => setValue("description", event.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الأيقونة">
            <Input
              value={String(form.icon_name)}
              onChange={(event) => setValue("icon_name", event.target.value)}
            />
          </Field>
          <Field label="الترتيب">
            <Input
              type="number"
              value={Number(form.display_order)}
              onChange={(event) => setValue("display_order", Number(event.target.value))}
            />
          </Field>
        </div>
      </>
    );
  }
  if (editor.kind === "gallery") {
    return (
      <>
        <Field label="العنوان">
          <Input
            value={String(form.title)}
            onChange={(event) => setValue("title", event.target.value)}
            required
          />
        </Field>
        <Field label="الصورة">
          <div className="flex gap-2">
            <Input
              value={String(form.image_url)}
              onChange={(event) => setValue("image_url", event.target.value)}
              required
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
                onChange={(event) => void uploadGalleryImage(event.target.files?.[0])}
              />
            </label>
          </div>
        </Field>
        <Field label="الوجهة">
          <Input
            value={String(form.destination)}
            onChange={(event) => setValue("destination", event.target.value)}
          />
        </Field>
        <Field label="الوصف">
          <Textarea
            rows={3}
            value={String(form.description)}
            onChange={(event) => setValue("description", event.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الرابط">
            <Input
              value={String(form.link)}
              onChange={(event) => setValue("link", event.target.value)}
            />
          </Field>
          <Field label="الترتيب">
            <Input
              type="number"
              value={Number(form.display_order)}
              onChange={(event) => setValue("display_order", Number(event.target.value))}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.enabled)}
            onChange={(event) => setValue("enabled", event.target.checked)}
          />
          ظاهرة في الموقع
        </label>
      </>
    );
  }
  if (editor.kind === "testimonial") {
    return (
      <>
        <Field label="اسم العميل">
          <Input
            value={String(form.customer_name)}
            onChange={(event) => setValue("customer_name", event.target.value)}
            required
          />
        </Field>
        <Field label="رابط الصورة">
          <Input
            value={String(form.photo_url)}
            onChange={(event) => setValue("photo_url", event.target.value)}
          />
        </Field>
        <Field label="التعليق">
          <Textarea
            rows={4}
            value={String(form.comment)}
            onChange={(event) => setValue("comment", event.target.value)}
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="التقييم">
            <Input
              type="number"
              min="1"
              max="5"
              value={Number(form.rating)}
              onChange={(event) => setValue("rating", Number(event.target.value))}
            />
          </Field>
          <Field label="الترتيب">
            <Input
              type="number"
              value={Number(form.display_order)}
              onChange={(event) => setValue("display_order", Number(event.target.value))}
            />
          </Field>
        </div>
      </>
    );
  }
  return (
    <>
      <Field label="السؤال">
        <Input
          value={String(form.question)}
          onChange={(event) => setValue("question", event.target.value)}
          required
        />
      </Field>
      <Field label="الإجابة">
        <Textarea
          rows={5}
          value={String(form.answer)}
          onChange={(event) => setValue("answer", event.target.value)}
          required
        />
      </Field>
      <Field label="الترتيب">
        <Input
          type="number"
          value={Number(form.sort_order)}
          onChange={(event) => setValue("sort_order", Number(event.target.value))}
        />
      </Field>
    </>
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
