'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import type { HomeContent } from '@/lib/schemas/home';
import ReelViewer from '@/components/ReelViewer';

interface SelectedWorkProps {
  data: HomeContent['selectedWork'];
}

export default function SelectedWork({ data }: SelectedWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headLinesRef = useRef<HTMLDivElement>(null);
  const viewCursorRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [activeVisibleIndex, setActiveVisibleIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [activeCardEl, setActiveCardEl] = useState<HTMLElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Check URL on load for ?reel=02
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const reelParam = params.get('reel');
    if (reelParam) {
      const idx = data.projects.findIndex(
        (p) => (p.number || p.id) === reelParam
      );
      if (idx !== -1) {
        setSelectedCardIndex(idx);
        setIsViewerOpen(true);
      }
    }
  }, [data.projects]);

  // Heading reveal animation
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      ctx = gsap.context(() => {
        const inners = headLinesRef.current?.querySelectorAll('.reveal-line-inner');
        if (inners && !reducedMotion) {
          gsap.set(inners, { yPercent: 100 });
          gsap.to(inners, {
            yPercent: 0,
            duration: 1,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: headLinesRef.current, start: 'top 82%' },
          });
        }
      }, sectionRef);
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, []);

  // Update progress bar & visible counter on track scroll
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setProgress(Math.min(Math.max(ratio, 0), 1));

    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    if (firstCard) {
      const cardW = firstCard.offsetWidth + 12; // card + gap
      const idx = Math.min(
        Math.round(scrollLeft / cardW),
        data.projects.length - 1
      );
      setActiveVisibleIndex(Math.max(0, idx));
    }
  }, [data.projects.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Pointer drag events for smooth mouse-drag scrolling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // left click only
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = trackRef.current ? trackRef.current.scrollLeft : 0;
    dragDistance.current = 0;
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grabbing';
      trackRef.current.style.userSelect = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    dragDistance.current = Math.abs(dx);
    trackRef.current.scrollLeft = scrollLeftStart.current - dx;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = '';
      trackRef.current.style.userSelect = '';
    }
  };

  const handleCardClick = (index: number, e: React.MouseEvent<HTMLElement>) => {
    if (dragDistance.current > 6) {
      // It was a drag, not an intentional click
      e.preventDefault();
      return;
    }
    setActiveCardEl(e.currentTarget);
    setSelectedCardIndex(index);
    setIsViewerOpen(true);
  };

  // Keyboard navigation on track
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    }
  };

  // Button scroll controls
  const scrollPrev = () => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    const scrollAmount = firstCard ? firstCard.offsetWidth + 12 : 360;
    trackRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    const scrollAmount = firstCard ? firstCard.offsetWidth + 12 : 360;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const totalStr = String(data.projects.length).padStart(2, '0');
  const currentStr = String(activeVisibleIndex + 1).padStart(2, '0');
  const hoverLabelText = data.hoverLabel || 'VIEW';

  return (
    <section
      ref={sectionRef}
      id="work"
      className="bg-[#1a1a1a] overflow-hidden"
      style={{ paddingTop: 'clamp(96px, 12vw, 180px)', paddingBottom: '0px' }}
      aria-label="Selected Work"
    >
      {/* Label row */}
      <div className="section-px">
        <div className="label-row" style={{ borderColor: 'var(--line)' }}>
          <span style={{ color: 'var(--text-muted)' }}>{data.labelLeft || 'PORTFOLIO'}</span>
          <span style={{ color: 'var(--text-muted)' }}>{data.labelRight || 'SELECTED WORK'}</span>
        </div>
      </div>

      {/* Heading */}
      <div ref={headLinesRef} className="section-px mt-[clamp(60px,8vw,120px)]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <h2 className="section-h2" style={{ color: 'var(--text)' }}>
            {data.headingLines.map((line, i) => (
              <span key={i} className="reveal-line block">
                <span className="reveal-line-inner block">{line}</span>
              </span>
            ))}
          </h2>
          <p
            className="font-mono text-[11px] pb-2 max-w-[280px] normal-case"
            style={{ letterSpacing: '0.02em', lineHeight: 1.6, color: 'var(--text-muted)' }}
          >
            {data.sideText || data.paragraph}
          </p>
        </div>
      </div>

      {/* ── Scrollable Carousel Track ── */}
      <div
        className="mt-[clamp(48px,6vw,100px)] relative"
        onMouseEnter={() => {
          if (viewCursorRef.current) viewCursorRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
        }}
        onMouseLeave={() => {
          if (viewCursorRef.current) viewCursorRef.current.style.transform = 'translate(-50%,-50%) scale(0)';
          handlePointerUp();
        }}
      >
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Selected projects carousel"
          data-lenis-prevent="true"
          className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-proximity focus:outline-none focus:ring-1 focus:ring-white/20 select-none"
          style={{
            paddingLeft: 'var(--px)',
            paddingRight: 'var(--px)',
            cursor: 'grab',
            WebkitOverflowScrolling: 'touch',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          {data.projects.map((project, idx) => {
            const isReel = project.mediaType === 'reel';
            const isInset = project.fit === 'inset' || project.imageStyle === 'inset';
            const badgeText = isReel
              ? data.viewer?.reelBadge || 'REEL'
              : data.viewer?.postBadge || 'POST';

            return (
              <article
                key={project.id || project.number || idx}
                onClick={(e) => handleCardClick(idx, e)}
                className="group relative flex-shrink-0 snap-start cursor-pointer transition-transform duration-300 w-[80vw] md:w-[34vw] min-w-[280px] max-w-[640px]"
                aria-label={project.title || project.name}
                onMouseMove={(e) => {
                  const vc = viewCursorRef.current;
                  if (vc) {
                    vc.style.left = `${e.clientX}px`;
                    vc.style.top = `${e.clientY}px`;
                  }
                }}
              >
                {/* Poster Card Image */}
                <div
                  className={`work-card-image relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.03] ${
                    isInset ? 'inset bg-[#141414] p-4 sm:p-6' : ''
                  }`}
                  style={{
                    aspectRatio: isReel ? '9 / 16' : '4 / 5',
                    backgroundColor: '#111',
                    borderRadius: '2px',
                  }}
                >
                  <Image
                    src={project.image}
                    alt={project.alt || project.title || project.name || 'Project image'}
                    fill
                    sizes="(max-width: 768px) 80vw, 34vw"
                    priority={idx < 2}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Top-Left Media Type Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white tracking-wider uppercase font-bold">
                    {isReel && (
                      <span className="text-[#FF3300] text-[9px] leading-none" aria-hidden="true">
                        ▶
                      </span>
                    )}
                    <span>{badgeText}</span>
                  </div>
                </div>

                {/* Caption row */}
                <div
                  className="work-card-caption flex justify-between items-baseline pt-3 pb-2 border-b transition-colors"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div className="flex gap-3 items-baseline">
                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {project.number || project.id}
                    </span>
                    <span
                      className="font-mono text-[11px] font-bold uppercase tracking-wider group-hover:text-[#FF3300] transition-colors"
                      style={{ color: 'var(--text)' }}
                    >
                      {project.title || project.name}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider hidden sm:block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {project.category || project.services}&nbsp;&nbsp;{project.year}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Carousel Controls (Progress bar, Counter, Prev/Next buttons) ── */}
      <div className="section-px mt-6 pb-6 flex items-center justify-between gap-6">
        {/* Thin 1px Progress line */}
        <div className="flex-1 max-w-md h-[1px] bg-white/18 relative overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-150 ease-out"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>

        {/* Counter and Desktop Navigation Buttons */}
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px] tracking-[0.05em] text-[var(--text-muted)]">
            {currentStr} / {totalStr}
          </span>

          {/* Desktop Only Buttons (44x44px round) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={progress <= 0.01}
              className="w-11 h-11 rounded-full border border-white/20 hover:border-white disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF3300]"
              aria-label="Previous work"
            >
              ←
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={progress >= 0.99}
              className="w-11 h-11 rounded-full border border-white/20 hover:border-white disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF3300]"
              aria-label="Next work"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Circular VIEW cursor on desktop only */}
      <div ref={viewCursorRef} className="cursor-view hidden md:flex" aria-hidden="true">
        {hoverLabelText}
      </div>

      {/* Full-Screen Reel / Instagram Viewer */}
      <ReelViewer
        isOpen={isViewerOpen}
        projects={data.projects}
        initialIndex={selectedCardIndex}
        onClose={() => setIsViewerOpen(false)}
        viewerLabels={{
          closeLabel: data.viewer?.closeLabel || 'CLOSE',
          prevLabel: data.viewer?.prevLabel || 'PREVIOUS',
          nextLabel: data.viewer?.nextLabel || 'NEXT',
          hint: data.viewer?.hint || 'SWIPE UP OR DOWN FOR MORE',
          reelBadge: data.viewer?.reelBadge || 'REEL',
          postBadge: data.viewer?.postBadge || 'POST',
        }}
        instagram={{
          handle: data.instagram?.handle || 'kraqen.innovations',
          profileUrl:
            data.instagram?.profileUrl || 'https://www.instagram.com/kraqen.innovations/',
          openLabel: data.instagram?.openLabel || 'OPEN ON INSTAGRAM',
          followLabel: data.instagram?.followLabel || 'FOLLOW @KRAQEN.INNOVATIONS',
          embedFailedText:
            data.instagram?.embedFailedText ||
            'This post could not be loaded here. Open it on Instagram.',
        }}
        triggerElement={activeCardEl}
      />
    </section>
  );
}
