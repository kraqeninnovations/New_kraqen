import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteData } from "@/lib/site-data";
import kraqenHero1 from "@/assets/kraqen_hero_1.jpg";
import kraqenHero2 from "@/assets/kraqen_hero_2.jpg";
import kraqenHero3 from "@/assets/kraqen_hero_3.jpg";
import p1 from "@/assets/p1.jpg";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Fallback images map for local assets vs public paths
const DEFAULT_HERO_IMAGES = [kraqenHero1, kraqenHero2, p1, kraqenHero3];

function resolveImagePath(path: string, fallbackIdx: number = 0): string {
  if (!path) return DEFAULT_HERO_IMAGES[fallbackIdx % DEFAULT_HERO_IMAGES.length];
  if (path === "/assets/kraqen_hero_1.jpg") return kraqenHero1;
  if (path === "/assets/kraqen_hero_2.jpg") return kraqenHero2;
  if (path === "/assets/kraqen_hero_3.jpg") return kraqenHero3;
  if (path === "/assets/p1.jpg") return p1;
  return path;
}

// ==========================================
// 1. HERO SECTION
// ==========================================
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { site, home } = useSiteData();
  const { hero } = home;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 26;
    const y = (clientY / innerHeight - 0.5) * 26;
    setMousePos({ x, y });
  };

  const heroImages = hero.images && hero.images.length >= 4 
    ? hero.images.map((img, idx) => resolveImagePath(img, idx))
    : DEFAULT_HERO_IMAGES;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100vh] w-full overflow-hidden bg-[#0d0d0d] pt-36 sm:pt-44 lg:pt-52 pb-16 lg:pb-24 text-cream flex flex-col justify-between px-5 md:px-10"
    >
      {/* Ambient background accent */}
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[var(--color-accent,#ff3b00)]/5 blur-[160px]" />

      {/* Desktop Parallax Floating Editorial Images */}
      <div className="pointer-events-none absolute inset-0 hidden md:block z-10">
        {/* Upper Left */}
        <motion.div
          animate={{ x: mousePos.x * -0.5, y: mousePos.y * -0.5 }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute top-[18%] left-[4%] w-[190px] lg:w-[230px] aspect-[4/5] overflow-hidden rounded-xs border border-white/10 shadow-2xl"
        >
          <img
            src={heroImages[0]}
            alt={site.name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Upper Right */}
        <motion.div
          animate={{ x: mousePos.x * 0.7, y: mousePos.y * 0.7 }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.45 }}
          className="absolute top-[14%] right-[5%] w-[220px] lg:w-[270px] aspect-[16/10] overflow-hidden rounded-xs border border-white/10 shadow-2xl"
        >
          <img
            src={heroImages[1]}
            alt={site.tagline}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Lower Left */}
        <motion.div
          animate={{ x: mousePos.x * 0.4, y: mousePos.y * 0.4 }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute bottom-[22%] left-[6%] w-[170px] lg:w-[210px] aspect-[4/3] overflow-hidden rounded-xs border border-white/10 shadow-2xl"
        >
          <img
            src={heroImages[2]}
            alt="Kraqen Project"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Lower Right */}
        <motion.div
          animate={{ x: mousePos.x * -0.6, y: mousePos.y * -0.6 }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.75 }}
          className="absolute bottom-[18%] right-[4%] w-[230px] lg:w-[290px] aspect-[4/3] overflow-hidden rounded-xs border border-white/10 shadow-2xl"
        >
          <img
            src={heroImages[3]}
            alt="Kraqen Innovation Studio"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      {/* Main Viewport-Dominating Typography Heading */}
      <div className="relative z-20 mx-auto my-auto flex max-w-[1340px] flex-col items-center justify-center text-center px-2 py-8">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="eyebrow mb-8 sm:mb-10 text-[var(--color-accent,#ff3b00)] tracking-[0.25em]"
        >
          {hero.eyebrow || site.tagline}
        </motion.p>

        <h1 className="text-display-hero text-cream font-display uppercase tracking-tight text-center leading-[0.84]">
          {hero.title.map((line, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 + idx * 0.15, ease: EASE_OUT }}
              className={`block mb-1.5 sm:mb-2 lg:mb-3 ${idx === 1 ? "text-[var(--color-accent,#ff3b00)] md:text-cream" : ""}`}
            >
              {line}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Mobile Editorial Image Section */}
      <div className="my-10 grid grid-cols-2 gap-4 md:hidden">
        <div className="aspect-[4/3] overflow-hidden rounded-xs border border-white/10">
          <img src={heroImages[0]} alt="Kraqen Tech" className="h-full w-full object-cover" />
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-xs border border-white/10">
          <img src={heroImages[1]} alt="Kraqen Digital UI" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Bottom Hero Metadata Divider Bar */}
      <div className="relative z-20 border-t border-cream/15 pt-8 text-xs uppercase tracking-wider text-muted-text mt-12 lg:mt-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="font-semibold text-cream">
            {site.name} · {site.location}
          </div>
          <div className="max-w-md text-cream/70 text-left md:text-center normal-case text-xs leading-relaxed font-normal">
            {hero.description || site.description}
          </div>
          <div>
            <Link
              to={hero.cta?.href || "/work"}
              data-cursor="link"
              className="link-line text-cream hover:text-[var(--color-accent,#ff3b00)] font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <span>{hero.cta?.label || "VIEW OUR WORK ↗"}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 2. SELECTED WORK SECTION
