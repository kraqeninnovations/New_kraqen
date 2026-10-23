'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InstagramReelEmbedProps {
  url: string;
  poster?: string;
  title: string;
}

export default function InstagramReelEmbed({ url, poster, title }: InstagramReelEmbedProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const match = url.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  const shortcode = match ? match[1] : null;
  const embedUrl = shortcode ? `https://www.instagram.com/reel/${shortcode}/embed` : null;

  useEffect(() => {
    if (!embedUrl) {
      setTimedOut(true);
      return;
    }
    const timer = setTimeout(() => {
      setTimedOut((prev) => !hasLoaded);
    }, 6000);
    return () => clearTimeout(timer);
  }, [embedUrl, hasLoaded]);

  if (!embedUrl || (timedOut && !hasLoaded)) {
    return (
      <div className="relative w-full max-w-[380px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-[#151515] border border-white/10 flex flex-col justify-end p-6 shadow-2xl">
        {poster && (
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="relative z-10 text-center">
          <a
            href={url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors"
          >
            OPEN ON INSTAGRAM →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[400px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-[#151515] border border-white/10 shadow-2xl">
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        title={title}
        onLoad={() => setHasLoaded(true)}
      />
    </div>
  );
}

