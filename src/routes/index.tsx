import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Plane,
  Compass,
  Building2,
  Hotel,
  Mountain,
  Globe2,
  FileCheck,
  Moon,
  ChevronUp,
  Menu,
  X,
  Navigation,
  Send,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";

import logo from "@/assets/caesar-mark.png";
import heroImg from "@/assets/hero-hajj.jpg";
import galleryMedina from "@/assets/gallery-medina.jpg";
import galleryFlight from "@/assets/gallery-flight.jpg";
import galleryPetra from "@/assets/gallery-petra.jpg";
import galleryDubai from "@/assets/gallery-dubai.jpg";
import galleryIstanbul from "@/assets/gallery-istanbul.jpg";
import galleryHotel from "@/assets/gallery-hotel.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ──────────────── Contact constants ──────────────── */
const PHONES = [
  { display: "0795 207 900", intl: "962795207900" },
  { display: "0798 337 711", intl: "962798337711" },
  { display: "0798 691 003", intl: "962798691003" },
];
const WHATSAPP = "962795207900";
const MAP_QUERY = "H268%2BP7%20Ramtha%20Jordan";
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

/* ──────────────── Animation helpers ──────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

/* ──────────────── Navbar ──────────────── */
const NAV_LINKS = [
  { label: "الرئيسية", id: "hero" },
  { label: "خدماتنا", id: "services" },
  { label: "معرض الصور", id: "gallery" },
  { label: "آراء العملاء", id: "reviews" },
  { label: "تواصل معنا", id: "contact" },
];

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
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-md shadow-teal/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <img src={logo} alt="شعار قيصر للسياحة والسفر" className="h-11 w-11 object-contain" />
          <div className="text-right leading-tight">
            <span className="block text-lg font-black text-teal tracking-tight">قيصر</span>
            <span className="block text-[11px] font-medium text-gold-dark tracking-wide">
              CAESAR TRAVEL
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-sm font-semibold transition-colors ${
                scrolled ? "text-foreground/80 hover:text-teal" : "text-foreground/90 hover:text-teal"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
          >
            احجز الآن
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-cream-dark transition-colors"
          aria-label="القائمة"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cream/98 backdrop-blur-md border-t border-border px-6 py-5"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-right text-base font-semibold text-foreground/80 hover:text-teal transition-colors py-2.5"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="mt-3 rounded-full bg-teal px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              احجز الآن
            </button>
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
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="الكعبة المشرفة في المسجد الحرام"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-teal-dark/95 via-teal-dark/80 to-teal-dark/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/90 via-transparent to-teal-dark/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-32 md:py-40 w-full">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 px-4 py-1.5 mb-6 backdrop-blur-sm"
          >
            <Star size={14} className="text-gold fill-gold" />
            <span className="text-sm font-semibold text-gold-light">تقييم 4.1 · أكثر من 20 عاماً من الثقة</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.12] text-white tracking-tight"
          >
            رحلتك تبدأ
            <br />
            <span className="text-gold">مع قيصر للسياحة</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-lg"
          >
            حج وعمرة بأعلى معايير الجودة، وحجوزات طيران وفنادق وتأشيرات، وسياحة داخلية وخارجية
            بتجربة فاخرة تليق بك. من الرمثا إلى العالم.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-9 flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full bg-gold px-8 py-4 text-base font-bold text-teal-dark hover:bg-gold-light transition-colors shadow-xl shadow-gold/25"
            >
              احجز رحلتك الآن
            </button>
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border-2 border-white/40 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
            >
              استكشف خدماتنا
            </button>
          </motion.div>

          {/* Quick info cards */}
          <motion.div variants={fadeInUp} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: MapPin, label: "الرمثا، الأردن", sub: "Plus Code: H268+P7" },
              { icon: Clock, label: "9:30 ص — 7:00 م", sub: "السبت — الخميس" },
              { icon: Phone, label: PHONES[0].display, sub: "اتصل بنا الآن" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4"
              >
                <item.icon size={20} className="text-gold mb-2" />
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-xs text-white/60 mt-0.5">{item.sub}</p>
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
    <section id="services" className="py-24 md:py-32 relative bg-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
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
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-teal">
            خدماتنا المميزة
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            تجربة سفر متكاملة من لحظة التخطيط حتى العودة، بعناية واحترافية تليق باسم قيصر.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="group rounded-3xl bg-card border border-border p-7 hover:border-gold/40 hover:shadow-2xl hover:shadow-teal/10 transition-all duration-300"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal group-hover:bg-teal group-hover:text-gold transition-colors duration-300">
                <s.icon size={26} />
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
    { value: "4.1", label: "متوسط التقييم" },
    { value: "50+", label: "وجهة عالمية" },
  ];

  return (
    <section className="py-20 bg-teal relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="text-4xl md:text-6xl font-black text-gold">{s.value}</div>
              <div className="mt-2 text-sm md:text-base font-medium text-white/80">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────── Gallery ──────────────── */
function GallerySection() {
  const images = [
    { src: heroImg, alt: "الكعبة المشرفة", label: "الحج", span: "sm:col-span-2 sm:row-span-2" },
    { src: galleryMedina, alt: "المسجد النبوي الشريف", label: "العمرة", span: "" },
    { src: galleryFlight, alt: "رحلة طيران فاخرة", label: "الطيران", span: "" },
    { src: galleryIstanbul, alt: "اسطنبول تركيا", label: "تركيا", span: "" },
    { src: galleryPetra, alt: "البتراء الأردن", label: "السياحة الداخلية", span: "" },
    { src: galleryDubai, alt: "دبي الإمارات", label: "دبي", span: "" },
    { src: galleryHotel, alt: "فندق فاخر", label: "الفنادق", span: "sm:col-span-2" },
  ];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-cream-dark">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.span variants={fadeInUp} className="text-sm font-bold text-gold-dark tracking-widest uppercase">
            معرض الصور
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-teal">
            لمحات من رحلاتنا
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            وجهات مقدسة وسياحية اخترناها لك بعناية حول العالم.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 md:gap-4"
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 right-3 text-sm md:text-base font-bold text-white drop-shadow">
                {img.label}
              </span>
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
    { name: "أحمد خالد", rating: 5, text: "تجربة ممتازة في العمرة! التنظيم كان احترافياً والإقامة فاخرة. أنصح الجميع بالتعامل مع قيصر." },
    { name: "سارة محمد", rating: 5, text: "رحلة عائلية إلى تركيا كانت رائعة. كل التفاصيل محسوبة والمرشد كان ممتازاً. شكراً لكم!" },
    { name: "محمد العلي", rating: 4, text: "خدمة جيدة جداً وسعر منافس. التأشيرة والحجوزات تمت بسلاسة. سأتعامل معهم مرة أخرى." },
    { name: "ليلى عبدالله", rating: 5, text: "حج مبارك مع قيصر هذا العام. الجماعة كانت منظمة والخدمات تفوق التوقعات. جزاكم الله خيراً." },
  ];

  return (
    <section id="reviews" className="py-24 md:py-32 bg-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-sm font-bold text-gold-dark tracking-widest uppercase">
            آراء العملاء
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-teal">
            ماذا يقولون عنا؟
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid gap-5 md:grid-cols-2"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="rounded-3xl bg-card border border-border p-6 md:p-8 hover:shadow-xl hover:shadow-teal/5 transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} className={j < r.rating ? "text-gold fill-gold" : "text-border"} />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-5 text-base">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold">
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
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const message = String(data.get("message") || "");
    const text = `مرحباً، أنا ${name}%0Aالهاتف: ${phone}%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-cream to-cream-dark relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-sm font-bold text-gold-dark tracking-widest uppercase">
            تواصل معنا
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-teal">
            زرنا أو راسلنا
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            نحن هنا لخدمتك — اتصل بنا، راسلنا عبر واتساب، أو زر مكتبنا في الرمثا.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: info + form */}
          <div className="space-y-5">
            {/* Phones */}
            <div className="rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-teal" />
                </div>
                <h3 className="font-bold text-foreground text-lg">أرقام الهاتف</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                {PHONES.map((p) => (
                  <a
                    key={p.intl}
                    href={`tel:+${p.intl}`}
                    dir="ltr"
                    className="rounded-2xl bg-teal/5 hover:bg-teal/10 border border-border py-3 text-center text-sm font-bold text-teal transition-colors"
                  >
                    {p.display}
                  </a>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="rounded-3xl bg-card border border-border p-6 flex items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-teal" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">العنوان</h3>
                <p className="text-sm text-muted-foreground mt-1">الرمثا، الأردن — Plus Code: H268+P7</p>
                <a
                  href={MAP_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-gold px-4 py-2 text-xs font-bold text-teal-dark hover:bg-gold-light transition-colors"
                >
                  <Navigation size={14} />
                  احصل على الاتجاهات
                </a>
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="rounded-3xl bg-card border border-border p-6 space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-11 w-11 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-teal" />
                </div>
                <h3 className="font-bold text-foreground text-lg">أرسل استفسارك</h3>
              </div>
              <input
                name="name"
                required
                placeholder="الاسم الكامل"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition"
              />
              <input
                name="phone"
                required
                type="tel"
                dir="ltr"
                placeholder="رقم الهاتف"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground text-right focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition"
              />
              <textarea
                name="message"
                required
                rows={4}
                placeholder="كيف يمكننا مساعدتك؟ (حج، عمرة، تذاكر، فنادق، تأشيرات...)"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-teal py-3.5 text-sm font-bold text-primary-foreground hover:bg-teal-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal/20"
              >
                <Send size={16} />
                {sent ? "تم فتح واتساب..." : "إرسال عبر واتساب"}
              </button>
            </form>
          </div>

          {/* Right: map */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="rounded-3xl overflow-hidden border border-border min-h-[420px] lg:min-h-full relative shadow-lg"
          >
            <iframe
              title="موقع قيصر للسياحة والسفر على الخريطة"
              src={MAP_EMBED}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={MAP_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-bold text-primary-foreground shadow-xl hover:bg-teal-dark transition-colors"
            >
              <Navigation size={16} />
              الاتجاهات
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Footer ──────────────── */
function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-teal-dark text-white/80">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="شعار قيصر للسياحة" className="h-12 w-12 object-contain" />
              <div className="leading-tight">
                <span className="block text-xl font-black text-gold">قيصر للسياحة والسفر</span>
                <span className="block text-xs text-white/50 tracking-wide">CAESAR TRAVEL & TOURISM</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-md">
              وكالتك الموثوقة للحج والعمرة والسياحة منذ أكثر من 20 عاماً. نصنع لك رحلات لا تُنسى
              بأعلى معايير الجودة والراحة.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: MessageCircle, href: `https://wa.me/${WHATSAPP}`, label: "واتساب" },
                { icon: Facebook, href: "#", label: "فيسبوك" },
                { icon: Instagram, href: "#", label: "انستغرام" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-gold hover:text-teal-dark flex items-center justify-center transition-colors"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollTo(l.id)} className="hover:text-gold transition-colors flex items-center gap-1.5">
                    <ArrowLeft size={12} />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-2.5 text-sm">
              {PHONES.map((p) => (
                <li key={p.intl}>
                  <a href={`tel:+${p.intl}`} dir="ltr" className="hover:text-gold transition-colors block text-right">
                    {p.display}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2 pt-1">
                <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                <span>الرمثا، الأردن — H268+P7</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="text-gold shrink-0" />
                <span>السبت — الخميس: 9:30 ص — 7:00 م</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <span>جميع الحقوق محفوظة © {new Date().getFullYear()} قيصر للسياحة والسفر والحج والعمرة</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</a>
            <span className="text-white/20">|</span>
            <a href="#" className="hover:text-gold transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────── Floating WhatsApp ──────────────── */
function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 hover:scale-110 transition-transform"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <MessageCircle size={28} className="relative fill-white" />
    </a>
  );
}

/* ──────────────── Back to top ──────────────── */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      className="fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full bg-teal text-primary-foreground shadow-lg shadow-teal/30 flex items-center justify-center hover:bg-teal-dark transition-colors"
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
      <GallerySection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </main>
  );
}
