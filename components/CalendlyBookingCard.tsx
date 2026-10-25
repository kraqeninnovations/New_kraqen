'use client';

import React, { useState, useEffect } from 'react';

export interface BookingData {
  enabled?: boolean;
  title?: string;
  text?: string;
  calendlyUrl?: string;
  fallbackText?: string;
  openLabel?: string;
}

interface CalendlyBookingCardProps {
  data?: BookingData;
}

export default function CalendlyBookingCard({ data }: CalendlyBookingCardProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const url = data?.calendlyUrl?.trim();

  useEffect(() => {
    if (!url) {
      return;
    }

    const timer = setTimeout(() => {
      setTimedOut((prev) => !hasLoaded);
    }, 8000);

    return () => clearTimeout(timer);
  }, [url, hasLoaded]);

  if (!data?.enabled || !url) {
    return null;
  }

  const separator = url.includes('?') ? '&' : '?';
  const iframeSrc = `${url}${separator}hide_gdpr_banner=1&background_color=151515&text_color=ffffff&primary_color=3D5AFE`;

  return (
    <div className="rounded-[20px] bg-[#151515] border border-white/12 p-6 sm:p-8 md:p-10 text-white shadow-2xl">
      <div className="mb-6">
        <h3 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white mb-2">
          {data.title || 'BOOK A CALL'}
        </h3>
        <p className="font-mono text-xs text-white/60 leading-relaxed">
          {data.text || 'Pick a time that suits you.'}
        </p>
      </div>

      {timedOut && !hasLoaded ? (
        <div className="py-12 px-6 rounded-xl bg-black/40 border border-white/10 text-center font-mono">
          <p className="text-xs text-white/70 mb-4">{data.fallbackText || 'The calendar could not be loaded.'}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            {data.openLabel || 'OPEN CALENDAR'} →
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
