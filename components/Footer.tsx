'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import InquiryForm from '@/components/InquiryForm';
import type { SiteContent } from '@/lib/schemas/site';

interface FooterProps {
  site: SiteContent;
}

export default function Footer({ site }: FooterProps) {
  const pathname = usePathname();
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const hideForm = site.footer.hideFormOnPaths.some((p) => pathname?.startsWith(p));

  // Scale wordmark on desktop to fill width smoothly
  useEffect(() => {
    let rAFId: number;
    const fitWordmark = () => {
      const el = wordmarkRef.current;
      if (!el) return;
      if (window.innerWidth < 1024) {
        el.style.fontSize = '';
        return;
      }
      el.style.fontSize = '300px';
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(() => {
        const containerW = document.documentElement.clientWidth;
        const naturalW = el.scrollWidth;
        if (naturalW === 0) return;
        const ratio = (containerW * 0.96) / naturalW;
        el.style.fontSize = `${Math.min(300 * ratio, 280)}px`;
      });
    };

    fitWordmark();
    window.addEventListener('resize', fitWordmark);
    return () => {
      cancelAnimationFrame(rAFId);
      window.removeEventListener('resize', fitWordmark);
    };
  }, []);

  return (
    <footer
      className="relative text-white overflow-hidden"
      style={{ backgroundColor: 'var(--brand-purple)' }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-16 md:pt-24 pb-12">
        <div className={`grid grid-cols-1 ${hideForm ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-12 lg:gap-16 items-start`}>
          {/* Left Column: Brand, Headline, Navigation */}
          <div className={`${hideForm ? 'lg:col-span-12 max-w-3xl' : 'lg:col-span-6 xl:col-span-6'} flex flex-col justify-between`}>
            <div>
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-3 mb-10 group" aria-label="Kraqen Home">
                <Image
                  src={site.logos.navbarLogo}
                  alt={site.logos.alt}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain brightness-0 invert"
                />
                <span className="font-tanker text-2xl tracking-wider text-white uppercase">
                  {site.brand.shortName}
                </span>
              </Link>

              {/* Big CTA Headline */}
              <Link
                href={site.footer.ctaHref}
                className="group block mb-12 sm:mb-16 focus:outline-none"
              >
                <div className="font-tanker text-white uppercase leading-[0.88] tracking-tight text-[clamp(44px,7vw,96px)] transition-transform duration-300 group-hover:translate-x-2">
                  {site.footer.ctaLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-white/60 font-mono text-sm tracking-normal capitalize font-normal group-hover:text-white transition-colors">
                      Start a project
                    </span>
                    <span className="inline-block transform group-hover:translate-x-3 transition-transform text-2xl">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/20">
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-4">
                  NAVIGATION
                </span>
                <ul className="flex flex-col gap-2.5">
                  {site.footer.columnA.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="font-mono text-xs uppercase tracking-wider text-white hover:text-white/70 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-4">
                  CONNECT
                </span>
                <ul className="flex flex-col gap-2.5">
                  {site.socials.map((social, i) => (
                    <li key={i}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs uppercase tracking-wider text-white hover:text-white/70 transition-colors"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card (Hidden on /about and /contact) */}
          {!hideForm && (
            <div className="lg:col-span-6 xl:col-span-6 w-full">
              <div className="bg-[#0f0f0f] border border-white/12 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-2xl">
                <h3 className="font-tanker text-white uppercase text-[clamp(28px,3vw,44px)] leading-none tracking-wide mb-2">
                  {site.footer.formTitle}
                </h3>
                <p className="font-mono text-xs text-white/60 mb-6 leading-relaxed">
                  {site.footer.formSubtitle}
                </p>
                <InquiryForm site={site} fieldSet="inquiry" placement="footer" />
              </div>
            </div>
          )}
        </div>

        {/* Center Giant Wordmark */}
        <div className="pt-16 pb-8 text-center select-none overflow-hidden">
          <div
            ref={wordmarkRef}
            className="font-tanker text-white uppercase tracking-tighter leading-[0.82] inline-block text-center whitespace-nowrap"
            style={{
              fontSize: 'clamp(56px, 21vw, 220px)',
            }}
          >
            {site.brand.giantWordmark}
          </div>
        </div>

        {/* Copyright and Legal Row */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/70 text-center">
          <div>{site.footer.copyright}</div>
          <div className="flex items-center gap-6">
            {site.footer.legal.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
