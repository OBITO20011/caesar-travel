import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useErpList } from "@/hooks/use-erp";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarDays, Hotel, Plane, Route, Sparkles, Star, Users } from "lucide-react";

type ShowcaseKind = "packages" | "hajj" | "umrah";
type ErpRow = Record<string, unknown>;

interface TravelProgramShowcaseProps {
  kind: ShowcaseKind;
}

const copyByKind: Record<
  ShowcaseKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
    chips: string[];
  }
> = {
  packages: {
    eyebrow: "واجهة البرامج السياحية",
    title: "نظام باقات شامل يعرض الرحلات بشكل جذاب ومنظم",
    description:
      "تابع الوجهات والأسعار والمدة ومكونات الباقة من مكان واحد، مع بطاقات عرض متحركة تساعد فريق المبيعات على إبراز أفضل العروض بسرعة.",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    chips: ["برامج سياحية", "فنادق وطيران", "متابعة المقاعد", "تسعير مرن"],
  },
  hajj: {
    eyebrow: "إدارة برامج الحج",
    title: "لوحة حج احترافية للبرامج والمقاعد والمواسم",
    description:
      "اعرض برامج الحج بطريقة واضحة مع تواريخ البداية والنهاية والمقاعد المتاحة، لتسهيل المتابعة اليومية قبل وأثناء الموسم.",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    chips: ["مواسم الحج", "مقاعد متاحة", "تواريخ دقيقة", "تنظيم المجموعات"],
  },
  umrah: {
    eyebrow: "إدارة برامج العمرة",
    title: "تجربة عرض مرنة لبرامج العمرة والعروض الموسمية",
    description:
      "واجهة جميلة تساعدك على إبراز برامج العمرة النشطة وتواريخها وسعتها، مع مؤشرات سريعة لاتخاذ القرار.",
    accent: "from-indigo-500 via-violet-500 to-fuchsia-500",
    chips: ["عروض موسمية", "متابعة السعة", "برامج مرنة", "عرض جذاب"],
  },
};

function asNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: unknown, currency = "SAR") {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(asNumber(value));
}

export function TravelProgramShowcase({ kind }: TravelProgramShowcaseProps) {
  const content = copyByKind[kind];
  const filters = kind === "packages" ? undefined : { category: kind };
  const { data, isLoading } = useErpList("trips", { limit: 6, filters });
  const rows: ErpRow[] = data?.data ?? [];
  const activeCount = rows.filter(
    (row: ErpRow) => String(row.status ?? "available") === "available",
  ).length;
  const totalSlots = rows.reduce<number>((sum, row) => sum + asNumber(row.remaining_seats), 0);
  const averagePrice = rows.length
    ? rows.reduce<number>((sum, row) => sum + asNumber(row.price), 0) / rows.length
    : 0;

  const stats = [
    { label: "العروض المعروضة", value: rows.length, icon: Sparkles },
    {
      label: kind === "packages" ? "العروض النشطة" : "المقاعد المتاحة",
      value: kind === "packages" ? activeCount : totalSlots,
      icon: Users,
    },
    { label: "متوسط السعر", value: formatMoney(averagePrice), icon: Star },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div
        className={cn("relative isolate p-6 text-white md:p-8 bg-gradient-to-br", content.accent)}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.22),transparent_24%)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl space-y-4"
        >
          <Badge className="border-white/30 bg-white/20 text-white backdrop-blur">
            {content.eyebrow}
          </Badge>
          <h2 className="text-2xl font-black leading-tight md:text-4xl">{content.title}</h2>
          <p className="max-w-2xl text-sm leading-7 text-white/85 md:text-base">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {content.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-3 md:p-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
          >
            <Card className="border-dashed shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{isLoading ? "..." : stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 px-4 pb-5 md:grid-cols-3 md:px-6">
        {(rows.length
          ? rows.slice(0, 3)
          : [
              {
                name: "باقة نموذجية",
                description: "أضف أول رحلة من قسم إدارة الرحلات",
                start_date: "مدة مرنة",
                price: 0,
                currency: "JOD",
              },
            ]
        ).map((row: ErpRow, index: number) => (
          <motion.div
            key={String(row.id ?? row.name ?? index)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.08, duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="rounded-2xl border bg-background p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{String(row.name ?? "برنامج جديد")}</p>
                <p className="text-xs text-muted-foreground">
                  {String(row.destination ?? row.description ?? "جاهز للتخصيص")}
                </p>
              </div>
              <Badge variant="secondary">{String(row.status ?? "متاحة")}</Badge>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />{" "}
                {String(row.start_date ?? "مدة مرنة")}
              </div>
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4" />{" "}
                {String(row.airline ?? "خيارات الطيران حسب البرنامج")}
              </div>
              <div className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />{" "}
                {String(row.makkah_hotel ?? row.madinah_hotel ?? "خيارات الفنادق حسب البرنامج")}
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4" />{" "}
                {formatMoney(row.price, String(row.currency ?? "JOD"))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
