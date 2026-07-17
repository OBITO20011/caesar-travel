import { DirectBookingForm } from "@/components/ui/erp/booking-form";
import { TravelProgramShowcase } from "@/components/ui/erp/travel-program-showcase";
import { withAdminAuth } from "@/components/admin/admin-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  bookingsService,
  employeesService,
  hotelsService,
  notificationsService,
  tripsService,
  visasService,
} from "@/services/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  Hotel,
  Layers3,
  LayoutTemplate,
  MapPinned,
  Plane,
  Receipt,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard/")({
  component: withAdminAuth(AdminHome),
});

const actionCards = [
  { title: "إضافة رحلة جديدة", description: "إنشاء رحلة جديدة", icon: Plane, href: "/admin/trips" },
  { title: "إضافة تأشيرة", description: "إدارة متطلبات التأشيرة", icon: Ticket, href: "/admin/visa" },
  { title: "إضافة فندق", description: "إدارة الفنادق والصور", icon: Hotel, href: "/admin/hotels" },
  { title: "إضافة باقة", description: "باقات الحج والعمرة", icon: Sparkles, href: "/admin/umrah" },
  { title: "إدارة الموظفين", description: "الحسابات والأدوار والصلاحيات", icon: Users, href: "/admin/users" },
  { title: "إنشاء حجز", description: "حجز مباشر من الموظف", icon: CalendarClock, href: "/admin/dashboard" },
];

const managementSections = [
  {
    title: "إدارة الموقع",
    items: [
      "تغيير البانر الرئيسي",
      "تغيير صور الهيرو",
      "تغيير شعار الشركة",
      "تعديل معلومات الشركة",
      "تعديل أقسام الصفحة الرئيسية",
      "تعديل التواصل الاجتماعي",
    ],
    icon: LayoutTemplate,
  },
  {
    title: "إدارة الدول والبرامج",
    items: [
      "إضافة دولة",
      "تعديل دولة",
      "حذف دولة",
      "إخفاء دولة",
      "تغيير ترتيب العرض",
      "إدارة البرامج والأسعار",
    ],
    icon: MapPinned,
  },
  {
    title: "التأشيرات والفنادق",
    items: [
      "إضافة تأشيرة",
      "متطلبات التأشيرة",
      "الوقت المتوقع للمعالجة",
      "إضافة فندق",
      "معرض صور الفندق",
      "التسهيلات والتسعير",
    ],
    icon: ShieldCheck,
  },
  {
    title: "العمرة والحج والوسائط",
    items: [
      "باقات الحج والعمرة",
      "المشرفون والطاقم",
      "المقاعد والمواسم",
      "رفع صور وفيديوهات",
      "تنظيم الملفات",
      "إدارة الميديا",
    ],
    icon: Layers3,
  },
];

const accountingSections = [
  "الإيرادات",
  "المصروفات",
  "الفواتير",
  "الخزنة",
  "البنوك",
  "التقارير",
];

