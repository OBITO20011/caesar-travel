import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";

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
import { galleryService, imageService } from "@/services/admin";
import type { GalleryImage } from "@/types/admin";

type GalleryForm = {
  title: string;
  image_url: string;
  display_order: string;
};

const emptyForm: GalleryForm = {
  title: "",
  image_url: "",
  display_order: "0",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر إكمال العملية.";
}

export function GalleryManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const galleryQuery = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: galleryService.getAll,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        title: form.title.trim(),
        image_url: form.image_url.trim(),
        display_order: Number(form.display_order) || 0,
      };

      return editing ? galleryService.update(editing.id, payload) : galleryService.create(payload);
    },
    onSuccess: async () => {
      await refresh();
      setDialogOpen(false);
      setFeedback(editing ? "تم تحديث صورة المعرض." : "تمت إضافة صورة المعرض.");
      setEditing(null);
    },
    onError: (error) => setFormError(errorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: galleryService.delete,
    onSuccess: async () => {
      await refresh();
      setFeedback("تم حذف صورة المعرض.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(image: GalleryImage) {
    setEditing(image);
    setForm({
      title: image.title,
      image_url: image.image_url,
      display_order: String(image.display_order),
    });
    setFormError(null);
    setDialogOpen(true);
  }

  async function uploadImage(file?: File) {
    if (!file) return;

    setUploading(true);
    setFormError(null);
    try {
      const imageUrl = await imageService.uploadToStorage(file, "admin-media", "gallery");
      setForm((current) => ({ ...current, image_url: imageUrl }));
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.image_url.trim()) {
      setFormError("العنوان والصورة مطلوبان.");
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
            <h1 className="text-3xl font-black text-slate-900">معرض الصور</h1>
            <p className="mt-2 text-sm text-slate-600">
              أضف صور الموقع أو استبدلها وعدّل عناوينها وترتيب ظهورها.
            </p>
          </div>
          <Button onClick={openCreate} className="rounded-full bg-slate-900 text-white">
            <Plus className="h-4 w-4" />
            إضافة صورة
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

        {galleryQuery.isLoading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جاري تحميل المعرض...
          </div>
        ) : galleryQuery.isError ? (
          <div className="rounded-2xl bg-rose-50 p-8 text-center text-sm text-rose-600">
            {errorMessage(galleryQuery.error)}
          </div>
        ) : galleryQuery.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryQuery.data.map((image) => (
              <Card key={image.id} className="overflow-hidden border-none bg-white/90 shadow-lg">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{image.title}</p>
                    <p className="text-xs text-slate-500">الترتيب: {image.display_order}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(image)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-600"
                      onClick={() => {
                        if (window.confirm(`حذف ${image.title}؟`)) {
                          deleteMutation.mutate(image.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white/70 p-12 text-center text-sm text-slate-500">
            لم تتم إضافة صور إلى المعرض بعد.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle>{editing ? "تعديل صورة المعرض" : "إضافة صورة للمعرض"}</DialogTitle>
            <DialogDescription>
              {editing ? "يمكنك استبدال الصورة وتحديث بياناتها." : "أدخل عنوان الصورة وارفعها."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <Field label="العنوان">
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </Field>
            <Field label="الصورة">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={form.image_url}
                  onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                  placeholder="رابط الصورة أو ارفع ملفاً"
                  required
                />
                <label className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium hover:bg-slate-50">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  {editing ? "استبدال الصورة" : "رفع صورة"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(event) => void uploadImage(event.target.files?.[0])}
                  />
                </label>
              </div>
            </Field>
            <Field label="ترتيب العرض">
              <Input
                type="number"
                value={form.display_order}
                onChange={(event) => setForm({ ...form, display_order: event.target.value })}
              />
            </Field>
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
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حفظ
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
