'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomeContent } from '@/lib/schemas/home';

interface HeroProps {
  data: HomeContent['hero'];
}

export default function Hero({ data }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const img4Ref = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        gsap.set(lineRefs.current.filter(Boolean), { clearProps: 'all' });
        return;
      }

      ctx = gsap.context(() => {
        const lines = lineRefs.current.filter(Boolean);
        gsap.set(lines, { yPercent: 110 });
        gsap.set([img1Ref.current, img2Ref.current, img3Ref.current, img4Ref.current], {
          opacity: 0,
          scale: 0.95,
        });
        gsap.set(bottomBarRef.current, { opacity: 0, y: 12 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Headline lines slide up
        tl.to(
          lines,
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.08,
          },
          0
        );

        // Images fade/scale in
        tl.to(
          [img1Ref.current, img2Ref.current, img3Ref.current, img4Ref.current],
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.12,
            ease: 'power2.out',
          },
          0.2
        );

        // Bottom bar fades in
        tl.to(
          bottomBarRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          0.6
        );
      }, sectionRef);
    };

    initGSAP();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero relative min-h-[100svh] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: 'var(--bg-hero)' }}
      aria-label="Hero"
    >
      {/* ── IMAGE A: top-center ── */}
      {data.images[0] && (
        <div
          ref={img1Ref}
          className="absolute z-10 pointer-events-none"
          style={{
            top: '4%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(90px, 14vw, 240px)',
          }}
          aria-hidden="true"
        >
          <Image
            src={data.images[0].src}
            alt={data.images[0].alt}
            width={240}
            height={320}
            className="w-full h-auto object-cover opacity-75 md:opacity-100"
            priority
          />
        </div>
      )}

      {/* ── IMAGE B: left runner ── */}
      {data.images[1] && (
        <div
          ref={img2Ref}
          className="absolute pointer-events-none z-0 hidden sm:block"
          style={{
            left: 0,
            top: '16%',
            width: 'clamp(90px, 12vw, 200px)',
            height: 'clamp(120px, 17vw, 270px)',
          }}
          aria-hidden="true"
        >
          <Image
            src={data.images[1].src}
            alt={data.images[1].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 24vw, 12vw"
          />
        </div>
      )}

      {/* ── IMAGE C: left-center ice ── */}
      {data.images[2] && (
        <div
          ref={img3Ref}
          className="absolute z-10 pointer-events-none"
          style={{
            left: '2%',
            top: '28%',
            width: 'clamp(70px, 24vw, 220px)',
            height: 'clamp(90px, 26vw, 300px)',
          }}
          aria-hidden="true"
        >
          <Image
            src={data.images[2].src}
            alt={data.images[2].alt}
            fill
            className="object-cover opacity-50 md:opacity-100"
            sizes="(max-width: 768px) 24vw, 15vw"
          />
        </div>
      )}

      {/* ── IMAGE D: right city ── */}
      {data.images[3] && (
        <div
          ref={img4Ref}
          className="absolute pointer-events-none z-10"
          style={{
            right: '2%',
            top: '26%',
            width: 'clamp(80px, 26vw, 300px)',
          }}
          aria-hidden="true"
        >
          <Image
            src={data.images[3].src}
            alt={data.images[3].alt}
            width={300}
            height={190}
            className="w-full h-auto object-cover opacity-50 md:opacity-100"
            sizes="(max-width: 768px) 26vw, 19vw"
          />
        </div>
      )}

      {/* ── CENTERED HEADLINE ── */}
      <div
        className="flex-1 flex items-center justify-center relative z-20"
        style={{
          paddingTop: 'clamp(88px, 12vw, 160px)',
          paddingBottom: 'clamp(32px, 5vw, 64px)',
          paddingLeft: 'var(--px)',
          paddingRight: 'var(--px)',
        }}
      >
        <h1
          className="font-tanker text-center select-none uppercase tracking-[-0.01em]"
          style={{
            fontSize: 'var(--hero-h1-size)',
            lineHeight: 0.86,
            color: '#FFFFFF',
          }}
          aria-label={data.headlineLines.join(' ')}
        >
          {data.headlineLines.map((line, i) => (
            <span key={i} className="clip-line block overflow-hidden whitespace-nowrap">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block whitespace-nowrap"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* ── BOTTOM AREA (location on left, centered paragraph, centered button under it) ── */}
      <div ref={bottomBarRef} className="relative z-30 mt-auto section-px pb-8 md:pb-12">
        <div className="hairline mb-6 md:mb-8" style={{ backgroundColor: 'var(--line)' }} />

        <div className="relative flex flex-col items-center">
          {/* Location label small on the left (absolute on desktop, top-left on mobile) */}
          <div className="w-full md:absolute md:left-0 md:top-2 text-left mb-4 md:mb-0">
            <span
              className="font-mono text-[11px] tracking-[0.04em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              {data.location}
            </span>
          </div>

          {/* Centered paragraph */}
          <p
            className="font-mono text-[13px] leading-relaxed max-w-[560px] text-center text-white/90 normal-case mb-6"
            style={{ letterSpacing: '0.01em' }}
          >
            {data.paragraph}
          </p>

          {/* Centered CTA button */}
          <div className="w-full sm:w-auto flex justify-center">
            <Link
              href={data.cta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full font-mono text-[13px] uppercase tracking-wider font-bold min-h-[52px] px-9 py-[18px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black hover:bg-white hover:text-brand-purple"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
              }}
            >
              {data.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
