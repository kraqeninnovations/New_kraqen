'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import type { HomeClient } from '@/lib/schemas/home';

interface ClientLogoGridProps {
  labelLeft: string;
  labelRight: string;
  headingLines: string[];
  clients: HomeClient[];
  fillEmptyCells?: boolean;
  sectionId?: string;
  sectionAriaLabel?: string;
  className?: string;
}

function LogoMaskItem({
  client,
  isActive,
}: {
  client: HomeClient;
  isActive: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if the logo asset exists / loads
    const img = new window.Image();
    img.src = client.logo;
    img.onerror = () => {
      setHasError(true);
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[ClientLogoGrid] Warning: Missing or broken logo file at "${client.logo}" for client "${client.name}". Showing fallback text.`
        );
      }
    };
  }, [client.logo, client.name]);

  if (hasError) {
    return (
      <span className="font-mono text-[12px] uppercase tracking-wider text-[var(--logo-grey)] text-center px-2 select-none">
        {client.name}
      </span>
    );
  }

  return (
    <div
      role="img"
      aria-label={client.name}
      className="w-full h-full flex items-center justify-center transition-colors duration-300"
      style={{
        color: isActive ? 'var(--text-hover)' : 'var(--logo-grey)',
        transform: `scale(${client.scale ?? 1})`,
      }}
    >
      <div
        className="w-full h-full transition-colors duration-300"
        style={{
          backgroundColor: 'currentColor',
          maskImage: `url(${client.logo})`,
          WebkitMaskImage: `url(${client.logo})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    </div>
  );
}

export default function ClientLogoGrid({
  labelLeft,
  labelRight,
  headingLines,
  clients,
  fillEmptyCells = true,
  sectionId = 'partners',
  sectionAriaLabel = 'Partners',
  className = '',
}: ClientLogoGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hoverImgRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [visibleImage, setVisibleImage] = useState<string | null>(null);
  const [mobileActiveClient, setMobileActiveClient] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const xToRef = useRef<((x: number) => void) | null>(null);
  const yToRef = useRef<((y: number) => void) | null>(null);
  const lastX = useRef(0);
  const isVisible = useRef(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Init GSAP quickTo for smooth cursor image tracking on desktop
  useEffect(() => {
    if (isTouch || !hoverImgRef.current) return;
    let ctxMounted = true;

    const initGsap = async () => {
      const { gsap } = await import('gsap');
      if (!ctxMounted || !hoverImgRef.current) return;
      xToRef.current = gsap.quickTo(hoverImgRef.current, 'x', { duration: 0.5, ease: 'power3.out' });
      yToRef.current = gsap.quickTo(hoverImgRef.current, 'y', { duration: 0.5, ease: 'power3.out' });
      gsap.set(hoverImgRef.current, { x: -400, y: -400, rotation: 0 });
    };

    initGsap();
    return () => {
      ctxMounted = false;
    };
  }, [isTouch]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouch || !xToRef.current || !yToRef.current || !hoverImgRef.current) return;

      const imgW = 220;
      const imgH = 290;

      xToRef.current(e.clientX - imgW / 2 + 24);
      yToRef.current(e.clientY - imgH / 2 - 24);

      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      const rot = Math.max(-6, Math.min(6, dx * 0.4));

      import('gsap').then(({ gsap }) => {
        if (hoverImgRef.current) {
          gsap.to(hoverImgRef.current, { rotation: rot, duration: 0.35, ease: 'power2.out' });
        }
      });
    },
    [isTouch]
  );

  const showImage = useCallback(
    async (clientId: string, hoverImage: string) => {
      if (isTouch) return;
      const { gsap } = await import('gsap');

      if (!isVisible.current) {
        isVisible.current = true;
        setVisibleImage(hoverImage);
        setActiveClient(clientId);
        if (hoverImgRef.current) {
          gsap.fromTo(
            hoverImgRef.current,
            { clipPath: 'inset(100% 0 0 0)', scale: 0.88, opacity: 1 },
            { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 0.38, ease: 'power3.out' }
          );
        }
      } else {
        setVisibleImage(hoverImage);
        setActiveClient(clientId);
        if (imgInnerRef.current) {
          gsap.fromTo(imgInnerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        }
      }
    },
    [isTouch]
  );

  const hideImage = useCallback(async () => {
    if (isTouch) return;
    const { gsap } = await import('gsap');
    isVisible.current = false;
    setActiveClient(null);
    if (hoverImgRef.current) {
      gsap.to(hoverImgRef.current, {
        clipPath: 'inset(0% 0 100% 0)',
        scale: 0.88,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setVisibleImage(null),
      });
    }
  }, [isTouch]);

  // Scroll reveals
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let killed = false;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (killed || !sectionRef.current) return;

      gsap.fromTo(
        sectionRef.current.querySelectorAll('.reveal-line-inner'),
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      const cells = sectionRef.current.querySelectorAll('.partner-cell');
      if (cells.length > 0) {
        gsap.fromTo(
          cells,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current.querySelector('.partners-grid'), start: 'top 82%' },
          }
        );
      }
    };

    init();
    return () => {
      killed = true;
    };
  }, []);

  const handleCellTap = (clientId: string) => {
    if (!isTouch) return;
    setMobileActiveClient((prev) => (prev === clientId ? null : clientId));
  };

  // Calculate empty filler cells so hairline grid is complete
  // Desktop has 4 columns; Mobile has 2 columns.
  // A number of cells that completes both 4 and 2 columns completes the grid.
  const remainder = clients.length % 4;
  const emptyCount = fillEmptyCells && remainder !== 0 ? 4 - remainder : 0;
  const emptyCells = Array.from({ length: emptyCount }, (_, i) => i);

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={`bg-[#1a1a1a] section-px ${className}`}
      style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}
      aria-label={sectionAriaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={hideImage}
    >
      {/* Label row */}
      <div className="label-row" style={{ borderColor: 'var(--line)' }}>
        <span style={{ color: 'var(--text)' }} className="opacity-75">
          {labelLeft}
        </span>
        <span style={{ color: 'var(--text)' }} className="opacity-75">
          {labelRight}
        </span>
      </div>

      {/* Heading */}
      <h2 className="section-h2 mt-[clamp(60px,8vw,140px)]" style={{ color: 'var(--text)' }}>
        {headingLines.map((line, i) => (
          <span key={i} className="reveal-line block">
            <span className="reveal-line-inner block">{line}</span>
          </span>
        ))}
      </h2>

      {/* Client grid: 4 columns desktop, 2 columns mobile, 1px hairlines between cells and top edge only */}
      <div className="partners-grid mt-[clamp(48px,6vw,100px)] grid grid-cols-2 md:grid-cols-4 border-t border-[rgba(139,134,125,0.35)]">
        {clients.map((client, index) => {
          const isMobileActive = mobileActiveClient === client.id;
          const isHovered = activeClient === client.id;

          // Hairline borders:
          // Mobile (2 cols): odd index gets border-r, even gets 0
          // Desktop (4 cols): (index+1) % 4 !== 0 gets border-r, 4th gets 0
          const hasMobileRightBorder = index % 2 === 0;
          const hasDesktopRightBorder = (index + 1) % 4 !== 0;

          return (
            <div
              key={client.id}
              className={`partner-cell relative aspect-[1.4/1] flex items-center justify-center cursor-pointer overflow-hidden border-b border-[rgba(139,134,125,0.35)] ${
                hasMobileRightBorder ? 'border-r border-[rgba(139,134,125,0.35)]' : ''
              } ${hasDesktopRightBorder ? 'md:border-r md:border-[rgba(139,134,125,0.35)]' : 'md:border-r-0'}`}
              onMouseEnter={() => showImage(client.id, client.hoverImage)}
              onClick={() => handleCellTap(client.id)}
              aria-label={client.name}
              tabIndex={0}
              role="button"
              onFocus={() => showImage(client.id, client.hoverImage)}
              onBlur={hideImage}
            >
              {/* Fixed logo box: 62% of cell width by 34% of cell height */}
              <div className="w-[62%] h-[34%] flex items-center justify-center">
                <LogoMaskItem client={client} isActive={isHovered || isMobileActive} />
              </div>

              {/* Mobile Tap Overlay Card */}
              {isTouch && isMobileActive && (
                <div
                  className="absolute inset-0 bg-[#0f0f0f] z-20 flex flex-col items-center justify-center p-3 animate-fadeIn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileActiveClient(null);
                  }}
                >
                  <div className="relative w-full h-[70%] overflow-hidden rounded-[2px] mb-2">
                    <Image
                      src={client.hoverImage}
                      alt={client.name}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white truncate max-w-full">
                    {client.name}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#FF3300] mt-0.5">
                    TAP TO CLOSE ✕
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty filler cells to complete the hairline grid */}
        {emptyCells.map((_, i) => {
          const cellIndex = clients.length + i;
          const hasMobileRightBorder = cellIndex % 2 === 0;
          const hasDesktopRightBorder = (cellIndex + 1) % 4 !== 0;

          return (
            <div
              key={`empty-${i}`}
              aria-hidden="true"
              className={`aspect-[1.4/1] border-b border-[rgba(139,134,125,0.35)] ${
                hasMobileRightBorder ? 'border-r border-[rgba(139,134,125,0.35)]' : ''
              } ${hasDesktopRightBorder ? 'md:border-r md:border-[rgba(139,134,125,0.35)]' : 'md:border-r-0'}`}
            />
          );
        })}
      </div>

      {/* Flying cursor-follower hover image on desktop */}
      {!isTouch && (
        <div
          ref={hoverImgRef}
          className="partner-hover-image pointer-events-none"
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '220px',
            height: '290px',
            clipPath: 'inset(100% 0 0 0)',
            zIndex: 999,
          }}
        >
          <div ref={imgInnerRef} className="w-full h-full relative">
            {visibleImage && (
              <Image
                src={visibleImage}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

