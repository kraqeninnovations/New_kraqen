'use client';

import { useEffect, useRef, useState } from 'react';
import type { AboutContent } from '@/lib/schemas/about';
import type { HomeContent } from '@/lib/schemas/home';

interface AboutWhatWeDoProps {
  data: AboutContent['services'];
  homeServices: HomeContent['services'];
}

export default function AboutWhatWeDo({ data, homeServices }: AboutWhatWeDoProps) {
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
        const rows = sectionRef.current?.querySelectorAll('.about-service-row');
        if (rows && rows.length > 0) {
          gsap.set(rows, { opacity: 0, y: 20 });
          gsap.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          });
        }
      }, sectionRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  const items = data.useHomeServices || !data.items || data.items.length === 0 ? homeServices.items : data.items;

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="bg-[#0f0f0f] section-px"
      style={{ paddingTop: 'var(--section-gap)', paddingBottom: '120px' }}
      aria-label="What We Do"
    >
      {/* Label row */}
      <div
        className="flex justify-between items-end pb-[14px] border-b"
        style={{ borderColor: 'var(--line)' }}
      >
        <span className="font-mono text-[11px] tracking-[0.04em] uppercase" style={{ color: 'var(--text-muted)' }}>
          {data.labelLeft}
        </span>
        <span className="font-mono text-[11px] tracking-[0.04em] uppercase" style={{ color: 'var(--text-muted)' }}>
          {data.labelRight}
        </span>
      </div>

      {/* Services List */}
      <ul
        className="mt-[clamp(72px,10vw,160px)] list-none"
        aria-label="Services list"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {items.map((service, i) => (
          <li
            key={service.number}
            className="about-service-row flex flex-col md:flex-row md:items-end justify-between py-4 md:py-1 gap-2"
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
              <span className="about-service-name block" style={{ color: 'var(--text)' }}>
                {service.name}
              </span>
            </div>

            {/* Number + Description (under title on mobile, right on desktop) */}
            <div
              className="text-left md:text-right pb-1 max-w-full md:max-w-[340px]"
              style={{
                opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <span className="block font-mono text-[10px] tracking-[0.04em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                {service.number}
              </span>
              <span className="block font-mono text-[11px] tracking-[0.02em] uppercase leading-[1.5]" style={{ color: 'var(--text)' }}>
                {service.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
