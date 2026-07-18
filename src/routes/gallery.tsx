import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";

import galleryGeorgia from "@/assets/gallery-georgia.jpg";
import gallerySwitzerland from "@/assets/gallery-switzerland.jpg";
import galleryMaldives from "@/assets/gallery-maldives.jpg";
import galleryEgypt from "@/assets/gallery-egypt.jpg";
import galleryVisa from "@/assets/gallery-visa.png";
import galleryMedina from "@/assets/gallery-medina.jpg";
import galleryFlight from "@/assets/gallery-flight.jpg";
import galleryPetra from "@/assets/gallery-petra.jpg";
import galleryDubai from "@/assets/gallery-dubai.jpg";
import galleryIstanbul from "@/assets/gallery-istanbul.jpg";
import galleryHotel from "@/assets/gallery-hotel.jpg";
import heroImg from "@/assets/hero-hajj.jpg";
import { useGalleryImages } from "@/hooks/use-site-content";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

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

function galleryLink(title: string) {
  const links: Record<string, "/hajj" | "/umrah" | "/visa" | "/turkey-trip" | "/dubai" | "/egypt"> = {
    الحج: "/hajj",
    العمرة: "/umrah",
    التأشيرات: "/visa",
    تركيا: "/turkey-trip",
    دبي: "/dubai",
    مصر: "/egypt",
  };

  return links[title] || "/gallery";
}

function GalleryPage() {
  const { data: cmsImages } = useGalleryImages();
  const fallbackImages = [
    { src: heroImg, alt: "الكعبة المشرفة", label: "الحج", span: "sm:col-span-2 sm:row-span-2", link: "/hajj" },
    { src: galleryMedina, alt: "المسجد النبوي الشريف", label: "العمرة", span: "", link: "/umrah" },
    { src: galleryVisa, alt: "خدمة التأشيرات", label: "التأشيرات", span: "", link: "/visa" },
    { src: galleryIstanbul, alt: "اسطنبول تركيا", label: "تركيا", span: "", link: "/turkey-trip" },
    { src: galleryDubai, alt: "دبي الإمارات", label: "دبي", span: "", link: "/dubai" },
    { src: gallerySwitzerland, alt: "سويسرا", label: "سويسرا", span: "", link: "/" },
    { src: galleryEgypt, alt: "الأهرامات", label: "مصر", span: "", link: "/egypt" },
    { src: galleryMaldives, alt: "المالديف", label: "المالديف", span: "", link: "/" },
    { src: galleryGeorgia, alt: "جبال جورجيا", label: "جورجيا", span: "", link: "/" },
    { src: galleryHotel, alt: "فندق فاخر", label: "حجز الفنادق ", span: "sm:col-span-2", link: "/" },
    { src: galleryPetra, alt: "البتراء الأردن", label: "السياحة الداخلية", span: "", link: "/" },
    { src: galleryFlight, alt: "رحلة طيران فاخرة", label: "الطيران", span: "", link: "/" },
  ];
  const images = cmsImages?.length
    ? cmsImages.map((image, index) => ({
        src: image.image_url,
        alt: image.title,
        label: image.title,
        span: index === 0 ? "sm:col-span-2 sm:row-span-2" : "",
        link: galleryLink(image.title),
      }))
    : fallbackImages;

  return (
    <>
      <Helmet>
        <title>معرض الصور - لمحات من رحلاتنا | قيصر للسياحة والسفر</title>
        <meta
          name="description"
          content="معرض صور من رحلاتنا إلى الحج والعمرة والسياحة الداخلية والخارجية"
        />
        <meta
          name="keywords"
          content="معرض صور، رحلات، حج، عمرة، سياحة، قيصر للسياحة"
        />
      </Helmet>
      <main className="min-h-screen bg-cream-dark pt-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-16">
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
            <motion.h1 variants={fadeInUp} className="mt-3 text-3xl md:text-5xl font-black text-teal">
              لمحات من رحلاتنا
            </motion.h1>
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
              <Link
                key={i}
                to={img.link}
                className={`block ${img.span}`}
              >
                <motion.div
                  variants={fadeIn}
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <span className="absolute bottom-4 right-4 rounded-xl bg-black/50 backdrop-blur-md px-4 py-2 text-white border border-white/20 text-center">
                    <div className="font-bold text-base">{img.label}</div>
                    <div className="text-xs opacity-90">اضغط هنا</div>
                  </span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </main>
    </>
  );
}
