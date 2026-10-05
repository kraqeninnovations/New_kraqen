import { createFileRoute, Link } from "@tanstack/react-router";
import { useSiteData } from "@/lib/site-data";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FinalCTASection } from "@/components/site/KraqenSections";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "SERVICES — KRAQEN INNOVATIONS" },
      {
        name: "description",
        content: "Full-service digital development, web engineering, UI/UX design, and cloud infrastructure.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { home, about } = useSiteData();
  const services = about.services;

  return (
    <div className="bg-[#111111] text-[#F3F0E6] min-h-screen pt-32 sm:pt-36 lg:pt-44">
      <section className="px-5 md:px-10 pb-20 border-b border-cream/15">
        <div className="mx-auto max-w-[1440px]">
          <p className="eyebrow text-[var(--color-accent,#ff3b00)] mb-4">OUR CAPABILITIES</p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="font-display text-[20vw] sm:text-[16vw] lg:text-[12vw] leading-[0.84] uppercase tracking-[-0.035em] text-[#F3F0E6]"
          >
            SERVICES
          </motion.h1>
        </div>
      </section>

      <section className="py-24 sm:py-32 px-5 md:px-10 border-b border-cream/15">
        <div className="mx-auto max-w-[1440px]">
          <div className="divide-y divide-cream/20 border-b border-cream/20">
            {services.map((s) => (
              <div key={s.number} className="group py-10 lg:py-14 px-4 transition-colors hover:bg-cream/5">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8 flex items-baseline gap-6 lg:gap-10">
                    <span className="font-display text-2xl sm:text-3xl text-cream/70">{s.number}</span>
                    <h2 className="text-display-service text-[#F3F0E6] uppercase group-hover:text-[var(--color-accent,#ff3b00)] transition-colors">
                      {s.title}
                    </h2>
                  </div>
                  <div className="lg:col-span-4">
                    <p className="text-xs sm:text-sm text-[#B7B4AC] leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  );
}
