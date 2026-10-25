'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import type { HomeContent } from '@/lib/schemas/home';

interface HeroProps {
  data: HomeContent['hero'];
}

export default function Hero({ data }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useMobileVideo, setUseMobileVideo] = useState(false);
  const [reducedMotionOrSaveData, setReducedMotionOrSaveData] = useState(false);

  const videoConfig = data.video || {
    src: '/media/hero.mp4',
    srcMobile: '/media/hero-mobile.mp4',
    poster: '/media/hero-poster.webp',
    overlay: 0.35,
  };

  const images = data.images || [];
  const topImg = images.find((img) => img.position === 'top') || images[0];
  const bottomImg = images.find((img) => img.position === 'bottom') || images[3];
  const leftImg = images.find((img) => img.position === 'left') || images[1];
  const rightImg = images.find((img) => img.position === 'right') || images[2];

  // Screen size check for mobile source and connection/reduced motion check
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setUseMobileVideo(isMobile);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const saveData = Boolean(connection?.saveData);

    setReducedMotionOrSaveData(prefersReducedMotion || saveData);
  }, []);

  // Video autoplay, unmuting attribute workaround, canplay listener, and pause on leave
  useEffect(() => {
    if (reducedMotionOrSaveData) return;

    const video = videoRef.current;
    if (!video) return;

    // React does not always write the muted attribute properly
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.play().catch(() => {});

    const onCanPlay = () => {
      video.play().catch(() => {});
    };
    video.addEventListener('canplay', onCanPlay);

    // Pause when hero leaves viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Pause when tab is hidden
    const onVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          video.play().catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [reducedMotionOrSaveData]);

  const videoSource = useMobileVideo && videoConfig.srcMobile ? videoConfig.srcMobile : videoConfig.src;

  return (
    <section
      ref={sectionRef}
      className="hero relative min-h-[100svh] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: 'var(--bg-hero)' }}
      aria-label="Home Hero"
    >
      {/* ── LAYER 0: BACKGROUND VIDEO (OR POSTER UNDER REDUCED MOTION / SAVE DATA) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {reducedMotionOrSaveData ? (
          <Image
            src={videoConfig.poster}
            alt="Kraqen Innovations production background"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={videoConfig.poster}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        )}
      </div>

      {/* ── LAYER 1: DARK OVERLAY ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundColor: `rgba(15, 15, 15, ${videoConfig.overlay ?? 0.35})`,
        }}
        aria-hidden="true"
      />

      {/* ── LAYER 2: FLOATING FRAMING IMAGES AROUND THE EDGES ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
        {/* TOP IMAGE */}
        {topImg && (
          <div
            className="hero-float-a absolute rounded-[8px] overflow-hidden shadow-2xl border border-white/10"
            style={{
              top: '14%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(90px, 13vw, 220px)',
              aspectRatio: '16/10',
            }}
          >
            <Image
              src={topImg.src}
              alt={topImg.alt}
              fill
              sizes="(max-width: 640px) 22vw, 13vw"
              className="object-cover"
            />
          </div>
        )}

        {/* BOTTOM IMAGE */}
        {bottomImg && (
          <div
            className="hero-float-b absolute rounded-[8px] overflow-hidden shadow-2xl border border-white/10"
            style={{
              bottom: '6%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(100px, 15vw, 260px)',
              aspectRatio: '16/10',
            }}
          >
            <Image
              src={bottomImg.src}
              alt={bottomImg.alt}
              fill
              sizes="(max-width: 640px) 22vw, 15vw"
              className="object-cover"
            />
          </div>
        )}

        {/* LEFT IMAGE */}
        {leftImg && (
          <div
            className="hero-float-b absolute rounded-[8px] overflow-hidden shadow-2xl border border-white/10 max-sm:!top-[28%] max-sm:!left-[2vw] max-sm:!translate-y-0"
            style={{
              left: '3%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(90px, 14vw, 240px)',
              aspectRatio: '4/5',
            }}
          >
            <Image
              src={leftImg.src}
              alt={leftImg.alt}
              fill
              sizes="(max-width: 640px) 22vw, 14vw"
              className="object-cover"
            />
          </div>
        )}

        {/* RIGHT IMAGE */}
        {rightImg && (
          <div
            className="hero-float-a absolute rounded-[8px] overflow-hidden shadow-2xl border border-white/10 max-sm:!top-[72%] max-sm:!right-[2vw] max-sm:!translate-y-0"
            style={{
              right: '3%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(100px, 16vw, 280px)',
              aspectRatio: '4/5',
            }}
          >
            <Image
              src={rightImg.src}
              alt={rightImg.alt}
              fill
              sizes="(max-width: 640px) 22vw, 16vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* ── LAYER 3: CENTERED HEADLINE, PARAGRAPH & CTA BUTTON ── */}
      <div
        className="flex-1 flex items-center justify-center relative z-[3]"
        style={{
          paddingTop: 'calc(72px + 16px)',
          paddingBottom: 'clamp(56px, 12svh, 140px)',
          paddingLeft: 'var(--page-x)',
          paddingRight: 'var(--page-x)',
        }}
      >
        <div className="flex flex-col items-center text-center max-w-[840px] mx-auto">
          <h1
            className="font-tanker text-center uppercase tracking-[-0.01em] text-white leading-[0.9] mb-5 sm:mb-6"
            style={{
              fontSize: 'var(--hero-h1-size)',
              textShadow: '0 2px 24px rgba(0,0,0,0.55)',
            }}
            aria-label={data.headlineLines.join(' ')}
          >
            {data.headlineLines.map((line, i) => (
              <span key={i} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>

          {/* Centered paragraph */}
          <p
            className="font-mono text-[13px] leading-relaxed max-w-[560px] text-center text-white/95 normal-case mb-6"
            style={{
              letterSpacing: '0.01em',
              textShadow: '0 2px 16px rgba(0,0,0,0.65)',
            }}
          >
            {data.paragraph}
          </p>

          {/* Centered CTA button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              href={data.cta.href}
            >
              {data.cta.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Location tag small on bottom-left */}
      <div
        className="relative z-[3] pb-6 px-[var(--page-x)] flex justify-between items-center text-[var(--text-muted)] font-mono text-[11px] tracking-wider uppercase pointer-events-none"
      >
        <span>{data.location || 'CHENNAI - IN'}</span>
        <span>KRAQEN INNOVATIONS</span>
      </div>
    </section>
  );
}
