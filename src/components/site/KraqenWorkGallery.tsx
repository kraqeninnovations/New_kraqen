import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import type { WorkProjectItem } from "@/lib/types";
import kraqenHero1 from "@/assets/kraqen_hero_1.jpg";
import kraqenHero2 from "@/assets/kraqen_hero_2.jpg";
import kraqenHero3 from "@/assets/kraqen_hero_3.jpg";
import kraqenProject4 from "@/assets/kraqen_project_4.jpg";
import kraqenProject5 from "@/assets/kraqen_project_5.jpg";
import p1 from "@/assets/p1.jpg";
import { FinalCTASection } from "./KraqenSections";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function resolveImagePath(path: string, fallbackIdx: number = 0): string {
  if (!path) return kraqenHero2;
  if (path === "/assets/kraqen_hero_1.jpg") return kraqenHero1;
  if (path === "/assets/kraqen_hero_2.jpg") return kraqenHero2;
  if (path === "/assets/kraqen_hero_3.jpg") return kraqenHero3;
  if (path === "/assets/kraqen_project_4.jpg") return kraqenProject4;
  if (path === "/assets/kraqen_project_5.jpg") return kraqenProject5;
  if (path === "/assets/p1.jpg") return p1;
  return path;
}

export function WorkPageContent() {
  const { work } = useSiteData();
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = work.filters.length > 0 ? work.filters : [
    { key: "all", label: "ALL WORK" },
    { key: "web", label: "WEB DEVELOPMENT" },
    { key: "ai", label: "AI PLATFORMS" },
    { key: "realtime", label: "REAL-TIME / MEDIA" },
    { key: "brand", label: "BRANDING" }
  ];

  const projects = work.projects;

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.categoryKey === activeFilter);

  const leftColumnProjects = filteredProjects.filter((p) => p.column === "left");
  const rightColumnProjects = filteredProjects.filter((p) => p.column === "right");

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-cream pt-32 sm:pt-36 lg:pt-44">
      {/* 1. WORK HERO SECTION */}
      <section className="px-5 md:px-10 mb-20 sm:mb-24 lg:mb-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start border-b border-cream/15 pb-16 lg:pb-20">
            {/* Left: Giant WORK Heading */}
            <div className="lg:col-span-6">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
                className="font-display text-[22vw] sm:text-[18vw] lg:text-[13vw] leading-[0.84] uppercase tracking-[-0.035em] text-cream"
              >
                {work.title}
              </motion.h1>
            </div>

            {/* Right: Category Description Block & Filter Links */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-10 lg:pt-4">
              {/* Category Filter Links */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold tracking-widest uppercase">
                <span className="text-[var(--color-accent,#ff3b00)] eyebrow mr-2">FILTER:</span>
                {filters.map((cat) => {
                  const isActive = activeFilter === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveFilter(cat.key)}
                      className={`transition-colors duration-300 py-1 ${
                        isActive
                          ? "text-[var(--color-accent,#ff3b00)] underline underline-offset-8 decoration-2"
                          : "text-cream/70 hover:text-cream"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Category Overview Text Block */}
              <div className="space-y-4 pt-6 border-t border-cream/10">
                <div className="flex items-center justify-between text-xs text-muted-text uppercase tracking-widest">
                  <span className="text-[var(--color-accent,#ff3b00)] font-semibold">{work.eyebrow}</span>
                  <span>/ 2026</span>
                </div>
                <p className="font-display text-lg sm:text-xl lg:text-2xl text-cream uppercase leading-[0.88] tracking-[-0.025em]">
                  {filters.map((f) => f.label).join(", ")}
                </p>
                <p className="text-xs sm:text-sm text-muted-text font-normal leading-relaxed pt-2">
                  {work.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN ASYMMETRICAL EDITORIAL GALLERY */}
      <section className="px-5 md:px-10 pb-36 sm:pb-44 lg:pb-60">
        <div className="mx-auto max-w-[1440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Desktop 2-Column Asymmetrical Masonry Grid */}
              <div className="hidden md:grid md:grid-cols-2 md:gap-16 lg:gap-24 items-start">
                {/* Left Column */}
                <div className="space-y-36 lg:space-y-52">
                  {leftColumnProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>

                {/* Right Column with Asymmetrical Top Stagger */}
                <div className="space-y-36 lg:space-y-52 pt-24 lg:pt-40">
                  {rightColumnProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>

              {/* Mobile Single Column Editorial Rhythm */}
              <div className="space-y-24 sm:space-y-32 md:hidden">
                {filteredProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 3. FINAL CTA SECTION */}
      <FinalCTASection />
    </div>
  );
}

function ProjectCard({ project }: { project: WorkProjectItem }) {
  const imageSrc = resolveImagePath(project.image);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 1.03, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      data-cursor="project"
      className={`group relative flex flex-col space-y-6 sm:space-y-8 ${project.marginTop || 'mt-0'}`}
    >
      {/* Image Container with subtle zoom effect */}
      <div className={`overflow-hidden rounded-xs border border-white/10 bg-[#141414] ${project.aspect || 'aspect-[16/9]'} w-full`}>
        <img
          src={imageSrc}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Metadata Block with Controlled Spacing System */}
      <div className="flex flex-col space-y-4 pt-4 border-t border-cream/10">
        {/* Project Number */}
        <div className="flex items-center justify-between text-xs tracking-widest text-muted-text uppercase">
          <span className="font-display text-[var(--color-accent,#ff3b00)] font-bold text-lg sm:text-xl tracking-tight">
            {project.number}
          </span>
          <span className="text-cream/60">{project.year}</span>
        </div>

        {/* Project Title */}
        <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-cream uppercase leading-[0.88] tracking-[-0.025em] group-hover:text-[var(--color-accent,#ff3b00)] transition-colors duration-300">
          {project.title}
        </h3>

        {/* Category & Explore Link */}
        <div className="flex items-center justify-between text-xs uppercase tracking-wider pt-1">
          <span className="eyebrow text-cream/70 font-medium">{project.categoryLabel}</span>
          <span className="inline-flex items-center gap-1.5 text-cream/80 group-hover:text-[var(--color-accent,#ff3b00)] transition-colors font-semibold">
            <span>EXPLORE</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        {/* Project Description */}
        <p className="text-xs sm:text-sm text-muted-text font-normal leading-relaxed pt-2 max-w-lg">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

