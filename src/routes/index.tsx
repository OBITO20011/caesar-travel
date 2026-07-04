import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Plane,
  Compass,
  CalendarDays,
  Shield,
  ChevronUp,
  Menu,
  X,
  Navigation,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ──────────────── Animation helpers ──────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

/* ──────────────── Navbar ──────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <span className="text-2xl font-black text-teal tracking-tight">قيصر</span>
          <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
            للسياحة والسفر
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "الرئيسية", id: "hero" },
            { label: "خدماتنا", id: "services" },
            { label: "تقييمات", id: "reviews" },
            { label: "تواصل معنا", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-foreground/80 hover:text-teal transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal-dark transition-colors"
          >
            احجز الآن
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-cream-dark transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cream/95 backdrop-blur-md border-t border-border px-6 py-4"
        >
          <div className="flex flex-col gap-4">
            {[
              { label: "الرئيسية", id: "hero" },
              { label: "خدماتنا", id: "services" },
              { label: "تقييمات", id: "reviews" },
              { label: "تواصل معنا", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-right text-sm font-medium text-foreground/80 hover:text-teal transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

/* ──────────────── Hero ──────────────── */
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal/5 via-cream to-cream" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-40 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 mb-6">
            <Star size={14} className="text-gold-dark fill-gold-dark" />
            <span className="text-sm font-medium text-teal">تقييم 4.1 من 58 زائر</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black leading-[1.1] text-foreground tracking-tight"
          >
            قيصر
            <br />
            <span className="text-teal">للسياحة والسفر</span>
            <br />
            <span className="text-gold-dark">والحج والعمرة</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
          >
            منذ أكثر من عشرين عاماً، نصنع رحلات لا تُنسى. حج وعمرة بأعلى معايير الجودة،
            وسياحة داخلية وخارجية بتجربة شخصية فاخرة.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full bg-teal px-8 py-3.5 text-base font-bold text-primary-foreground hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
            >
              احجز رحلتك
            </button>
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border-2 border-teal/30 px-8 py-3.5 text-base font-bold text-teal hover:bg-teal/5 transition-colors"
            >
              استكشف خدماتنا
            </button>
          </motion.div>

          {/* Quick info cards */}
          <motion.div variants={fadeInUp} className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: MapPin, label: "الرمثا، الأردن", sub: "شارع 25" },
              { icon: Clock, label: "9:30 ص — 7:00 م", sub: "السبت — الخميس" },
              { icon: Phone, label: "(02) 738 5445", sub: "اتصل الآن" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border p-4">
                <item.icon size={20} className="text-teal mb-2" />
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────── Services ──────────────── */
function ServicesSection() {
  const services = [
    {
      icon: Compass,
      title: "الحج والعمرة",
      description:
        "برامج متكاملة للحج والعمرة تشمل الإقامة والنقل والإرشاد الروحي، بتنظيم احترافي يلبي أعلى المعايير.",
    },
    {
      icon: Plane,
      title: "السياحة الخارجية",
      description:
        "رحلات عالمية إلى أجمل الوجهات: تركيا، مصر، دبي، أوروبا وآسيا. حجز طيران وفنادق بأسعار تنافسية.",
    },
    {
      icon: CalendarDays,
      title: "السياحة الداخلية",
      description:
        "اكتشف جمال الأردن: البتراء، وادي رم، البحر الميت، جرش، وأقصى الشمال. برامج عائلية وشبابية.",
    },
    {
      icon: Shield,
      title: "التأمين والدعم",
      description:
        "تأمين سفر شامل، دعم على مدار الساعة، ومتابعة مستمرة لراحتك أينما كنت.",
    },
  ];

  return (
    <section id="services" className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-sm font-bold text-teal tracking-wide uppercase">
            ما نقدمه
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-foreground">
            خدماتنا المميزة
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            نقدم تجربة سفر متكاملة من لحظة التخطيط حتى العودة، بعناية واحترافية تليق باسم قيصر.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group rounded-3xl bg-card border border-border p-6 hover:border-teal/30 hover:shadow-xl hover:shadow-teal/5 transition-all duration-300"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal group-hover:bg-teal group-hover:text-primary-foreground transition-colors duration-300">
                <s.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────── Stats ──────────────── */
function StatsSection() {
  const stats = [
    { value: "20+", label: "سنة خبرة" },
    { value: "5000+", label: "حاج ومعتمر" },
    { value: "58", label: "تقييم إيجابي" },
    { value: "4.1", label: "متوسط التقييم" },
  ];

  return (
    <section className="py-20 bg-teal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="mx-auto max-w-6xl px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-black text-gold">{s.value}</div>
              <div className="mt-2 text-sm font-medium text-primary-foreground/80">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────── Reviews ──────────────── */
function ReviewsSection() {
  const reviews = [
    {
      name: "أحمد خالد",
      rating: 5,
      text: "تجربة ممتازة في العمرة! التنظيم كان احترافياً والإقامة فاخرة. أنصح الجميع بالتعامل مع قيصر.",
    },
    {
      name: "سارة محمد",
      rating: 5,
      text: "رحلة عائلية إلى تركيا كانت رائعة. كل التفاصيل محسوبة والمرشد كان ممتازاً. شكراً لكم!",
    },
    {
      name: "محمد العلي",
      rating: 4,
      text: "خدمة جيدة جداً وسعر منافس. التأمين والدعم كانا ممتازين خلال الرحلة. سأتعامل معهم مرة أخرى.",
    },
    {
      name: "ليلى عبدالله",
      rating: 5,
      text: "حج مبارك مع قيصر هذا العام. الجماعة كانت منظمة والخدمات تفوق التوقعات. جزاكم الله خيراً.",
    },
  ];

  return (
    <section id="reviews" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-sm font-bold text-teal tracking-wide uppercase">
            آراء العملاء
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-foreground">
            ماذا يقولون عنا؟
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="rounded-3xl bg-card border border-border p-6 md:p-8"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className={j < r.rating ? "text-gold fill-gold" : "text-border"}
                  />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-4 text-base">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-sm">
                  {r.name[0]}
                </div>
                <span className="text-sm font-bold text-foreground">{r.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────── Contact ──────────────── */
function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-cream to-cream-dark relative">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-sm font-bold text-teal tracking-wide uppercase">
            تواصل معنا
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-foreground">
            زرنا أو اتصل
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            <motion.div variants={fadeInUp} className="rounded-3xl bg-card border border-border p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-teal" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">العنوان</h3>
                <p className="text-sm text-muted-foreground mt-1">25، شارع الرمثا الرئيسي، الأردن</p>
                <a
                  href="https://maps.google.com/?q=25+Ar-Ramtha+Jordan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-teal hover:text-teal-dark transition-colors"
                >
                  <Navigation size={14} />
                  الاتجاهات
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-3xl bg-card border border-border p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <Phone size={22} className="text-teal" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">الهاتف</h3>
                <p className="text-sm text-muted-foreground mt-1">(02) 738 5445</p>
                <a
                  href="tel:+96227385445"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-teal hover:text-teal-dark transition-colors"
                >
                  <Phone size={14} />
                  اتصل الآن
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-3xl bg-card border border-border p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <Clock size={22} className="text-teal" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">أوقات العمل</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                  <p>السبت — الخميس: 9:30 ص — 7:00 م</p>
                  <p>الجمعة: مغلق</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "قيصر للسياحة", text: "قيصر للسياحة والسفر والحج والعمرة في الرمثا", url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex-1 rounded-2xl bg-teal/10 py-3 text-sm font-bold text-teal hover:bg-teal/20 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                مشاركة
              </button>
              <button className="flex-1 rounded-2xl bg-gold/10 py-3 text-sm font-bold text-gold-dark hover:bg-gold/20 transition-colors flex items-center justify-center gap-2">
                <Bookmark size={16} />
                حفظ
              </button>
            </motion.div>
          </motion.div>

          {/* Map placeholder / embed */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="rounded-3xl overflow-hidden border border-border h-full min-h-[360px] relative bg-teal/5"
          >
            <iframe
              title="موقع قيصر للسياحة"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.5!2d36.0!3d32.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDMwJzAwLjAiTiAzNsKwMDAnMDAuMCJF!5e0!3m2!1sar!2sjo!4v1"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Footer ──────────────── */
function Footer() {
  return (
    <footer className="bg-teal-dark text-primary-foreground/80 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-black text-gold mb-1">قيصر</h3>
            <p className="text-sm text-primary-foreground/60">للسياحة والسفر والحج والعمرة</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="tel:+96227385445" className="hover:text-gold transition-colors">(02) 738 5445</a>
            <span className="text-primary-foreground/30">|</span>
            <span>الرمثا، الأردن</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
          جميع الحقوق محفوظة © {new Date().getFullYear()} قيصر للسياحة والسفر والحج والعمرة
        </div>
      </div>
    </footer>
  );
}

/* ──────────────── Back to top ──────────────── */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-teal text-primary-foreground shadow-lg shadow-teal/30 flex items-center justify-center hover:bg-teal-dark transition-colors"
    >
      <ChevronUp size={22} />
    </button>
  );
}

/* ──────────────── Main Page ──────────────── */
function Index() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
      <BackToTop />
    </main>
  );
}
