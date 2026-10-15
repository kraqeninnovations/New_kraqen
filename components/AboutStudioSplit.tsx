'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutStudioSplitProps {
  data: AboutContent['studioSplit'];
}

export default function AboutStudioSplit({ data }: AboutStudioSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const rightImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        const leftImg = leftImgRef.current?.querySelector('img');
        const rightImg = rightImgRef.current?.querySelector('img');

        const targets = [leftImg, rightImg].filter(Boolean);

        if (targets.length > 0) {
          gsap.fromTo(
            targets,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
              },
            }
          );
        }

        const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (leftImg && hasFinePointer) {
          gsap.fromTo(
            leftImg,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (rightImg && hasFinePointer) {
          gsap.fromTo(
            rightImg,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      }, containerRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full overflow-hidden"
      aria-label="Studio Atmosphere"
    >
      <div className="studio-split-container">
        {/* LEFT image (~ 66% width) */}
        <div ref={leftImgRef} className="studio-photo-wrap w-full md:w-[66%]">
          <Image
            src={data.left.src}
            alt={data.left.alt}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
          />
        </div>

        {/* RIGHT image (~ 34% width) */}
        <div ref={rightImgRef} className="studio-photo-wrap w-full md:w-[34%]">
          <Image
            src={data.right.src}
            alt={data.right.alt}
            fill
            sizes="(max-width: 768px) 100vw, 34vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
