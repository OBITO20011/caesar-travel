import { createFileRoute } from "@tanstack/react-router";

import { Seo } from "@/components/seo";
import { getStaticSeoPage } from "@/lib/seo-config";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

const pageSeo = getStaticSeoPage("/privacy")!;

// Owner-approved text only. Update "آخر تحديث" whenever the content changes.
const sections: { title: string; body: string[] }[] = [
  {
    title: "من نحن",
    body: [
      "قيصر للسياحة والسفر، مكتب سياحة وسفر في الرمثا، الأردن. للتواصل بخصوص بياناتك: واتساب 0798337711 أو البريد الإلكتروني Caesar.co@hotmail.com.",
    ],
  },
  {
    title: "البيانات التي نجمعها",
    body: [
      "نموذج طلب عرض السعر ونموذج التواصل: الاسم، رقم الهاتف، الوجهة أو الخدمة، التاريخ المتوقع، عدد المسافرين، ونص رسالتك.",
      "نموذج التسجيل في برامج الحج: الاسم، رقم الهاتف، المحافظة، العمر، وهل سبق لك أداء الحج.",
      "عندما تراسلنا على واتساب، تصلنا الرسالة ورقم هاتفك عبر تطبيق واتساب.",
    ],
  },
  {
    title: "كيف نستخدم بياناتك",
    body: [
      "نستخدمها فقط للرد على طلبك، وإرسال العروض والأسعار التي سألت عنها، ومتابعة حجزك.",
      "لا نبيع بياناتك ولا نشاركها مع جهات تسويقية.",
    ],
  },
  {
    title: "أين تُحفظ بياناتك ومن يطّلع عليها",
    body: [
      "تُحفظ طلبات النماذج في قاعدة بيانات الموقع، وتُحفظ طلبات الحج في جدول بيانات على Google، ولا يطّلع عليها إلا فريق إدارة المكتب.",
      "عند تنفيذ حجز طلبته، نشارك مع الجهات المعنية (مثل شركات الطيران والفنادق وجهات التأشيرات) البيانات اللازمة لإتمام الحجز فقط.",
    ],
  },
  {
    title: "خدمات خارجية في الموقع",
    body: [
      "تحتوي صفحة التواصل على خريطة من Google، وقد تجمع Google بيانات وفق سياسة الخصوصية الخاصة بها.",
      "لا يستخدم الموقع أدوات تتبع إعلانية. تستخدم لوحة الإدارة تخزين المتصفح لتسجيل دخول موظفي المكتب فقط.",
    ],
  },
  {
    title: "حقوقك",
    body: [
      "يمكنك أن تطلب نسخة من بياناتك أو تصحيحها أو حذفها في أي وقت، عبر واتساب أو البريد الإلكتروني المذكورين أعلاه.",
    ],
  },
];

function PrivacyPage() {
  return (
    <>
      <Seo {...pageSeo} />
      <main className="min-h-screen bg-cream pt-28 md:pt-20">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <h1 className="text-3xl font-black text-teal md:text-4xl">سياسة الخصوصية</h1>
          <p className="mt-3 text-sm text-muted-foreground">آخر تحديث: 16 تشرين الثاني 2026</p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                <ul className="mt-3 list-disc space-y-2 pr-5 leading-8 text-foreground/80">
                  {section.body.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
