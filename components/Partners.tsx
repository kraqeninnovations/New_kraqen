'use client';

import React from 'react';
import Image from 'next/image';
import type { HomeContent } from '@/lib/schemas/home';

interface PartnersProps {
  data: HomeContent['partners'];
}

export default function Partners({ data }: PartnersProps) {
  const runner = data.runner || {
    enabled: true,
    direction: 'horizontal',
    speedSeconds: 40,
    pauseOnHover: true,
  };

  const isVertical = runner.direction === 'vertical';
  const speed = runner.speedSeconds || 40;

  // Duplicate items for seamless loop
  const displayItems = [...data.items, ...data.items];

  return (
    <section
      id="partners"
      className="bg-[#0f0f0f] py-[clamp(64px,10vw,140px)]"
      aria-label="Clients & Partners"
    >
      <div className="section-px mb-12 md:mb-16">
        {/* Label Row */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
            {data.labelLeft}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
            {data.labelRight}
          </span>
        </div>

        {/* Section Heading */}
        <div className="pt-6">
          <h2 className="font-tanker text-white uppercase text-[clamp(44px,7.5vw,110px)] leading-[0.88] tracking-tight">
            {data.headingLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </h2>
        </div>
      </div>

      {/* Infinite Logo Runner */}
      <div
        className={`logo-runner-outer w-full ${isVertical ? 'max-h-[420px]' : ''}`}
        style={
          {
            '--runner-speed': `${speed}s`,
          } as React.CSSProperties
        }
      >
        <div
          className={`logo-runner-track ${
            isVertical ? 'flex-col animate-none' : ''
          }`}
        >
          {displayItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="logo-runner-item flex items-center justify-center"
              title={item.name}
            >
              <Image
                src={item.logo}
                alt={item.name}
                width={120}
                height={48}
                className="max-h-[36px] md:max-h-[48px] w-auto object-contain brightness-0 invert opacity-55 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
