'use client';

import React from 'react';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutIntroProps {
  data: AboutContent['intro'];
}

export default function AboutIntro({ data }: AboutIntroProps) {
  return (
    <section
      className="bg-[#0f0f0f] px-[var(--page-x)] pt-[var(--space-section)] pb-8 border-b border-white/15"
      aria-label="About Introduction"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-16">
        {/* LEFT: Section Title */}
        <div className="w-full md:w-[50%]">
          <h2 className="font-tanker text-white uppercase text-[clamp(36px,5.5vw,84px)] leading-[0.88] tracking-tight">
            {data.title}
          </h2>
        </div>

        {/* RIGHT: Paragraph */}
        <div className="w-full md:w-[50%] flex justify-end">
          <p className="font-mono text-xs md:text-sm text-white/80 leading-relaxed max-w-[560px] normal-case">
            {data.paragraph}
          </p>
        </div>
      </div>
    </section>
  );
}
