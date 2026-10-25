'use client';

import React from 'react';
import Image from 'next/image';
import ScrollRow from '@/components/ScrollRow';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutOnSetProps {
  data: AboutContent['onSet'];
}

export default function AboutOnSet({ data }: AboutOnSetProps) {
  const items = data.items || [];

  const renderTile = (item: typeof items[0]) => (
    <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden bg-[#151515] border border-white/10 group">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  );

  return (
    <section
      className="bg-[#0f0f0f] pt-[var(--space-section)] pb-0 text-white"
      aria-label="On Set and In the Suite"
    >
      <div className="px-[var(--page-x)]">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-tanker text-white uppercase text-[clamp(36px,5.5vw,84px)] leading-[0.88] tracking-tight mb-2">
            {data.title}
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* Desktop / Tablet: Uniform 4:3 Grid (3 cols desktop, 2 cols tablet) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-block)] w-full">
          {items.map((item, idx) => (
            <div key={idx}>
              {renderTile(item)}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: ScrollRow with 78vw cards */}
      <ScrollRow itemCount={items.length} itemWidthClass="w-[78vw] max-w-[340px]">
        {items.map((item, idx) => (
          <div key={idx}>
            {renderTile(item)}
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}
