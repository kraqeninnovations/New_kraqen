'use client';

import React, { useState, useEffect } from 'react';
import type { ContactContent } from '@/lib/schemas/contact';

interface CalendlyBookingCardProps {
  data: ContactContent['booking'];
}

export default function CalendlyBookingCard({ data }: CalendlyBookingCardProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const url = data.calendlyUrl?.trim();

  useEffect(() => {
    if (!url) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Calendly URL is empty. Calendly booking card will remain dormant.');
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimedOut((prev) => !hasLoaded);
    }, 8000);

    return () => clearTimeout(timer);
  }, [url, hasLoaded]);

  if (!data.enabled || !url) {
    return null;
  }

  const separator = url.includes('?') ? '&' : '?';
  const iframeSrc = `${url}${separator}hide_gdpr_banner=1&background_color=151515&text_color=ffffff&primary_color=5B3CDB`;

  return (
    <div className="rounded-[20px] bg-[#151515] border border-white/12 p-6 sm:p-8 md:p-10 text-white shadow-2xl">
      <div className="mb-6">
        <h3 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white mb-2">
          {data.title}
        </h3>
        <p className="font-mono text-xs text-white/60 leading-relaxed">
          {data.text}
        </p>
      </div>

      {timedOut && !hasLoaded ? (
        <div className="py-12 px-6 rounded-xl bg-black/40 border border-white/10 text-center font-mono">
          <p className="text-xs text-white/70 mb-4">{data.fallbackText}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors"
          >
            {data.openLabel} →
          </a>
        </div>
      ) : (
        <div className="w-full rounded-xl overflow-hidden bg-[#151515]">
          <iframe
            src={iframeSrc}
            className="w-full border-0 rounded-xl"
            style={{
              minHeight: 'clamp(520px, 60vh, 720px)',
            }}
            loading="lazy"
            title="Book a call with Kraqen"
            onLoad={() => setHasLoaded(true)}
          />
        </div>
      )}
    </div>
  );
}

