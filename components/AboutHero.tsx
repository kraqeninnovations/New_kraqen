'use client';

import React from 'react';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutHeroProps {
  data: AboutContent['hero'];
}

export default function AboutHero({ data }: AboutHeroProps) {
  return (
    <section
      className="bg-[#0f0f0f] section-px pt-28 md:pt-40 pb-12 md:pb-16 border-b border-white/15"
      aria-label="About Hero"
    >
      <div className="max-w-[1400px] mx-auto">
        <h1 className="font-tanker text-white uppercase text-[clamp(48px,10vw,150px)] leading-[0.88] tracking-tight mb-4">
          {data.title}
        </h1>
        <p className="font-mono text-sm md:text-base text-white/60 tracking-wider">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}

