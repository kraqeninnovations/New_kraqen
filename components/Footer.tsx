'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Brand from '@/components/Brand';
import Logo from '@/components/Logo';
import InstallAppBlock from '@/components/InstallAppBlock';
import type { SiteContent } from '@/lib/schemas/site';

interface FooterProps {
  site: SiteContent;
}

export default function Footer({ site }: FooterProps) {
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scale wordmark to exactly fill viewport width on desktop (>= 1024px)
  useEffect(() => {
    let rAFId: number;
    const fitWordmark = () => {
      const el = wordmarkRef.current;
      if (!el) return;
      if (window.innerWidth < 1024) {
        el.style.fontSize = '';
        el.style.display = '';
        return;
      }
      el.style.fontSize = '300px';
      el.style.display = 'block';
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(() => {
        const containerW = document.documentElement.clientWidth;
        const naturalW = el.scrollWidth;
        if (naturalW === 0) return;
        const ratio = containerW / naturalW;
        el.style.fontSize = `${300 * ratio}px`;
      });
    };

    fitWordmark();

    window.addEventListener('resize', fitWordmark);
    return () => {
      cancelAnimationFrame(rAFId);
      window.removeEventListener('resize', fitWordmark);
    };
  }, []);

  // Scroll reveal for CTA lines
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const inners = sectionRef.current?.querySelectorAll('.reveal-line-inner');
        if (inners && inners.length > 0) {
          gsap.set(inners, { yPercent: 100 });
          gsap.to(inners, {
            yPercent: 0,
            duration: 1,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          });
        }
      }, sectionRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  const handleCtaEnter = async () => {
    const { gsap } = await import('gsap');
    gsap.to(arrowRef.current, { x: 6, y: -6, duration: 0.3, ease: 'power2.out' });
  };

  const handleCtaLeave = async () => {
    const { gsap } = await import('gsap');
    gsap.to(arrowRef.current, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
  };

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="footer-section"
      style={{ paddingBottom: 0 }}
      aria-label="Footer"
    >
      <div className="section-px">
        {/* MOBILE LAYOUT (< 768px):
            1. Top row: logo mark (36px) left.
            2. "LET'S WORK TOGETHER" (Tanker, clamp(40px, 12vw, 64px), 2 lines) + arrow icon.
            3. Footer links in two left-aligned columns (mono 12px caps, row gap 14px).
            4. Install block, margin-top clamp(48px, 12vw, 72px).
        */}
        <div className="flex flex-col md:hidden">
          {/* 1. Top row: logo mark (36px) left */}
          <div className="flex items-center">
            <Brand
              variant="default"
              height={36}
              src={site.logos.navbarLogo}
              alt={site.logos.alt}
              className="!p-0"
            />
          </div>

          {/* 2. "LET'S WORK TOGETHER" */}
          <div className="mt-8">
            <Link
              href={site.footer.cta.href}
              className="footer-cta block"
              aria-label={`${site.footer.cta.line1} ${site.footer.cta.line2}`}
              style={{ color: 'var(--on-accent)', textDecoration: 'none' }}
            >
              <span className="reveal-line block">
                <span className="reveal-line-inner block font-tanker text-[clamp(40px,12vw,64px)] leading-[0.9] uppercase tracking-tight">
                  {site.footer.cta.line1}
                </span>
              </span>
              <span className="reveal-line block">
                <span className="reveal-line-inner block font-tanker text-[clamp(40px,12vw,64px)] leading-[0.9] uppercase tracking-tight">
                  {site.footer.cta.line2}{' '}
                  <span className="inline-block" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </span>
            </Link>
          </div>

          {/* 3. Footer links in two left-aligned columns (mono 12px caps, row gap 14px) */}
          <nav
            className="grid grid-cols-2 gap-8 w-full mt-8"
            aria-label="Footer navigation mobile"
          >
            {site.footer.navColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-[14px]">
                {col.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-mono text-[12px] uppercase tracking-wider text-[#1a1a1a] hover:opacity-60 transition-opacity min-h-[32px] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          {/* 4. Install block, margin-top clamp(48px, 12vw, 72px) */}
          <InstallAppBlock
            site={site}
            className="mt-[clamp(48px,12vw,72px)] mb-0"
          />
        </div>

        {/* DESKTOP / TABLET LAYOUT (>= 768px): Existing look preserved untouched */}
        <div className="hidden md:block">
          {/* Top row: Kraqen logo mark + nav columns */}
          <div className="flex flex-row justify-between items-start gap-8">
            <Brand
              variant="footer"
              src={site.logos.navbarLogo}
              alt={site.logos.alt}
              className="!p-0"
            />
            <nav
              className="flex gap-8 sm:gap-12 w-auto"
              aria-label="Footer navigation desktop"
            >
              {site.footer.navColumns.map((col, colIdx) => (
                <div key={colIdx} className="footer-nav-col flex flex-col gap-2">
                  {col.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="hover:opacity-60 transition-opacity min-h-[32px] flex items-center"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          {/* CTA headline */}
          <div className="mt-[clamp(40px,6vw,80px)]">
            <Link
              href={site.footer.cta.href}
              className="footer-cta block"
              onMouseEnter={handleCtaEnter}
              onMouseLeave={handleCtaLeave}
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.location.pathname === '/contact') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label={`${site.footer.cta.line1} ${site.footer.cta.line2}`}
              style={{ color: 'var(--on-accent)', textDecoration: 'none' }}
            >
              <span className="reveal-line block">
                <span className="reveal-line-inner block">{site.footer.cta.line1}</span>
              </span>
              <span className="reveal-line block">
                <span className="reveal-line-inner block">
                  {site.footer.cta.line2}{' '}
                  <span ref={arrowRef} className="inline-block" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </span>
            </Link>
          </div>

          {/* Install the app block */}
          <InstallAppBlock site={site} className="my-[clamp(48px,6vw,96px)]" />
        </div>

        {/* WORDMARK BELOW 1024px: Left aligned with page padding, small & proper */}
        <div className="lg:hidden mt-[clamp(48px,14vw,80px)] pb-[calc(24px+env(safe-area-inset-bottom))] select-none">
          <span
            style={{
              fontFamily: "'Tanker', sans-serif",
              fontWeight: 400,
              textTransform: 'lowercase',
              color: 'var(--on-accent)',
              display: 'block',
              lineHeight: 0.85,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              fontSize: 'var(--footer-wordmark-size)',
            }}
          >
            {site.brand.giantWordmark}
          </span>
          <div className="mt-5 font-mono text-[10.5px] uppercase tracking-wider text-[#1a1a1a]/70 text-left">
            {site.brand.copyright}
          </div>
        </div>
      </div>

      {/* DESKTOP GIANT FULL-BLEED WORDMARK & BOTTOM BAR (>= 1024px) */}
      <div className="hidden lg:block">
        <div
          className="overflow-hidden block leading-none mt-[clamp(40px,8vw,120px)] select-none"
          aria-hidden="true"
        >
          <span
            ref={wordmarkRef}
            style={{
              fontFamily: "'Tanker', sans-serif",
              fontWeight: 400,
              textTransform: 'lowercase',
              color: 'var(--on-accent)',
              display: 'block',
              lineHeight: 0.82,
              whiteSpace: 'nowrap',
              fontSize: 'clamp(48px, 18vw, 220px)',
            }}
          >
            {site.brand.giantWordmark}
          </span>
        </div>

        {/* Desktop Copyright Bar */}
        <div
          className="flex justify-between items-center gap-2 py-4 border-t border-[#1a1a1a]/15"
          style={{ paddingLeft: 'var(--px)', paddingRight: 'var(--px)' }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10.5px',
              letterSpacing: '0.04em',
              color: 'rgba(26,26,26,0.6)',
              textTransform: 'uppercase',
            }}
          >
            {site.brand.copyright}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: 'rgba(26,26,26,0.4)',
              textTransform: 'uppercase',
            }}
          >
            {site.brand.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
