'use client';

import Logo from '@/components/Logo';
import type { SiteContent } from '@/lib/schemas/site';

interface MarqueeStripProps {
  data: SiteContent['marquee'];
  wordmark?: string;
}

export default function MarqueeStrip({ data, wordmark = 'kraqen' }: MarqueeStripProps) {
  const items = [
    { type: 'wordmark', content: wordmark },
    { type: 'text', content: data.p1 },
    { type: 'badge' },
    { type: 'separator', content: data.category },
    { type: 'wordmark', content: wordmark },
    { type: 'text', content: data.p2 },
    { type: 'badge' },
    { type: 'star' },
    { type: 'pill', content: data.pill },
    { type: 'star' },
  ];

  // Duplicate items for continuous animation
  const loopItems = [...items, ...items];

  return (
    <div
      className="marquee-outer min-h-[56px] h-[56px] md:h-[72px] bg-[#FF3300] flex items-center overflow-hidden"
      aria-hidden="true"
    >
      <div className="marquee-track flex items-center" style={{ gap: '48px', paddingRight: '48px' }}>
        {loopItems.map((item, i) => {
          switch (item.type) {
            case 'wordmark':
              return (
                <span
                  key={i}
                  className="font-tanker text-[clamp(28px,3.8vw,46px)] uppercase leading-none tracking-tight text-[#1a1a1a] flex items-center gap-2"
                >
                  {item.content}
                </span>
              );

            case 'text':
              return (
                <span
                  key={i}
                  className="marquee-text whitespace-nowrap font-mono text-[10px] md:text-[11px] tracking-[0.04em] uppercase text-[#1a1a1a] max-w-[420px] md:max-w-[480px] leading-[1.4]"
                >
                  {item.content}
                </span>
              );

            case 'badge':
              return (
                <div
                  key={i}
                  className="w-[34px] h-[34px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden flex items-center justify-center bg-[#1a1a1a] p-1.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <Logo variant="white" className="w-full h-full object-contain" />
                </div>
              );

            case 'separator':
              return (
                <span
                  key={i}
                  className="marquee-separator font-mono text-[9px] md:text-[10px] tracking-[0.06em] uppercase text-[#1a1a1a] opacity-80 flex flex-col justify-center leading-tight"
                >
                  {item.content?.split(' ').map((w, wi) => (
                    <span key={wi} className="block">
                      {w}
                    </span>
                  ))}
                </span>
              );

            case 'star':
              return (
                <span key={i} className="marquee-star text-[#1a1a1a] text-[18px] md:text-[22px]" aria-hidden="true">
                  ✦
                </span>
              );

            case 'pill':
              return (
                <span
                  key={i}
                  className="marquee-pill font-tanker text-[14px] md:text-[16px] tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#1a1a1a] text-[#1a1a1a]"
                >
                  {item.content}
                </span>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
