'use client';

import React from 'react';
import Image from 'next/image';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutBlueprintProps {
  data: AboutContent['blueprint'];
}

export default function AboutBlueprint({ data }: AboutBlueprintProps) {
  return (
    <section
      className="bg-[#0f0f0f] px-[var(--page-x)] pt-[var(--space-section)] pb-8 border-b border-white/15"
      aria-label="The Blueprint to Execution"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-tanker text-white uppercase text-[clamp(36px,5.5vw,84px)] leading-[0.88] tracking-tight mb-2">
            {data.title}
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* 3-Step Vertical Timeline */}
        <div className="relative pl-6 md:pl-10 border-l border-white/20 space-y-0">
          {data.steps.map((step, idx) => (
            <div
              key={step.number || idx}
              tabIndex={0}
              className="group relative min-h-[clamp(180px,24vw,300px)] border-b border-white/15 py-8 md:py-12 flex flex-col justify-center overflow-hidden rounded-r-2xl transition-all duration-500 focus:outline-none"
            >
              {/* Timeline Indicator Dot */}
              <div
                className="absolute -left-[31px] md:-left-[47px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#3D5AFE] group-hover:scale-125 transition-transform"
                aria-hidden="true"
              />

              {/* Background Hover Image */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-r-2xl">
                <Image
                  src={step.image}
                  alt={step.alt || step.title}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-20 md:opacity-0 scale-100 md:scale-105 group-hover:opacity-35 group-hover:scale-100 group-focus-within:opacity-35 group-focus-within:scale-100 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
              </div>

              {/* Large Faded Numeral Behind */}
              <div
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 font-tanker text-white/[0.08] group-hover:text-white/[0.14] group-focus-within:text-white/[0.14] text-[clamp(120px,20vw,320px)] leading-none select-none pointer-events-none transition-colors duration-300 z-0"
                aria-hidden="true"
              >
                {step.number}
              </div>

              {/* Content on Top */}
              <div className="relative z-10 pl-4 md:pl-8 max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-wider text-[#B7A8FF] font-bold mb-1 block">
                  PHASE {step.number}
                </span>
                <h3 className="font-tanker text-[clamp(32px,5vw,72px)] uppercase leading-[0.9] text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="font-mono text-xs md:text-sm text-white/80 leading-relaxed max-w-[420px] normal-case">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
