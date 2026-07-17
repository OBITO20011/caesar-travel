import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImagePlus, Loader2, Save } from "lucide-react";

import { CmsCollections } from "@/components/admin/cms-collections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { heroService, imageService, settingsService, statsService } from "@/services/admin";
import type { HeroSection, HomepageStats, WebsiteSettings } from "@/types/admin";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "تعذر حفظ الإعدادات.";
}

export function SettingsManager() {
  const settingsQuery = useQuery({ queryKey: ["admin-settings"], queryFn: settingsService.get });
  const heroQuery = useQuery({ queryKey: ["admin-hero"], queryFn: heroService.get });
  const statsQuery = useQuery({ queryKey: ["admin-home-stats"], queryFn: statsService.get });

  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [hero, setHero] = useState<Partial<HeroSection>>({});
  const [stats, setStats] = useState<Partial<HomepageStats>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<"logo" | "hero" | null>(null);

  useEffect(() => {
    if (settingsQuery.data) setSettings(settingsQuery.data);
  }, [settingsQuery.data]);
  useEffect(() => {
    if (heroQuery.data) setHero(heroQuery.data);
  }, [heroQuery.data]);
  useEffect(() => {
    if (statsQuery.data) setStats(statsQuery.data);
  }, [statsQuery.data]);

  const settingsMutation = useMutation({
    mutationFn: () => settingsService.update(settings),
    onSuccess: () => setFeedback("تم حفظ معلومات الشركة."),
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const heroMutation = useMutation({
    mutationFn: () => heroService.update(hero),
    onSuccess: () => setFeedback("تم حفظ محتوى الواجهة الرئيسية."),
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const statsMutation = useMutation({
    mutationFn: () => statsService.update(stats),
    onSuccess: () => setFeedback("تم حفظ إحصاءات الصفحة الرئيسية."),
    onError: (error) => setFeedback(errorMessage(error)),
  });

  const loading = settingsQuery.isLoading || heroQuery.isLoading || statsQuery.isLoading;
  const queryError = settingsQuery.error || heroQuery.error || statsQuery.error;

  async function uploadContentImage(file: File | undefined, field: "logo" | "hero") {
    if (!file) return;

    setUploadingField(field);
    setFeedback(null);
    try {
      const imageUrl = await imageService.uploadToStorage(file, "admin-media", "settings");

      if (field === "logo") {
        setSettings((current) => ({ ...current, logo_url: imageUrl }));
      } else {
        setHero((current) => ({ ...current, background_image_url: imageUrl }));
      }

      setFeedback("تم رفع الصورة. اضغط حفظ لتثبيت التغيير.");
    } catch (error) {
      setFeedback(errorMessage(error));
    } finally {
      setUploadingField(null);
    }
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
          <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
            نظام إدارة المحتوى
          </Badge>
          <h1 className="text-3xl font-black text-slate-900">إعدادات الموقع والمحتوى</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            تحديث معلومات الشركة والواجهة الرئيسية والإحصاءات والخدمات والمعرض وآراء العملاء
            والأسئلة الشائعة.
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

        {loading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جاري تحميل الإعدادات...
          </div>
        ) : queryError ? (
          <div className="rounded-2xl bg-rose-50 p-8 text-center text-sm text-rose-600">
            {errorMessage(queryError)}
          </div>
        ) : (
          <Tabs defaultValue="company" className="space-y-5">
            <TabsList className="h-auto w-full flex-wrap justify-start bg-white/90 p-2">
              <TabsTrigger value="company">معلومات الشركة</TabsTrigger>
              <TabsTrigger value="hero">الواجهة الرئيسية</TabsTrigger>
              <TabsTrigger value="stats">الإحصاءات</TabsTrigger>
              <TabsTrigger value="content">المحتوى الإضافي</TabsTrigger>
            </TabsList>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات التواصل والشركة</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      settingsMutation.mutate();
                    }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="اسم الشركة">
                        <Input
                          value={settings.company_name ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, company_name: event.target.value })
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
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="الهاتف الأول">
                        <Input
                          dir="ltr"
                          value={settings.phone1 ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, phone1: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="الهاتف الثاني">
                        <Input
                          dir="ltr"
                          value={settings.phone2 ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, phone2: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="الهاتف الثالث">
                        <Input
                          dir="ltr"
                          value={settings.phone3 ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, phone3: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="واتساب">
                        <Input
                          dir="ltr"
                          value={settings.whatsapp ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, whatsapp: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="ساعات العمل">
                        <Input
                          value={settings.working_hours ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, working_hours: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <Field label="العنوان">
                      <Input
                        value={settings.address ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, address: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="نبذة عن الشركة">
                      <Textarea
                        rows={4}
                        value={settings.about_text ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, about_text: event.target.value })
                        }
                      />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="رابط الشعار">
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
                      <Field label="رابط اتجاهات الخريطة">
                        <Input
                          dir="ltr"
                          value={settings.map_directions_url ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, map_directions_url: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <Field label="رابط تضمين الخريطة">
                      <Input
                        dir="ltr"
                        value={settings.map_embed_url ?? ""}
                        onChange={(event) =>
                          setSettings({ ...settings, map_embed_url: event.target.value })
                        }
                        placeholder="https://www.google.com/maps/embed?..."
                      />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Facebook">
                        <Input
                          dir="ltr"
                          value={settings.facebook ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, facebook: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="Instagram">
                        <Input
                          dir="ltr"
                          value={settings.instagram ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, instagram: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="TikTok">
                        <Input
                          dir="ltr"
                          value={settings.tiktok ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, tiktok: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="YouTube">
                        <Input
                          dir="ltr"
                          value={settings.youtube ?? ""}
                          onChange={(event) =>
                            setSettings({ ...settings, youtube: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <SaveButton loading={settingsMutation.isPending || uploadingField === "logo"}>
                      حفظ معلومات الشركة
                    </SaveButton>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>محتوى قسم البداية</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      heroMutation.mutate();
                    }}
                    className="grid gap-4"
                  >
                    <Field label="العنوان">
                      <Input
                        value={hero.title ?? ""}
                        onChange={(event) => setHero({ ...hero, title: event.target.value })}
                      />
                    </Field>
                    <Field label="العنوان الفرعي">
                      <Input
                        value={hero.subtitle ?? ""}
                        onChange={(event) => setHero({ ...hero, subtitle: event.target.value })}
                      />
                    </Field>
                    <Field label="الوصف">
                      <Textarea
                        rows={4}
                        value={hero.description ?? ""}
                        onChange={(event) => setHero({ ...hero, description: event.target.value })}
                      />
                    </Field>
                    <Field label="رابط صورة الخلفية">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          dir="ltr"
                          value={hero.background_image_url ?? ""}
                          onChange={(event) =>
                            setHero({ ...hero, background_image_url: event.target.value })
                          }
                        />
                        <UploadButton
                          loading={uploadingField === "hero"}
                          onChange={(file) => void uploadContentImage(file, "hero")}
                        />
                      </div>
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="نص الزر الرئيسي">
                        <Input
                          value={hero.cta_button_text ?? ""}
                          onChange={(event) =>
                            setHero({ ...hero, cta_button_text: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="رابط الزر الرئيسي">
                        <Input
                          dir="ltr"
                          value={hero.cta_button_link ?? ""}
                          onChange={(event) =>
                            setHero({ ...hero, cta_button_link: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="نص زر واتساب">
                        <Input
                          value={hero.whatsapp_button_text ?? ""}
                          onChange={(event) =>
                            setHero({ ...hero, whatsapp_button_text: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="نص الزر الثانوي">
                        <Input
                          value={hero.secondary_button_text ?? ""}
                          onChange={(event) =>
                            setHero({ ...hero, secondary_button_text: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="رابط الزر الثانوي">
                        <Input
                          dir="ltr"
                          value={hero.secondary_button_link ?? ""}
                          onChange={(event) =>
                            setHero({ ...hero, secondary_button_link: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <SaveButton loading={heroMutation.isPending || uploadingField === "hero"}>
                      حفظ الواجهة الرئيسية
                    </SaveButton>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>إحصاءات الصفحة الرئيسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      statsMutation.mutate();
                    }}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <Field label="سنوات الخبرة">
                      <Input
                        type="number"
                        min="0"
                        value={stats.years_experience ?? 0}
                        onChange={(event) =>
                          setStats({ ...stats, years_experience: Number(event.target.value) })
                        }
                      />
                    </Field>
                    <Field label="العملاء السعداء">
                      <Input
                        type="number"
                        min="0"
                        value={stats.happy_clients ?? 0}
                        onChange={(event) =>
                          setStats({ ...stats, happy_clients: Number(event.target.value) })
                        }
                      />
                    </Field>
                    <Field label="الرحلات المكتملة">
                      <Input
                        type="number"
                        min="0"
                        value={stats.trips_completed ?? 0}
                        onChange={(event) =>
                          setStats({ ...stats, trips_completed: Number(event.target.value) })
                        }
                      />
                    </Field>
                    <Field label="ساعات الدعم">
                      <Input
                        value={stats.support_hours ?? ""}
                        onChange={(event) =>
                          setStats({ ...stats, support_hours: event.target.value })
                        }
                      />
                    </Field>
                    <div className="md:col-span-2">
                      <SaveButton loading={statsMutation.isPending}>حفظ الإحصاءات</SaveButton>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <CmsCollections />
            </TabsContent>
          </Tabs>
        )}
      </div>
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

function SaveButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={loading} className="w-fit bg-slate-900 text-white">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {children}
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
        onChange={(event) => {
          onChange(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}
