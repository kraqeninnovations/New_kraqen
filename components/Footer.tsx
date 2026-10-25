'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import InquiryForm from '@/components/InquiryForm';
import BookingCard from '@/components/BookingCard';
import SocialIcon from '@/components/ui/SocialIcon';
import type { SiteContent } from '@/lib/schemas/site';

interface FooterProps {
  site: SiteContent;
}

export default function Footer({ site }: FooterProps) {
  const pathname = usePathname() || '/';

  // Resolve right column mode: 'form' | 'booking' | 'none'
  const rightColumnMapping = site.footer.rightColumn || {};
  let rightColumnMode: 'form' | 'booking' | 'none' =
    (rightColumnMapping[pathname] as 'form' | 'booking' | 'none') ||
    (rightColumnMapping['default'] as 'form' | 'booking' | 'none') ||
    'form';

  if (!rightColumnMapping[pathname]) {
    if (pathname.startsWith('/contact')) {
      rightColumnMode = (rightColumnMapping['/contact'] as 'form' | 'booking' | 'none') || 'none';
    } else if (pathname.startsWith('/about')) {
      rightColumnMode = (rightColumnMapping['/about'] as 'form' | 'booking' | 'none') || 'booking';
    } else if (rightColumnMapping['default']) {
      rightColumnMode = rightColumnMapping['default'] as 'form' | 'booking' | 'none';
    }
  }

  const isBookingMode = rightColumnMode === 'booking';
  const bookingProvider = site.booking?.provider || 'builtin';
  const calendlyUrl = site.booking?.calendlyUrl?.trim() || site.calendly?.url?.trim() || '';

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeTimedOut, setIframeTimedOut] = useState(false);

  useEffect(() => {
    if (!isBookingMode || bookingProvider !== 'calendly' || !calendlyUrl) return;

    const timer = setTimeout(() => {
      setIframeTimedOut((prev) => !iframeLoaded);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isBookingMode, bookingProvider, calendlyUrl, iframeLoaded]);

  // Show Calendly iframe if provider is calendly, url exists, and didn't time out
  const showCalendlyIframe = isBookingMode && bookingProvider === 'calendly' && Boolean(calendlyUrl) && !iframeTimedOut;

  const whatsappNumber = site.office?.whatsapp?.number || '918939651621';
  const whatsappMsg = encodeURIComponent(
    site.office?.whatsapp?.message || "Hi Kraqen Innovations, I'd like to discuss a project."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  const emailAddress = site.office?.email?.address || 'support@kraqeninc.com';
  const phoneNumber = site.office?.phone || '+91 8939651621';
  const cleanPhone = phoneNumber.replace(/\s+/g, '');

  const isContactPage = pathname === '/contact' || pathname.startsWith('/contact');
  const ctaHref = isContactPage ? '/contact#top' : site.footer.ctaHref;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isContactPage) {
      e.preventDefault();
      const topEl = document.getElementById('top');
      if (topEl) {
        topEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      className="relative text-white overflow-hidden mt-[var(--space-section)]"
      style={{
        backgroundColor: 'var(--brand-purple)',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Site Footer"
    >
      <div className="max-w-[1440px] mx-auto px-[var(--page-x)] pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* =========================================================
              CASE 1: rightColumnMode === "none" (Contact Page)
              Top area renders two balanced content columns:
              LEFT: Logo + KRAQEN INNOVATIONS + LET'S WORK TOGETHER -> /contact#top
              RIGHT: Office Details + Navigation / Social Links
              ========================================================= */}
          {rightColumnMode === 'none' ? (
            <>
              {/* Left Column */}
              <div className="lg:col-span-6 flex flex-col justify-start">
                {/* Brand Header */}
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 mb-8 group focus:outline-none"
                  aria-label="Kraqen Innovations LLP - Home"
                >
                  <span
                    className="inline-flex items-center justify-center bg-[#0f0f0f] rounded-[22%] p-2 md:p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_6px_18px_rgba(0,0,0,0.25)] shrink-0"
                    style={{
                      borderRadius: '22%',
                      backgroundColor: '#0f0f0f',
                      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.28), 0 6px 18px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <Image
                      src={site.logos.navbarLogo}
                      alt={site.logos.alt}
                      width={0}
                      height={0}
                      sizes="48px"
                      style={{ height: 'var(--footer-logo-h)', width: 'auto' }}
                      className="object-contain"
                    />
                  </span>
                  <span className="font-tanker text-[24px] md:text-[28px] tracking-[0.04em] text-white uppercase leading-none">
                    {site.brand.displayName || 'KRAQEN INNOVATIONS'}
                  </span>
                </Link>

                {/* Big CTA Headline */}
                <Link
                  href={ctaHref}
                  onClick={handleCtaClick}
                  className="group block mb-10 focus:outline-none"
                >
                  <div className="font-tanker text-white uppercase leading-[0.88] tracking-tight text-[clamp(48px,6vw,96px)] transition-transform duration-300 group-hover:translate-x-2">
                    {site.footer.ctaLines.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-white/70 font-mono text-sm tracking-normal capitalize font-normal group-hover:text-white transition-colors">
                        Start a project
                      </span>
                      <span className="inline-block transform group-hover:translate-x-3 transition-transform text-2xl">
                        ↑
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right Column: Office Details + Links */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                {/* Office Details Block */}
                {site.office && (
                  <div className="border-b border-white/20 pb-8 mb-8 font-mono text-[12px] leading-relaxed text-white/90">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-2">
                      {site.office.label || 'OUR OFFICE'}
                    </span>
                    <div className="space-y-1 mb-3">
                      {site.office.addressLines?.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>

                    {site.office.mapUrl && (
                      <a
                        href={site.office.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white underline underline-offset-4 font-bold hover:text-white/80 transition-colors mb-4 block"
                      >
                        VIEW ON MAPS →
                      </a>
                    )}

                    {/* Contact Links Row */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-2 text-[12px] uppercase">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        WHATSAPP
                      </a>
                      <a
                        href={`mailto:${emailAddress}`}
                        className="hover:underline hover:text-white transition-colors"
                      >
                        EMAIL: {emailAddress}
                      </a>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="hover:underline hover:text-white transition-colors"
                      >
                        PHONE: {phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* Navigation & Connect Links */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-3">
                      NAVIGATION
                    </span>
                    <ul className="flex flex-col gap-2 list-none p-0 m-0">
                      {(site.footer.columnA || site.navigation.links).map((item, i) => (
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
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-3">
                      CONNECT
                    </span>
                    <ul className="flex flex-col gap-2 list-none p-0 m-0">
                      {site.socials.map((social, i) => {
                        const href = social.href || social.url;
                        if (!href) return null;
                        return (
                          <li key={i}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs uppercase tracking-wider text-white hover:text-white/70 transition-colors inline-flex items-center gap-2"
                            >
                              <SocialIcon type={social.label} size={14} className="text-[#B7A8FF]" />
                              <span>{social.label}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* =========================================================
               CASE 2: rightColumnMode === "form" OR "booking"
               LEFT: Brand + CTA + Office + Nav & Connect
               RIGHT: InquiryForm OR BookingCard / Calendly
               ========================================================= */
            <>
              {/* Left Column: Brand, Headline, Office & Links */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Brand Header */}
                  <Link
                    href="/"
                    className="inline-flex items-center gap-3 mb-8 group focus:outline-none"
                    aria-label="Kraqen Innovations LLP - Home"
                  >
                    <span
                      className="inline-flex items-center justify-center bg-[#0f0f0f] rounded-[22%] p-2 md:p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_6px_18px_rgba(0,0,0,0.25)] shrink-0"
                      style={{
                        borderRadius: '22%',
                        backgroundColor: '#0f0f0f',
                        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.28), 0 6px 18px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <Image
                        src={site.logos.navbarLogo}
                        alt={site.logos.alt}
                        width={0}
                        height={0}
                        sizes="48px"
                        style={{ height: 'var(--footer-logo-h)', width: 'auto' }}
                        className="object-contain"
                      />
                    </span>
                    <span className="font-tanker text-[24px] md:text-[28px] tracking-[0.04em] text-white uppercase leading-none">
                      {site.brand.displayName || 'KRAQEN INNOVATIONS'}
                    </span>
                  </Link>

                  {/* Big CTA Headline */}
                  <Link
                    href={ctaHref}
                    onClick={handleCtaClick}
                    className="group block mb-10 focus:outline-none"
                  >
                    <div className="font-tanker text-white uppercase leading-[0.88] tracking-tight text-[clamp(48px,6vw,96px)] transition-transform duration-300 group-hover:translate-x-2">
                      {site.footer.ctaLines.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-white/70 font-mono text-sm tracking-normal capitalize font-normal group-hover:text-white transition-colors">
                          Start a project
                        </span>
                        <span className="inline-block transform group-hover:translate-x-3 transition-transform text-2xl">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Office Details Block */}
                  {site.office && (
                    <div className="border-t border-white/20 pt-6 mb-8 font-mono text-[12px] leading-relaxed text-white/90">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-white/60 block mb-2">
                        {site.office.label || 'OUR OFFICE'}
                      </span>
                      <div className="space-y-1 mb-3">
                        {site.office.addressLines?.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>

                      {site.office.mapUrl && (
                        <a
                          href={site.office.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-white underline underline-offset-4 font-bold hover:text-white/80 transition-colors mb-4 block"
                        >
                          VIEW ON MAPS →
                        </a>
                      )}

                      {/* Contact Links Row */}
                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-2 text-[12px] uppercase">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                          WHATSAPP
                        </a>
                        <a
                          href={`mailto:${emailAddress}`}
                          className="hover:underline hover:text-white transition-colors"
                        >
                          EMAIL: {emailAddress}
                        </a>
                        <a
                          href={`tel:${cleanPhone}`}
                          className="hover:underline hover:text-white transition-colors"
                        >
                          PHONE: {phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation & Connect Links */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/20">
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-3">
                      NAVIGATION
                    </span>
                    <ul className="flex flex-col gap-2 list-none p-0 m-0">
                      {(site.footer.columnA || site.navigation.links).map((item, i) => (
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
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-3">
                      CONNECT
                    </span>
                    <ul className="flex flex-col gap-2 list-none p-0 m-0">
                      {site.socials.map((social, i) => {
                        const href = social.href || social.url;
                        if (!href) return null;
                        return (
                          <li key={i}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs uppercase tracking-wider text-white hover:text-white/70 transition-colors inline-flex items-center gap-2"
                            >
                              <SocialIcon type={social.label} size={14} className="text-[#B7A8FF]" />
                              <span>{social.label}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Form Card or Booking Card */}
              <div className="lg:col-span-6 w-full">
                {isBookingMode ? (
                  showCalendlyIframe ? (
                    /* Calendly iframe embed */
                    <div className="bg-[#0f0f0f] border border-white/12 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
                      <h3 className="font-tanker text-white uppercase text-[clamp(28px,3vw,44px)] leading-none tracking-wide mb-2">
                        {site.booking?.title || site.footer.bookingTitle || 'BOOK A CALL'}
                      </h3>
                      <p className="font-mono text-xs text-white/60 mb-6 leading-relaxed">
                        Select a convenient slot on our calendar for a discovery conversation.
                      </p>
                      <div className="w-full rounded-xl overflow-hidden bg-[#151515]">
                        <iframe
                          src={`${calendlyUrl}${calendlyUrl.includes('?') ? '&' : '?'}hide_gdpr_banner=1&background_color=0f0f0f&text_color=ffffff&primary_color=3D5AFE`}
                          className="w-full border-0 rounded-xl"
                          style={{ minHeight: 'clamp(560px, 65vh, 680px)' }}
                          loading="lazy"
                          title="Book a call with Kraqen Innovations"
                          onLoad={() => setIframeLoaded(true)}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Builtin Booking Card */
                    <BookingCard data={site.booking} />
                  )
                ) : (
                  /* Form Card (Inquiry Form) */
                  <div className="bg-[#0f0f0f] border border-white/12 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-2xl">
                    <h3 className="font-tanker text-white uppercase text-[clamp(28px,3vw,44px)] leading-none tracking-wide mb-2">
                      {site.footer.formTitle || 'START A PROJECT'}
                    </h3>
                    <p className="font-mono text-xs text-white/60 mb-6 leading-relaxed">
                      {site.footer.formSubtitle || 'Tell us about your brand or campaign to get started.'}
                    </p>
                    <InquiryForm site={site} fieldSet="inquiry" placement="footer" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Center: Logo Icon (in styled tile) + Giant Wordmark */}
        <div className="pt-16 pb-8 text-center select-none overflow-hidden">
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center justify-center bg-[#0f0f0f] rounded-[22%] p-2 md:p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_6px_18px_rgba(0,0,0,0.25)] shrink-0"
              style={{
                borderRadius: '22%',
                backgroundColor: '#0f0f0f',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.28), 0 6px 18px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Image
                src={site.logos.navbarLogo}
                alt=""
                aria-hidden="true"
                width={0}
                height={0}
                sizes="64px"
                style={{ height: 'var(--footer-wordmark-logo-h)', width: 'auto' }}
                className="object-contain"
              />
            </span>
          </div>

          {/* Desktop single line */}
          <div className="hidden md:block font-tanker text-white lowercase tracking-[-0.02em] leading-[0.82] text-[clamp(90px,13.5vw,230px)] whitespace-nowrap">
            {site.brand.giantWordmark || 'kraqen innovations'}
          </div>

          {/* Mobile two lines stacked */}
          <div className="md:hidden font-tanker text-white lowercase tracking-[-0.02em] leading-[0.85] text-[clamp(40px,17.5vw,96px)]">
            {(site.brand.giantWordmarkLines || ['kraqen', 'innovations']).map((line, idx) => (
              <div key={idx} className="whitespace-nowrap">{line}</div>
            ))}
          </div>
        </div>

        {/* Copyright & Legal Row */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/75 text-center">
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
