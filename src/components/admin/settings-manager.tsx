import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { imageService, siteSettingsService } from "@/services/admin";
import type { SiteSettings } from "@/types/admin";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر حفظ الإعدادات.";
}

export function SettingsManager() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: siteSettingsService.get,
  });
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<"logo" | "hero" | null>(null);

  useEffect(() => {
    if (settingsQuery.data) setSettings(settingsQuery.data);
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () => siteSettingsService.update(settings),
    onSuccess: (saved) => {
      setSettings(saved);
      queryClient.setQueryData(["admin-site-settings"], saved);
      queryClient.setQueryData(["site-settings"], saved);
      setFeedback("تم حفظ إعدادات الموقع.");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  async function uploadContentImage(file: File | undefined, field: "logo" | "hero") {
    if (!file) return;

    setUploadingField(field);
    setFeedback(null);
    try {
      const imageUrl = await imageService.uploadToStorage(file, "admin-media", "settings");
      setSettings((current) =>
        field === "logo"
          ? { ...current, logo_url: imageUrl }
          : { ...current, hero_image_url: imageUrl },
      );
      setFeedback("تم رفع الصورة. اضغط حفظ لتثبيت التغيير.");
    } catch (error) {
      setFeedback(errorMessage(error));
    } finally {
      setUploadingField(null);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveMutation.mutate();
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
          <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
            إدارة المحتوى
          </Badge>
          <h1 className="text-3xl font-black text-slate-900">إعدادات الموقع</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            حدّث الواجهة الرئيسية والشعار ومعلومات التواصل وإحصاءات الصفحة الرئيسية.
          </p>
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

        {settingsQuery.isLoading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جاري تحميل الإعدادات...
          </div>
        ) : settingsQuery.isError ? (
          <div className="rounded-2xl bg-rose-50 p-8 text-center text-sm text-rose-600">
            {errorMessage(settingsQuery.error)}
          </div>
        ) : (
          <Tabs defaultValue="hero" className="space-y-5">
            <TabsList className="h-auto w-full flex-wrap justify-start bg-white/90 p-2">
              <TabsTrigger value="hero">الواجهة الرئيسية</TabsTrigger>
              <TabsTrigger value="contact">التواصل والشعار</TabsTrigger>
              <TabsTrigger value="stats">الإحصاءات</TabsTrigger>
            </TabsList>

            <TabsContent value="hero">
              <SettingsCard title="الواجهة الرئيسية">
                <form onSubmit={submit} className="grid gap-4">
                  <Field label="عنوان الواجهة">
                    <Input
                      value={settings.hero_title ?? ""}
                      onChange={(event) =>
                        setSettings({ ...settings, hero_title: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="العنوان الفرعي">
                    <Input
                      value={settings.hero_subtitle ?? ""}
                      onChange={(event) =>
                        setSettings({ ...settings, hero_subtitle: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="صورة الخلفية">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        dir="ltr"
                        value={settings.hero_image_url ?? ""}
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            hero_image_url: event.target.value,
                          })
                        }
                      />
                      <UploadButton
                        loading={uploadingField === "hero"}
                        onChange={(file) => void uploadContentImage(file, "hero")}
                      />
                    </div>
                  </Field>
                  <SaveButton loading={saveMutation.isPending || uploadingField === "hero"} />
                </form>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="contact">
              <SettingsCard title="الشعار ومعلومات التواصل">
                <form onSubmit={submit} className="grid gap-4">
                  <Field label="اسم الشركة">
                    <Input
                      value={settings.company_name ?? ""}
                      onChange={(event) =>
                        setSettings({ ...settings, company_name: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="الشعار">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        dir="ltr"
                        value={settings.logo_url ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, logo_url: event.target.value })
                        }
                      />
                      <UploadButton
                        loading={uploadingField === "logo"}
                        onChange={(file) => void uploadContentImage(file, "logo")}
                      />
                    </div>
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="رقم واتساب">
                      <Input
                        dir="ltr"
                        value={settings.whatsapp ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, whatsapp: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="رقم الهاتف">
                      <Input
                        dir="ltr"
                        value={settings.phone ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, phone: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="البريد الإلكتروني">
                      <Input
                        type="email"
                        dir="ltr"
                        value={settings.email ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, email: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="العنوان">
                      <Input
                        value={settings.address ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, address: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="رابط تضمين الخريطة">
                      <Input
                        dir="ltr"
                        value={settings.map_embed_url ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, map_embed_url: event.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <SaveButton loading={saveMutation.isPending || uploadingField === "logo"} />
                </form>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="stats">
              <SettingsCard title="إحصاءات الصفحة الرئيسية">
                <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                  <Field label="سنوات الخبرة">
                    <NumberInput
                      value={settings.years_experience}
                      onChange={(value) => setSettings({ ...settings, years_experience: value })}
                    />
                  </Field>
                  <Field label="العملاء السعداء">
                    <NumberInput
                      value={settings.happy_customers}
                      onChange={(value) => setSettings({ ...settings, happy_customers: value })}
                    />
                  </Field>
                  <Field label="الرحلات المكتملة">
                    <NumberInput
                      value={settings.completed_trips}
                      onChange={(value) => setSettings({ ...settings, completed_trips: value })}
                    />
                  </Field>
                  <Field label="ساعات الدعم">
                    <Input
                      value={settings.support_hours ?? ""}
                      onChange={(event) =>
                        setSettings({ ...settings, support_hours: event.target.value })
                      }
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <SaveButton loading={saveMutation.isPending} />
                  </div>
                </form>
              </SettingsCard>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
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

function NumberInput({ value, onChange }: { value?: number; onChange: (value: number) => void }) {
  return (
    <Input
      type="number"
      min="0"
      value={value ?? 0}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

function SaveButton({ loading }: { loading: boolean }) {
  return (
    <Button type="submit" disabled={loading} className="w-fit bg-slate-900 text-white">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      حفظ الإعدادات
    </Button>
  );
}

function UploadButton({
  loading,
  onChange,
}: {
  loading: boolean;
  onChange: (file?: File) => void;
}) {
  return (
    <label className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium hover:bg-slate-50">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      رفع صورة
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={loading}
        onChange={(event) => onChange(event.target.files?.[0])}
      />
    </label>
  );
}
