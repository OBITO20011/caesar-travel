import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import {
  Plane,
  Compass,
  Building2,
  Hotel,
  Mountain,
  Globe2,
  FileCheck,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function ServicesPage() {
  const services = [
    { icon: Compass, title: "الحج", description: "برامج حج متكاملة تشمل الإقامة القريبة والنقل والإرشاد، بتنظيم يليق بضيوف الرحمن." },
    { icon: Moon, title: "العمرة", description: "باقات عمرة مرنة على مدار العام بأسعار تنافسية وخدمة راقية من الوصول حتى العودة." },
    { icon: Plane, title: "حجز الطيران", description: "أفضل أسعار تذاكر الطيران لجميع الوجهات مع خطوط عالمية وإقليمية موثوقة." },
    { icon: Hotel, title: "حجز الفنادق", description: "فنادق مختارة بعناية في كل الوجهات، من الاقتصادي إلى الفاخر خمس نجوم." },
    { icon: Mountain, title: "السياحة الداخلية", description: "اكتشف كنوز الأردن: البتراء، وادي رم، البحر الميت وجرش، ببرامج عائلية وشبابية." },
    { icon: Globe2, title: "السياحة الخارجية", description: "رحلات عالمية إلى تركيا، دبي، مصر، أوروبا وآسيا بتجارب لا تُنسى." },
    { icon: FileCheck, title: "خدمات التأشيرات", description: "استخراج التأشيرات السياحية والعلاجية بسرعة وموثوقية ومتابعة كاملة لطلبك." },
    { icon: Building2, title: "رحلات الشركات", description: "تنظيم رحلات ومؤتمرات ووفود العمل بترتيبات احترافية متكاملة." },
  ];

  return (
    <>
      <Helmet>
        <title>خدماتنا المميزة | قيصر للسياحة والسفر</title>
        <meta
          name="description"
          content="خدماتنا المتنوعة تشمل الحج والعمرة وحجز الطيران والفنادق والتأشيرات والسياحة الداخلية والخارجية"
        />
        <meta
          name="keywords"
          content="خدمات، حج، عمرة، طيران، فنادق، تأشيرات، قيصر للسياحة"
        />
      </Helmet>
      <main className="min-h-screen bg-cream pt-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-sm font-bold text-gold-dark tracking-widest uppercase">
              ما نقدمه
            </motion.span>
            <motion.h1 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-teal">
              خدماتنا المميزة
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              تجربة سفر متكاملة من لحظة التخطيط حتى العودة، بعناية واحترافية تليق باسم قيصر.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group rounded-3xl bg-card border border-border p-8 hover:border-gold/40 hover:shadow-2xl hover:shadow-teal/10 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/10 text-teal group-hover:bg-teal group-hover:text-gold transition-colors duration-300">
                  <s.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-24 grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-black text-teal mb-6">لماذا تختارنا؟</h2>
              <ul className="space-y-4">
                {[
                  "خبرة تزيد عن 20 سنة في مجال السياحة والسفر",
                  "فريق احترافي مدرب على أعلى مستويات الخدمة",
                  "أسعار تنافسية وعروض حصرية",
                  "دعم عملاء على مدار الساعة",
                  "رحلات منظمة بعناية فائقة",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                      ✓
                    </div>
                    <p className="text-lg text-foreground/80">{item}</p>
                  </motion.div>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp} className="rounded-3xl bg-gradient-to-br from-teal/20 to-gold/20 p-8 border border-teal/20">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-gold mb-4">15000+</div>
                <div className="text-2xl font-bold text-teal mb-2">عميل سعيد</div>
                <div className="text-muted-foreground">يثقون بخدماتنا</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