// ==========================================
export function SelectedWorkSection() {
  const { home } = useSiteData();
  const { selectedWork } = home;

  return (
    <section id="work" className="bg-[#0d0d0d] px-5 py-32 lg:py-48 md:px-10 border-t border-cream/10">
      <div className="mx-auto max-w-[1440px]">
        {/* Header Block with controlled gap to gallery */}
        <div className="mb-24 lg:mb-36 grid gap-10 lg:grid-cols-12 lg:items-end border-b border-cream/15 pb-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-[var(--color-accent,#ff3b00)]">{selectedWork.eyebrow}</p>
            <h2 className="text-display-section text-cream font-display uppercase leading-[0.84]">
              {selectedWork.title.map((line, idx) => (
                <span key={idx} className="block mb-1">{line}</span>
              ))}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-md text-base text-muted-text leading-relaxed font-normal">
              {selectedWork.description}
            </p>
          </div>
        </div>

        {/* Projects Stack with controlled vertical rhythm */}
        <div className="space-y-40 lg:space-y-64">
          {selectedWork.projects.map((project) => {
            const projectImg = resolveImagePath(project.image);
            return (
              <div
                key={project.id || project.number}
                data-cursor="project"
                className="group relative grid gap-10 lg:grid-cols-12 lg:items-center"
              >
                {/* Project Image */}
                <div
                  className={`lg:col-span-7 ${
                    project.align === "right" ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="overflow-hidden rounded-xs border border-white/10 bg-[#141414]">
                    <img
                      src={projectImg}
                      alt={project.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div
                  className={`flex flex-col justify-center lg:col-span-5 ${
                    project.align === "right" ? "lg:order-1 lg:pr-12" : "lg:order-2 lg:pl-12"
                  } transition-transform duration-500 group-hover:-translate-y-2`}
                >
                  <div className="flex items-center justify-between border-b border-cream/15 pb-4 mb-6">
                    <span className="font-display text-4xl font-bold text-[var(--color-accent,#ff3b00)]">
                      {project.number || project.id}
                    </span>
                    <span className="eyebrow text-muted-text">{project.year}</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-cream uppercase leading-[0.86] tracking-tight mb-4 group-hover:text-[var(--color-accent,#ff3b00)] transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="eyebrow text-cream/70 tracking-widest mb-5">
                    {project.category}
                  </p>

                  <p className="text-sm text-muted-text leading-relaxed mb-8 max-w-lg">
                    {project.description}
                  </p>

                  <div>
                    <Link
                      to={project.href || "/work"}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cream group-hover:text-[var(--color-accent,#ff3b00)] transition-colors"
                    >
                      <span>EXPLORE PROJECT</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. WHAT WE DO SECTION
// ==========================================
export function WhatWeDoSection() {
  const { home } = useSiteData();
  const { services } = home;

  return (
    <section id="services" className="bg-[#0d0d0d] px-5 py-32 lg:py-48 md:px-10 border-t border-cream/10">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-20 lg:mb-28 flex flex-col md:flex-row md:items-center justify-between border-b border-cream/15 pb-6 gap-4">
          <p className="eyebrow text-[var(--color-accent,#ff3b00)]">{services.eyebrow}</p>
          <p className="eyebrow text-muted-text">{services.title}</p>
        </div>

        {/* Horizontal Service Rows */}
        <div className="divide-y divide-cream/15 border-b border-cream/15">
          {services.items.map((s) => (
            <div
              key={s.number || s.title}
              className="group py-12 lg:py-16 transition-colors duration-500 hover:bg-cream/5 px-4 md:px-6"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Number & Service Name */}
                <div className="lg:col-span-8 flex items-baseline gap-6 lg:gap-10">
                  <span className="font-display text-2xl lg:text-3xl text-[var(--color-accent,#ff3b00)] opacity-80 group-hover:opacity-100 transition-opacity">
                    {s.number}
                  </span>
                  <h3 className="text-display-service text-cream uppercase leading-[0.84] tracking-tight group-hover:text-[var(--color-accent,#ff3b00)] group-hover:translate-x-3 transition-all duration-500">
                    {s.title}
                  </h3>
                </div>

                {/* Right Aligned Description */}
                <div className="lg:col-span-4">
                  <p className="text-sm text-muted-text leading-relaxed font-normal group-hover:text-cream/90 transition-colors">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. BRAND STATEMENT SECTION
// ==========================================
export function BrandStatementSection() {
  const { site, home } = useSiteData();
  const { statement } = home;

  return (
    <section className="bg-[#080808] px-5 py-36 lg:py-56 md:px-10 border-t border-cream/10 relative overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        <p className="eyebrow mb-8 lg:mb-10 text-[var(--color-accent,#ff3b00)]">{statement.eyebrow || "OUR PHILOSOPHY"}</p>

        <h2 className="font-display text-[11vw] sm:text-[9vw] lg:text-[7.5vw] leading-[0.84] text-cream uppercase tracking-tight mb-16 lg:mb-24">
          {statement.title.map((line, idx) => (
            <span key={idx} className={`block mb-1.5 ${idx === 1 ? "text-[var(--color-accent,#ff3b00)]" : ""}`}>
              {line}
            </span>
          ))}
        </h2>

        <div className="grid gap-8 md:grid-cols-12 md:items-end border-t border-cream/10 pt-12 lg:pt-16 mt-12 lg:mt-16">
          <div className="md:col-span-7">
            <p className="text-lg sm:text-xl text-cream/90 font-light leading-relaxed max-w-2xl">
              {statement.description}
            </p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <span className="eyebrow text-muted-text">EST. {site.year} · {site.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. SELECTED CLIENTS / BUILT WITH KRAQEN
// ==========================================
export function BuiltWithSection() {
  const { site, about } = useSiteData();
  const projects = about.projects.length > 0 ? about.projects : [
    "KRAQEN INNOVATIONS",
    "CONTENTHUB.DIY",
    "MCC BCA",
    "SHINE ON STORIES",
    "RSS GARMENTS",
    "QUICKMEET",
  ];

  return (
    <section id="built-with" className="bg-[#0d0d0d] px-5 py-32 lg:py-48 md:px-10 border-t border-cream/10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 lg:mb-24 flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream/10 pb-6 gap-4">
          <p className="eyebrow text-[var(--color-accent,#ff3b00)]">PARTNERS & PROJECTS</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-cream uppercase">
            BUILT WITH {site.shortName || "KRAQEN"}.
          </h2>
        </div>

        {/* Minimal Monochrome Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-cream/15 border border-cream/15">
          {projects.map((client, idx) => (
            <div
              key={idx}
              className="group flex aspect-[16/9] items-center justify-center bg-[#0d0d0d] p-6 text-center transition-colors duration-500 hover:bg-[#151515]"
            >
              <span className="font-display text-xl sm:text-2xl md:text-3xl tracking-wider text-cream/70 group-hover:text-[var(--color-accent,#ff3b00)] group-hover:scale-105 transition-all duration-300">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 6. FINAL CTA SECTION (#FF3B00 Electric Orange-Red)
// ==========================================
export function FinalCTASection() {
  const { footer } = useSiteData();

  return (
    <section id="contact" className="bg-[var(--color-accent,#ff3b00)] px-5 py-36 lg:py-52 text-white md:px-10 relative overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          {/* Display Heading */}
          <div className="lg:col-span-8">
            <p className="eyebrow text-white/80 mb-6 lg:mb-8 tracking-[0.3em]">{footer.eyebrow}</p>
            <h2 className="font-display text-[13vw] sm:text-[11vw] lg:text-[8.5vw] leading-[0.82] uppercase tracking-tight text-white">
              {footer.title.map((line, idx) => (
                <span key={idx} className="block mb-1">{line}</span>
              ))}
            </h2>
          </div>

          {/* CTA Text + Button */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-10 border-t border-white/20 pt-10 lg:border-t-0 lg:pt-0">
            <p className="text-base sm:text-lg text-white/95 leading-relaxed font-normal">
              {footer.description}
            </p>

            <Link
              to={footer.cta?.href || "/contact"}
              data-cursor="cta"
              className="group inline-flex w-fit items-center justify-center gap-3 rounded-full bg-white px-8 py-5 text-xs font-bold tracking-widest text-[var(--color-accent,#ff3b00)] transition-all duration-500 hover:bg-[#0d0d0d] hover:text-white shadow-2xl"
            >
              <span>{footer.cta?.label || "START A PROJECT ↗"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

