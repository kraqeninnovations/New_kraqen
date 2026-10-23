'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { WorkContent, WorkItem } from '@/lib/schemas/work';

interface WorkGalleryProps {
  data: WorkContent;
}

const RATIO_MAP: Record<string, number> = {
  '4:5': 0.8,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
};

const RATIO_ASPECT_CSS: Record<string, string> = {
  '4:5': '4 / 5',
  '16:9': '16 / 9',
  '9:16': '9 / 16',
};

// Organize category items into bands according to layout.pattern
function buildBands(items: WorkItem[], pattern: string[][]): WorkItem[][] {
  const bands: WorkItem[][] = [];

  // Create queues by ratio
  const pool: Record<string, WorkItem[]> = {
    '4:5': items.filter((it) => it.ratio === '4:5'),
    '16:9': items.filter((it) => it.ratio === '16:9'),
    '9:16': items.filter((it) => it.ratio === '9:16'),
  };

  let patternIdx = 0;
  let remainingCount = items.length;

  while (remainingCount > 0) {
    const targetRatios = pattern[patternIdx % pattern.length];
    const currentBand: WorkItem[] = [];

    for (const r of targetRatios) {
      if (pool[r] && pool[r].length > 0) {
        const item = pool[r].shift()!;
        currentBand.push(item);
        remainingCount--;
      }
    }

    if (currentBand.length > 0) {
      bands.push(currentBand);
    } else {
      // If none of the target ratios were available, flush whatever is left in any pool
      const leftoverBand: WorkItem[] = [];
      for (const key of ['4:5', '16:9', '9:16']) {
        while (pool[key].length > 0 && leftoverBand.length < 3) {
          leftoverBand.push(pool[key].shift()!);
          remainingCount--;
        }
      }
      if (leftoverBand.length > 0) {
        bands.push(leftoverBand);
      } else {
        break;
      }
    }

    patternIdx++;
  }

  return bands;
}

export default function WorkGallery({ data }: WorkGalleryProps) {
  const { header, categories, items, layout } = data;

  return (
    <div className="bg-[#0f0f0f] text-white pt-28 md:pt-36 pb-24 section-px">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="pb-12 md:pb-16 border-b border-white/15">
          <h1 className="font-tanker text-white uppercase text-[clamp(48px,9vw,140px)] leading-[0.88] tracking-tight mb-4">
            {header.title}
          </h1>
          <p className="font-mono text-sm md:text-base text-white/60 tracking-wider">
            {header.subtitle}
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-[clamp(64px,10vw,140px)] mt-12 md:mt-20">
          {categories.map((category) => {
            const catItems = items.filter((it) => it.category === category.id);
            if (catItems.length === 0) return null;

            const bands = buildBands(catItems, layout.pattern);

            return (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                {/* Category Header */}
                <div className="flex items-baseline justify-between pb-4 mb-6 md:mb-8 border-b border-white/15">
                  <h2
                    id={`cat-${category.id}`}
                    className="font-tanker text-white uppercase text-[clamp(36px,6vw,96px)] leading-none tracking-wide"
                  >
                    {category.title}
                  </h2>
                  <span className="font-mono text-xs md:text-sm text-white/50 tracking-wider">
                    {catItems.length} {catItems.length === 1 ? 'PROJECT' : 'PROJECTS'}
                  </span>
                </div>

                {/* Desktop: Justified Bands */}
                <div className="hidden md:flex flex-col gap-3">
                  {bands.map((band, bandIdx) => {
                    const gridTemplate = band
                      .map((item) => `${RATIO_MAP[item.ratio] || 1}fr`)
                      .join(' ');

                    return (
                      <div
                        key={bandIdx}
                        className="grid gap-3 w-full"
                        style={{ gridTemplateColumns: gridTemplate }}
                      >
                        {band.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/work/${item.slug}`}
                            className="group relative rounded-xl overflow-hidden bg-[#151515] block focus:outline-none focus:ring-2 focus:ring-accent"
                            style={{
                              aspectRatio: RATIO_ASPECT_CSS[item.ratio] || '16 / 9',
                            }}
                          >
                            <Image
                              src={item.poster || item.src}
                              alt={item.alt || item.title}
                              fill
                              sizes="(max-width: 1400px) 50vw, 400px"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                            />

                            {/* Caption Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1 font-bold">
                                {item.clientIndustry || item.category}
                              </span>
                              <h3 className="font-tanker text-2xl uppercase text-white tracking-wide mb-2">
                                {item.title}
                              </h3>
                              <span className="font-mono text-xs text-white/90 uppercase tracking-wider flex items-center gap-1 font-bold">
                                VIEW PROJECT <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile: 2-Column Grid */}
                <div className="grid md:hidden grid-cols-2 gap-2">
                  {catItems.map((item) => {
                    const isWide = item.ratio === '16:9';
                    return (
                      <Link
                        key={item.slug}
                        href={`/work/${item.slug}`}
                        className={`group relative rounded-lg overflow-hidden bg-[#151515] block focus:outline-none focus:ring-2 focus:ring-accent ${
                          isWide ? 'col-span-2' : 'col-span-1'
                        }`}
                        style={{
                          aspectRatio: RATIO_ASPECT_CSS[item.ratio] || '16 / 9',
                        }}
                      >
                        <Image
                          src={item.poster || item.src}
                          alt={item.alt || item.title}
                          fill
                          sizes="90vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                          <h3 className="font-tanker text-sm text-white uppercase tracking-wide">
                            {item.title}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
