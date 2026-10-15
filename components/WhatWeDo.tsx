'use client';

import { useEffect, useRef, useState } from 'react';
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
            className="service-row flex flex-col md:flex-row md:items-end justify-between py-4 md:py-2 gap-2"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            {/* Title (Tanker, var(--text)) */}
            <div
              className="service-title-wrap"
              style={{
                transform: hoveredIndex === i ? 'translateX(16px)' : 'translateX(0)',
                opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
              }}
            >
              <span className="service-name block" style={{ color: 'var(--text)' }}>
                {service.name}
              </span>
            </div>

            {/* Number + description */}
            <div
              className="text-left md:text-right w-full md:max-w-[280px]"
              style={{
                opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <span
                className="block"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                }}
              >
                {service.number}
              </span>
              <span
                className="block"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  lineHeight: 1.5,
                }}
              >
                {service.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
