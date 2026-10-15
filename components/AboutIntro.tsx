'use client';

import { useEffect, useRef } from 'react';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutIntroProps {
  data: AboutContent['intro'];
}

export default function AboutIntro({ data }: AboutIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleInnerRef = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        });

        if (titleInnerRef.current) {
          gsap.set(titleInnerRef.current, { yPercent: 100 });
          tl.to(
            titleInnerRef.current,
            {
              yPercent: 0,
              duration: 1.1,
              ease: 'power3.out',
            },
            0
          );
        }

        if (paragraphRef.current) {
          gsap.set(paragraphRef.current, { opacity: 0, y: 16 });
          tl.to(
            paragraphRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
            },
            0.2
          );
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
      className="bg-[#0f0f0f] section-px pt-[clamp(64px,9vw,96px)] pb-[clamp(32px,8vw,120px)]"
      style={{ color: 'var(--text)' }}
      aria-label="About Introduction"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8">
        {/* LEFT: Giant Tanker "ABOUT" on one line */}
        <div className="w-full md:w-[50%] overflow-hidden">
          <h1 className="about-title reveal-line" style={{ color: 'var(--text)' }}>
            <span ref={titleInnerRef} className="reveal-line-inner block">
              {data.title}
            </span>
          </h1>
        </div>

        {/* RIGHT: Paragraph starting around 59% of page width, moves below on mobile */}
        <div className="w-full md:w-[41%] md:pl-[clamp(0px,2vw,32px)]">
          <p
            ref={paragraphRef}
            className="about-intro-text max-w-[340px]"
            style={{ color: 'var(--text)' }}
          >
            {data.paragraph}
          </p>
        </div>
      </div>
    </section>
  );
}
