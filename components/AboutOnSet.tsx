'use client';

import React from 'react';
import Image from 'next/image';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutOnSetProps {
  data: AboutContent['onSet'];
}

export default function AboutOnSet({ data }: AboutOnSetProps) {
  return (
    <section
      className="bg-[#141414] section-px py-[clamp(64px,10vw,140px)] border-b border-white/15"
      aria-label="On Set and In the Suite"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-tanker text-white uppercase text-[clamp(40px,6.5vw,96px)] leading-[0.88] tracking-tight mb-3">
            {data.title}
          </h2>
          <p className="font-mono text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3"
          style={{
            gridAutoRows: 'clamp(70px, 8vw, 120px)',
            gridAutoFlow: 'dense',
          }}
        >
          {data.items.map((item, idx) => {
            let desktopSpan = 'md:col-span-4 md:row-span-4'; // square
            let mobileSpan = 'col-span-1 row-span-1';

            if (item.shape === 'wide') {
              desktopSpan = 'md:col-span-7 md:row-span-4';
              mobileSpan = 'col-span-2 row-span-1';
            } else if (item.shape === 'tall') {
              desktopSpan = 'md:col-span-5 md:row-span-6';
              mobileSpan = 'col-span-1 row-span-2';
            }

            return (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden bg-[#222] ${mobileSpan} ${desktopSpan} group`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

