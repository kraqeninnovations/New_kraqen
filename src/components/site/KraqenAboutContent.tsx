import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { FinalCTASection } from "./KraqenSections";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function AboutPageContent() {
  const { about } = useSiteData();
  const { hero, whyChooseKraqen, expertise, vision, impact } = about;

  // Fallbacks if site.json hasn't populated
  const whyItems = whyChooseKraqen?.items || [
    { number: "01", title: "STRATEGY-FIRST APPROACH", description: "We start with insights and build with purpose." },
    { number: "02", title: "CONVERSION-FOCUSED DESIGN", description: "Every element is designed to convert." },
    { number: "03", title: "SCALABLE SYSTEMS", description: "Built to grow with your brand." },
    { number: "04", title: "PERFORMANCE-DRIVEN EXECUTION", description: "Data-led strategies for real results." },
  ];

  const expItems = expertise?.items || [
    { number: "01", title: "BRANDING", description: "We craft distinctive brand identities with clear visuals, voice, and systems that make your brand memorable and consistent everywhere." },
    { number: "02", title: "SOCIAL MEDIA", description: "We manage your social presence with strategy, content, and growth systems that turn attention into engagement and real audience growth." },
    { number: "03", title: "WEB DESIGN", description: "We build fast, modern, and conversion-focused websites designed to attract, engage, and turn visitors into leads." },
    { number: "04", title: "PERFORMANCE MARKETING", description: "We run and scale high-performing ad campaigns across platforms to maximize ROI and drive measurable business growth." },
    { number: "05", title: "CONTENT CREATION", description: "We produce high-quality content, from reels to visuals, designed to capture attention and move your audience to act." },
    { number: "06", title: "SAAS & TECH TOOLS", description: "We develop smart tools and systems that automate workflows, streamline operations, and support your business growth." },
  ];

  const impactItems = impact?.items || [
    { value: "10+", label: "BRANDS SERVED AND COUNTING", description: "Trusted by growing brands across 7 different industries." },
    { value: "90%", label: "CLIENT RETENTION RATE", description: "Because we deliver results." },
    { value: "2X", label: "AVERAGE GROWTH", description: "Average business growth achieved across our client portfolio." },
    { value: "6", label: "CORE SERVICES", description: "A full-stack agency from branding to performance to SaaS." },
  ];

  return (
    <div className="bg-[#111111] text-[#F3F0E6] min-h-screen">
      {/* ==========================================
          1. ABOUT HERO SECTION
         ========================================== */}
      <section className="pt-32 sm:pt-36 lg:pt-44 px-5 md:px-10 pb-20 sm:pb-24 lg:pb-32 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Massive Display Heading */}
            <div className="lg:col-span-7">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
                className="font-display text-[22vw] sm:text-[18vw] lg:text-[14vw] leading-[0.84] uppercase tracking-[-0.035em] text-[#F3F0E6]"
              >
                {hero?.eyebrow || "ABOUT US"}
              </motion.h1>
            </div>

            {/* Editorial Description Paragraph */}
            <div className="lg:col-span-5 lg:pt-8 lg:pl-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
                className="max-w-md space-y-4"
              >
                <p className="eyebrow text-[#FF3B00] tracking-[0.2em] font-semibold">KRAQEN INNOVATIONS</p>
                <p className="text-sm sm:text-base text-[#B7B4AC] leading-relaxed font-normal">
                  {hero?.description || "Built for brands that hate boring, we mix creative energy with digital strategy to make businesses impossible to ignore."}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. WHY CHOOSE KRAQEN
         ========================================== */}
      <section className="py-24 sm:py-32 lg:py-44 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="mb-16 lg:mb-24">
            <p className="eyebrow text-[#FF3B00] mb-3 font-semibold tracking-widest text-xs">WHY WORK WITH US</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#F3F0E6] uppercase leading-[0.88] tracking-[-0.03em]">
              {whyChooseKraqen?.title || "WHY CHOOSE KRAQEN"}
            </h2>
          </div>

          {/* 4 Feature Blocks Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {whyItems.map((item, idx) => (
              <motion.div
                key={item.number || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: EASE_OUT }}
                className="bg-[#141414] border border-[rgba(243,240,230,0.15)] p-8 sm:p-10 flex flex-col justify-between space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[rgba(243,240,230,0.1)] pb-4">
                  <span className="font-display text-2xl sm:text-3xl text-[#FF3B00] font-bold">
                    {item.number}
                  </span>
                  <span className="eyebrow text-[#777777] text-[10px] tracking-widest uppercase">FEATURE {item.number}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#F3F0E6] uppercase leading-[0.88] tracking-[-0.025em]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B7B4AC] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. OUR EXPERTISE
         ========================================== */}
      <section className="py-24 sm:py-32 lg:py-44 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(243,240,230,0.2)] pb-6">
            <div>
              <p className="eyebrow text-[#FF3B00] mb-2 font-semibold tracking-widest text-xs">CORE CAPABILITIES</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#F3F0E6] uppercase leading-[0.88] tracking-[-0.03em]">
                {expertise?.title || "OUR EXPERTISE"}
              </h2>
            </div>
            <p className="eyebrow text-[#777777] text-xs font-medium">FULL-STACK CREATIVE TECHNOLOGY</p>
          </div>

          {/* Services Rows List */}
          <div className="divide-y divide-[rgba(243,240,230,0.2)] border-b border-[rgba(243,240,230,0.2)]">
            {expItems.map((s, idx) => (
              <motion.div
                key={s.number || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: EASE_OUT }}
                className="group py-8 sm:py-10 lg:py-14 px-4 transition-colors duration-300 hover:bg-[rgba(243,240,230,0.04)] cursor-default"
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7 flex items-baseline gap-6 lg:gap-10">
                    <span className="font-display text-2xl sm:text-3xl text-[#FF3B00] font-bold">
                      {s.number}
                    </span>
                    <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#F3F0E6] uppercase leading-[0.86] tracking-[-0.03em] group-hover:text-[#FF3B00] group-hover:translate-x-2 transition-all duration-300 flex items-center gap-3">
                      <span>{s.title}</span>
                      <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FF3B00]" />
                    </h3>
                  </div>

                  <div className="lg:col-span-5 lg:pl-6">
                    <p className="text-xs sm:text-sm text-[#A5A29B] group-hover:text-[#F3F0E6] leading-relaxed font-normal transition-colors duration-300">
                      {s.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. OUR VISION
         ========================================== */}
      <section className="py-32 sm:py-40 lg:py-52 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <p className="eyebrow text-[#FF3B00] mb-8 font-semibold tracking-widest text-xs">
            {vision?.eyebrow || "OUR VISION"}
          </p>

          <p className="font-display text-xl sm:text-2xl lg:text-3xl text-[#B7B4AC] uppercase tracking-tight mb-8">
            {vision?.intro || "WE BUILD BRANDS THAT DON'T JUST EXIST-"}
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE_OUT }}
            className="font-display text-[12vw] sm:text-[10vw] lg:text-[8vw] leading-[0.84] sm:leading-[0.86] lg:leading-[0.88] text-[#F3F0E6] uppercase tracking-[-0.035em] max-w-6xl"
          >
            {(vision?.statement || ["THEY PERFORM,", "SCALE,", "AND DOMINATE."]).map((line, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: EASE_OUT }}
                className={`block mb-2 ${idx === 0 ? "text-[#FF3B00]" : ""}`}
              >
                {line}
              </motion.span>
            ))}
          </motion.h2>
        </div>
      </section>

      {/* ==========================================
          5. OUR IMPACT
         ========================================== */}
      <section className="py-24 sm:py-32 lg:py-44 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="mb-16 lg:mb-24">
            <p className="eyebrow text-[#FF3B00] mb-3 font-semibold tracking-widest text-xs">PROVEN RESULTS</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#F3F0E6] uppercase leading-[0.88] tracking-[-0.03em]">
              {impact?.title || "OUR IMPACT"}
            </h2>
          </div>

          {/* 4 Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {impactItems.map((stat, idx) => (
              <motion.div
                key={stat.label || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: EASE_OUT }}
                className="space-y-4 border-t border-[rgba(243,240,230,0.15)] pt-6"
              >
                <div className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#F3F0E6] leading-[0.8] tracking-tight">
                  {stat.value}
                </div>
                <p className="eyebrow text-[#FF3B00] font-bold text-xs tracking-wider uppercase leading-snug">
                  {stat.label}
                </p>
                <p className="text-xs text-[#B7B4AC] leading-relaxed font-normal pt-1">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL ORANGE CTA SECTION */}
      <FinalCTASection />
    </div>
  );
}
