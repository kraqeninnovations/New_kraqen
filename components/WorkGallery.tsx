'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollRow from '@/components/ScrollRow';
import Button from '@/components/Button';
import type { WorkContent, WorkItem } from '@/lib/schemas/work';

interface WorkGalleryProps {
  data: WorkContent;
}

export default function WorkGallery({ data }: WorkGalleryProps) {
  const { header, categories, items } = data;

  const renderProjectCard = (item: WorkItem, isMobile = false) => {
    const mediaBadge = (item.mediaType || 'reel').toUpperCase();
    const handleText = item.source ? `@${item.source}` : '@kraqen.innovations';

    return (
      <Link
        key={item.slug}
        href={`/work/${item.slug}`}
        className="group relative rounded-lg overflow-hidden bg-[#151515] block focus:outline-none focus:ring-2 focus:ring-[#3D5AFE] aspect-[4/5] w-full"
      >
        <Image
          src={item.image || item.poster || item.src || '/images/work/reel-01.webp'}
          alt={item.alt || item.title}
          fill
          sizes={isMobile ? '62vw' : '(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'}
          style={{ objectPosition: item.focus || '50% 30%' }}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Media Badge Top-Left */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="font-mono text-[9px] uppercase tracking-wider bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full border border-white/10">
            {mediaBadge}
          </span>
        </div>

        {/* Hover / Bottom Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 md:p-5 flex flex-col justify-end transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#B7A8FF] mb-1 font-bold">
            {handleText}
          </span>
          <h3 className="font-tanker text-lg md:text-xl uppercase text-white tracking-wide leading-tight mb-2">
            {item.title}
          </h3>
          <span className="font-mono text-[10px] text-white/90 uppercase tracking-wider flex items-center gap-1 font-bold">
            VIEW PROJECT <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </Link>
    );
  };

  const renderCtaFiller = (index: number) => (
    <div
      key={`filler-${index}`}
      className="rounded-lg overflow-hidden bg-[#151515] border border-white/10 p-6 flex flex-col justify-between aspect-[4/5] w-full"
    >
      <div>
        <span className="font-mono text-[10px] text-[#B7A8FF] uppercase tracking-wider block mb-2">
          NEW CAMPAIGN
        </span>
        <h3 className="font-tanker text-2xl uppercase text-white tracking-wide leading-[0.9]">
          LET&apos;S BUILD SOMETHING CULT.
        </h3>
      </div>
      <div>
        <p className="font-mono text-[11px] text-white/60 mb-4 normal-case">
          Ready to engineer visual culture for your brand?
        </p>
        <Button href="/contact" className="!h-[40px] !px-5 !text-[10px] w-full">
          START A PROJECT →
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] text-white pt-[80px] md:pt-[96px] pb-16 px-[var(--page-x)]">
      <div className="max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="pb-8 md:pb-12 border-b border-white/15">
          <h1 className="font-tanker text-white uppercase text-[clamp(52px,9vw,140px)] leading-[0.88] tracking-tight mb-3">
            {header.title}
          </h1>
          <p className="font-mono text-xs md:text-sm text-white/60 tracking-wider">
            {header.subtitle}
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12 md:space-y-16 mt-8 md:mt-12">
          {categories.map((category) => {
            const catItems = items.filter((it) => it.category === category.id);
            if (catItems.length === 0) return null;

            // Fill row on desktop (4 cols) so there are no empty gaps
            const remainder = catItems.length % 4;
            const fillersNeeded = remainder === 0 ? 0 : 4 - remainder;

            return (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                {/* Category Header */}
                <div className="flex items-baseline justify-between pb-3 mb-4 md:mb-6 border-b border-white/15">
                  <h2
                    id={`cat-${category.id}`}
                    className="font-tanker text-white uppercase text-[clamp(28px,4.5vw,72px)] leading-none tracking-wide"
                  >
                    {category.title}
                  </h2>
                  <span className="font-mono text-xs text-white/50 tracking-wider">
                    {catItems.length} {catItems.length === 1 ? 'PROJECT' : 'PROJECTS'}
                  </span>
                </div>

                {/* Desktop: Uniform 4:5 Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
                  {catItems.map((item) => renderProjectCard(item, false))}
                  {Array.from({ length: fillersNeeded }).map((_, idx) =>
                    renderCtaFiller(idx)
                  )}
                </div>

                {/* Mobile: ScrollRow with 62vw cards */}
                <div className="md:hidden">
                  <ScrollRow itemCount={catItems.length} itemWidthClass="w-[62vw] max-w-[280px]">
                    {catItems.map((item) => renderProjectCard(item, true))}
                  </ScrollRow>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
