'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Brand from '@/components/Brand';
import Logo from '@/components/Logo';
import type { SiteContent } from '@/lib/schemas/site';

interface FooterProps {
  site: SiteContent;
}

export default function Footer({ site }: FooterProps) {
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scale wordmark to exactly fill viewport width
  useEffect(() => {
    let rAFId: number;
    const fitWordmark = () => {
      const el = wordmarkRef.current;
      if (!el) return;
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
        {/* Top row: Kraqen logo mark + nav columns */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <Brand
            variant="footer"
            src={site.logos.navbarLogo}
            alt={site.logos.alt}
            className="!p-0"
          />
          <nav
            className="grid grid-cols-2 sm:flex gap-8 sm:gap-12 w-full sm:w-auto"
            aria-label="Footer navigation"
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
      </div>

      {/* Giant full-width wordmark — kraqen in Tanker, full bleed edge to edge */}
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

      {/* Copyright */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-4 border-t border-[#1a1a1a]/15"
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
    </footer>
  );
}
