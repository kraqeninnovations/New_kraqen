'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { HomeContent } from '@/lib/schemas/home';

interface WhatWeDoProps {
  data: HomeContent['services'];
}

export default function WhatWeDo({ data }: WhatWeDoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const rows = sectionRef.current?.querySelectorAll('.service-row');
        if (rows && rows.length > 0) {
          gsap.set(rows, { opacity: 0, y: 18 });
          gsap.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          });
        }
      }, sectionRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-[#1a1a1a] section-px"
      style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}
      aria-label="Services"
    >
      {/* Label row */}
      <div className="label-row" style={{ borderColor: 'var(--line)' }}>
        <span style={{ color: 'var(--text-muted)' }}>{data.labelLeft}</span>
        <span style={{ color: 'var(--text-muted)' }}>{data.labelRight}</span>
      </div>

      {/* Service rows */}
      <ul
        className="mt-[clamp(72px,10vw,160px)] list-none"
        aria-label="Services list"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <li className="hairline" style={{ backgroundColor: 'var(--line)' }} aria-hidden="true" />
        {data.items.map((service, i) => (
          <li
            key={service.number}
            className="service-row border-b border-white/15"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <Link
              href={service.href || '/work'}
              aria-label={service.description}
              className="flex flex-col md:flex-row md:items-end justify-between py-6 md:py-8 gap-4 group focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {/* Title (Tanker, var(--text)) */}
              <div
                className="service-title-wrap transition-all duration-300 flex items-baseline gap-4"
                style={{
                  transform: hoveredIndex === i ? 'translateX(16px)' : 'translateX(0)',
                  opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
                }}
              >
                <span className="font-mono text-xs text-white/40 tracking-wider">
                  {service.number}
                </span>
                <span className="font-tanker text-[clamp(36px,5.5vw,90px)] uppercase leading-[0.9] text-white tracking-tight break-words">
                  {service.title}
                </span>
              </div>

              {/* Description (mono 12px, sentence case, max-width 320px) */}
              <div
                className="text-left md:text-right w-full md:max-w-[320px] transition-opacity duration-300"
                style={{
                  opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
                }}
              >
                <p className="font-mono text-xs text-white/70 leading-relaxed normal-case">
                  {service.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
