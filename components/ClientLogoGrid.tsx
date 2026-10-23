'use client';

import React from 'react';
import Image from 'next/image';

export interface ClientItem {
  id?: string;
  name: string;
  logo: string;
  hoverImage?: string;
  scale?: number;
}

interface ClientLogoGridProps {
  labelLeft?: string;
  labelRight?: string;
  headingLines?: string[];
  clients?: ClientItem[];
  fillEmptyCells?: boolean;
  sectionId?: string;
  sectionAriaLabel?: string;
}

export default function ClientLogoGrid({
  labelLeft = 'OUR CLIENTS',
  labelRight = 'SELECTED PARTNERS',
  headingLines = ['TRUSTED', 'BY THE BOLD'],
  clients = [],
  sectionId = 'partners',
  sectionAriaLabel = 'Partners',
}: ClientLogoGridProps) {
  return (
    <section
      id={sectionId}
      className="bg-[#0f0f0f] py-[clamp(64px,10vw,140px)] section-px"
      aria-label={sectionAriaLabel}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-8">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">{labelLeft}</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">{labelRight}</span>
        </div>
        <h2 className="font-tanker text-white uppercase text-[clamp(40px,7vw,110px)] leading-[0.88] mb-12">
          {headingLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {clients.map((c, i) => (
            <div key={c.id || i} className="p-6 rounded-xl bg-[#151515] flex items-center justify-center">
              <Image
                src={c.logo}
                alt={c.name}
                width={120}
                height={40}
                className="max-h-8 w-auto object-contain brightness-0 invert opacity-60"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
