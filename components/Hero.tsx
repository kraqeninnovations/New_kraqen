'use client';

import { useEffect, useRef } from 'react';
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
            stagger: 0.1,
            ease: 'power2.out',
          },
          0.2
        );

        // Bottom bar
        tl.to(bottomBarRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.8);
      }, sectionRef);

      // Mouse parallax only on desktop with pointer fine
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!hasFinePointer) return;

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(img1Ref.current, { x: x * -18, y: y * -10, duration: 1, ease: 'power2.out' });
        gsap.to(img2Ref.current, { x: x * 12, y: y * 8, duration: 1, ease: 'power2.out' });
        gsap.to(img3Ref.current, { x: x * -14, y: y * 12, duration: 1, ease: 'power2.out' });
        gsap.to(img4Ref.current, { x: x * 20, y: y * -6, duration: 1, ease: 'power2.out' });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    };

    initGSAP();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative bg-[#0f0f0f] overflow-hidden flex flex-col justify-between"
      style={{ minHeight: '100svh' }}
      aria-label="Hero"
    >
      {/* ── IMAGE A: top-center, woman w/ snacks ── */}
      {data.images[0] && (
        <div
          ref={img1Ref}
          className="absolute pointer-events-none z-10"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: '-2%',
            width: 'clamp(80px, 24vw, 240px)',
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

      {/* ── IMAGE B: left, blurred runner ── */}
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

      {/* ── IMAGE C: left-center, ice cube ── */}
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

      {/* ── IMAGE D: right, city skyline ── */}
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

      {/* ── CENTERED HEADLINE (one line per array item, using var(--hero-h1-size)) ── */}
      <div
        className="flex-1 flex items-center justify-center relative z-20"
        style={{
          paddingTop: 'clamp(88px, 12vw, 160px)',
          paddingBottom: 'clamp(48px, 8vw, 120px)',
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

      {/* ── BOTTOM BAR (stacks on mobile: location, paragraph, CTA) ── */}
      <div ref={bottomBarRef} className="relative z-30 mt-auto section-px">
        <div className="hairline" style={{ backgroundColor: 'var(--line)' }} />
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-start md:items-center gap-3 md:gap-6 py-5 text-left md:text-center">
          <span
            className="font-mono text-[11px] tracking-[0.04em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {data.location}
          </span>
          <p
            className="font-mono text-[11px] leading-[1.6] max-w-[380px] normal-case"
            style={{ letterSpacing: '0.02em', color: 'var(--text)' }}
          >
            {data.paragraph}
          </p>
          <a
            href={data.cta.href}
            className="font-mono text-[11px] tracking-[0.04em] uppercase transition-colors md:text-right"
            style={{ color: 'var(--text)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#FF3300';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text)';
            }}
          >
            {data.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
