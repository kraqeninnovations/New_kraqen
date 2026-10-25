'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { HomeContent } from '@/lib/schemas/home';

const FlexCarousel = dynamic<any>(() => import('@/components/fx/FlexCarousel'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full min-h-[320px] bg-[#151515] rounded-2xl animate-pulse"
      aria-hidden="true"
    />
  ),
});

function checkWebGL2(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

interface PartnersProps {
  data: HomeContent['partners'];
  effects?: {
    clientCarousel?: {
      enabled?: boolean;
      preset?: string;
      cardHeight?: number;
      gap?: number;
      radius?: number;
      squeeze?: number;
      autoplay?: boolean;
    };
  };
}

export default function Partners({ data, effects }: PartnersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canMount, setCanMount] = useState(false);
  const [hasWebGl, setHasWebGl] = useState(true);

  const items = data.items || [];
  const carouselConfig = effects?.clientCarousel;
  const isEnabled = carouselConfig?.enabled !== false;

  useEffect(() => {
    const supported = checkWebGL2();
    setHasWebGl(supported);
    if (!supported || !isEnabled) return;

    // Lazy-mount only when within 300px of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCanMount(true);
        }
      },
      { rootMargin: '300px 0px 300px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isEnabled]);

  const carouselItems = items.map((item) => ({
    src:
      item.tile ||
      `/images/clients/tiles/${item.name
        .toLowerCase()
        .replace(/[^\w-]/g, '')}.webp`,
    alt: `${item.name} logo`,
    title: item.name,
    subtitle: 'Client',
  }));

  return (
    <section
      id="partners"
      className="bg-[#0f0f0f] pt-[var(--space-section)] pb-[var(--space-section)]"
      aria-label="Clients & Partners"
    >
      <div className="px-[var(--page-x)] mb-8 md:mb-10">
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

      {/* Visually Hidden List for Screen Readers and SEO */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>

      {/* FlexCarousel Stage or Fallback Grid */}
      <div ref={containerRef} className="px-[var(--page-x)]">
        {isEnabled && hasWebGl ? (
          <div
            className="relative w-full overflow-hidden text-white"
            style={{
              height: 'clamp(300px, 40vw, 520px)',
              touchAction: 'pan-y',
            }}
          >
            {canMount ? (
              <FlexCarousel
                items={carouselItems}
                preset={carouselConfig?.preset || 'arch'}
                intro="bloom"
                fit="landscape"
                cardHeight={carouselConfig?.cardHeight ?? 0.5}
                gap={carouselConfig?.gap ?? 12}
                radius={carouselConfig?.radius ?? 16}
                squeeze={carouselConfig?.squeeze ?? 0.1}
                focusOnClick={true}
                autoplay={carouselConfig?.autoplay ?? false}
                captions={true}
                captureWheel={false}
                bend={0.22}
                dispersion={0.15}
              />
            ) : (
              <div className="w-full h-full bg-[#151515] rounded-2xl animate-pulse" />
            )}
          </div>
        ) : (
          /* Fallback 2-col (mobile) / 4-col (desktop) static image grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div
                key={item.name || idx}
                className="relative aspect-[4/3] rounded-2xl bg-[#151515] border border-white/10 overflow-hidden flex items-center justify-center p-4"
              >
                <Image
                  src={
                    item.tile ||
                    `/images/clients/tiles/${item.name
                      .toLowerCase()
                      .replace(/[^\w-]/g, '')}.webp`
                  }
                  alt={`${item.name} logo`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