const customerSections = ["العملاء", "الحجوزات", "ملفات الجوازات", "الوثائق", "سجل الحجوزات"];
const employeeSections = ["الموظفون", "الأدوار", "الصلاحيات", "سجل الأنشطة"];
const reportSections = ["تقارير المبيعات", "تقارير العملاء", "تقارير التأشيرات", "تقارير الرحلات", "التقارير المالية"];
function AdminHome() {
  const queryClient = useQueryClient();
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: async () => {
      const [
        trips,
        activeTrips,
        umrahTrips,
        bookings,
        newBookings,
        hotels,
        visas,
        employees,
        notifications,
      ] = await Promise.all([
        tripsService.getAll(undefined, 1, 1),
        tripsService.getAll({ status: "available" }, 1, 1),
        tripsService.getAll({ category: "umrah" }, 1, 1),
        bookingsService.getAll(undefined, 1, 1),
        bookingsService.getAll({ status: "new" }, 1, 1),
        hotelsService.getAll(),
        visasService.getAll(),
        employeesService.getAll(),
        notificationsService.getAll(true),
      ]);

      return {
        trips: trips.count,
        activeTrips: activeTrips.count,
        umrahTrips: umrahTrips.count,
        bookings: bookings.count,
        newBookings: newBookings.count,
        hotels: hotels.length,
        visas: visas.length,
        employees: employees.length,
        notifications,
      };
    },
  });

  const markNotificationsReadMutation = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => notificationsService.markAsRead(id))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });

  const summary = dashboardQuery.data;
  const value = (count?: number) =>
    dashboardQuery.isLoading ? "..." : (count ?? 0).toLocaleString("ar-JO");
  const statCards = [
    {
      title: "إجمالي الرحلات",
      value: value(summary?.trips),
      change: "كل البرامج",
      icon: Plane,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "الرحلات النشطة",
      value: value(summary?.activeTrips),
      change: "متاحة الآن",
      icon: Sparkles,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      title: "باقات العمرة",
      value: value(summary?.umrahTrips),
      change: "ضمن الرحلات",
      icon: Sparkles,
      accent: "from-sky-500 to-cyan-500",
    },
    {
      title: "التأشيرات",
      value: value(summary?.visas),
      change: "خدمات مسجلة",
      icon: Ticket,
      accent: "from-violet-500 to-fuchsia-500",
    },
    {
      title: "الفنادق",
      value: value(summary?.hotels),
      change: "فنادق مسجلة",
      icon: Hotel,
      accent: "from-rose-500 to-pink-500",
    },
    {
      title: "طلبات جديدة",
      value: value(summary?.newBookings),
      change: "تحتاج متابعة",
      icon: FileText,
      accent: "from-blue-500 to-indigo-500",
    },
    {
      title: "إجمالي الطلبات",
      value: value(summary?.bookings),
      change: "كل الحالات",
      icon: Users,
      accent: "from-amber-600 to-yellow-500",
    },
    {
      title: "الموظفون",
      value: value(summary?.employees),
      change: "حسابات الإدارة",
      icon: BriefcaseBusiness,
      accent: "from-slate-700 to-slate-500",
    },
  ];
  const cards = [
    { title: "📊 لوحة التحكم", link: "/admin/dashboard" },
    { title: "🛂 التأشيرات", link: "/admin/visa" },
    { title: "✈️ الرحلات", link: "/admin/trips" },
    { title: "🏨 الفنادق", link: "/admin/hotels" },
    { title: "🕋 العمرة", link: "/admin/umrah" },
    { title: "📦 الطلبات", link: "/admin/orders" },
    { title: "👥 المستخدمون", link: "/admin/users" },
    { title: "⚙️ الإعدادات", link: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 text-slate-900 md:p-8" dir="rtl">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur xl:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">لوحة ERP الداخلية</Badge>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">لوحة تحكم Caesar Travel</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                  مركز تشغيل داخلي للموظفين لإدارة الرحلات، التأشيرات، الفنادق، البرامج، الحجوزات، والتقارير بصياغة احترافية ومناسبة لعمليات الشركة.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full border-slate-200 bg-white/80">إدارة العمليات</Button>
              <Button
                className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => void dashboardQuery.refetch()}
                disabled={dashboardQuery.isFetching}
              >
                {dashboardQuery.isFetching ? "جاري التحديث..." : "تحديث البيانات"}
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={cn("overflow-hidden border-0 bg-gradient-to-br text-white shadow-lg", stat.accent)}>
                <CardContent className="flex items-start justify-between p-5">
                  <div>
                    <p className="text-sm text-white/80">{stat.title}</p>
                    <p className="mt-2 text-2xl font-black">{stat.value}</p>
                    <p className="mt-2 text-sm text-white/80">{stat.change}</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-xl">الإجراءات السريعة</CardTitle>
                <CardDescription>أدوات تشغيل سريعة للموظف داخل لوحة الإدارة.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {actionCards.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.title} to={action.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-50">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{action.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                          </div>
                          <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm transition group-hover:text-amber-600">
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-xl">التحكم في الموقع</CardTitle>
                <CardDescription>مركز إداري لإدارة المحتوى، البرامج، التأشيرات، والنشاطات اليومية.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {managementSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="font-semibold text-slate-900">{section.title}</p>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                          {section.items.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-xl">المحاسبة</CardTitle>
                <CardDescription>متابعة الإيرادات، المصروفات، الفواتير والخزينة.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {accountingSections.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <span>{item}</span>
                    <Receipt className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-xl">إدارة العملاء</CardTitle>
                <CardDescription>العملاء، الحجوزات، وثائق السفر، وسجل الطلبات.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {customerSections.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <span>{item}</span>
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CardHeader>
                <CardTitle className="text-xl">إدارة الموظفين</CardTitle>
                <CardDescription>الأدوار والصلاحيات وسجل الأنشطة.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {employeeSections.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <span>{item}</span>
                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-xl">التقارير</CardTitle>
              <CardDescription>تقارير سريعة للأداء والعمليات والمالية.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {reportSections.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-xl">الإشعارات والتنبيهات</CardTitle>
                <CardDescription>نشاطات حديثة وطلبات تحتاج متابعة.</CardDescription>
              </div>
              {summary?.notifications.length ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={markNotificationsReadMutation.isPending}
                  onClick={() =>
                    markNotificationsReadMutation.mutate(
                      summary.notifications.map((notification) => notification.id),
                    )
                  }
                >
                  تعيين الكل كمقروء
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-2">
              {summary?.notifications.length ? (
                summary.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{notification.title}</p>
                      {notification.message ? <p className="mt-1">{notification.message}</p> : null}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={markNotificationsReadMutation.isPending}
                      onClick={() => markNotificationsReadMutation.mutate([notification.id])}
                    >
                      تمت القراءة
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  لا توجد إشعارات غير مقروءة حالياً
                </div>
              )}
              {markNotificationsReadMutation.isError ? (
                <p className="text-sm text-rose-600">تعذر تحديث حالة الإشعار. حاول مرة أخرى.</p>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <TravelProgramShowcase kind="packages" />
          <DirectBookingForm />
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">الوصول السريع إلى الأقسام</h2>
              <p className="text-sm text-slate-500">استخدم الروابط أدناه للانتقال إلى أقسام الإدارة الحالية.</p>
            </div>
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              الانتقال إلى الأقسام
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Link key={card.link} to={card.link} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50">
                {card.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
