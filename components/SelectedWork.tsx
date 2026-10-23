'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomeContent } from '@/lib/schemas/home';
import type { WorkItem } from '@/lib/schemas/work';

interface SelectedWorkProps {
  data: HomeContent['selectedWork'];
  workItems: WorkItem[];
}

export default function SelectedWork({ data, workItems }: SelectedWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [activeVisibleIndex, setActiveVisibleIndex] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Resolve featured items in order
  const featuredItems = data.featuredSlugs
    .map((slug) => workItems.find((item) => item.slug === slug))
    .filter((item): item is WorkItem => Boolean(item));

  // If no slugs matched, fallback to first 6 workItems
  const itemsToRender = featuredItems.length > 0 ? featuredItems : workItems.slice(0, 6);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rAF: number;
    const onScroll = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const currentScroll = track.scrollLeft;
        const p = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
        setProgress(p);

        const cardWidth = track.firstElementChild?.clientWidth || 360;
        const index = Math.round(currentScroll / (cardWidth + 12));
        setActiveVisibleIndex(Math.max(0, Math.min(index, itemsToRender.length - 1)));
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      track.removeEventListener('scroll', onScroll);
    };
  }, [itemsToRender.length]);

  const scrollPrev = () => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.firstElementChild?.clientWidth || 360;
    trackRef.current.scrollBy({ left: -(cardWidth + 12), behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.firstElementChild?.clientWidth || 360;
    trackRef.current.scrollBy({ left: cardWidth + 12, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    }
  };

  // Mouse drag handling (pointerType === mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !trackRef.current) return;
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = x - startX.current;
    dragDistance.current = Math.abs(walk);
    if (dragDistance.current > 6) {
      trackRef.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (dragDistance.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-[clamp(64px,10vw,160px)] overflow-hidden"
      style={{ backgroundColor: 'var(--bg-section)' }}
      aria-label="Selected Work"
    >
      <div className="section-px mb-8 md:mb-12">
        {/* Label Row */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
            {data.label}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
            {String(activeVisibleIndex + 1).padStart(2, '0')} / {String(itemsToRender.length).padStart(2, '0')}
          </span>
        </div>

        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
          <div>
            <h2 className="font-tanker text-white uppercase text-[clamp(48px,8vw,120px)] leading-[0.88] tracking-tight">
              {data.headingLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </h2>
            {data.sideText && (
              <p className="font-mono text-xs text-white/60 max-w-md mt-4 leading-relaxed">
                {data.sideText}
              </p>
            )}
          </div>

          {/* Controls: Prev / Next Buttons & Progress Bar */}
          <div className="flex items-center gap-4 self-start md:self-end">
            <div className="w-24 md:w-32 h-[2px] bg-white/20 relative rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-150 rounded-full"
                style={{ width: `${Math.max(15, progress * 100)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous work"
              className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            >
              ←
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next work"
              className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track: Native Horizontal Scroll */}
      <div
        ref={trackRef}
        data-lenis-prevent
        tabIndex={0}
        role="region"
        aria-label="Selected work carousel"
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="work-carousel-track flex gap-3 md:gap-4 overflow-x-auto overflow-y-hidden select-none px-[var(--px)] focus:outline-none focus:ring-1 focus:ring-accent cursor-grab active:cursor-grabbing"
        style={{
          scrollSnapType: 'x proximity',
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {itemsToRender.map((project, idx) => (
          <Link
            key={project.slug || idx}
            href={`/work/${project.slug}`}
            onClick={handleCardClick}
            className="group flex-none relative rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent transition-transform duration-300"
            style={{
              flex: '0 0 clamp(280px, 34vw, 640px)',
              scrollSnapAlign: 'start',
            }}
          >
            {/* Card Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#151515] rounded-xl">
              <Image
                src={project.poster || project.src}
                alt={project.alt || project.title}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 34vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="font-mono text-[10px] uppercase tracking-wider bg-black/60 backdrop-blur-md text-white/90 px-3 py-1 rounded-full border border-white/10">
                  {project.category}
                </span>
              </div>

              {/* Desktop Hover Info Panel (Slide up over bottom of card) */}
              <div className="hidden md:flex flex-col justify-end absolute inset-0 p-6 bg-gradient-to-t from-[#0f0f0f]/95 via-[#0f0f0f]/75 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 ease-out z-20">
                <h3 className="font-tanker text-2xl uppercase text-white tracking-wide mb-3">
                  {project.title}
                </h3>
                <div className="space-y-2 border-t border-white/20 pt-3">
                  <div className="flex flex-col font-mono">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">
                      {data.labels.client}
                    </span>
                    <span className="text-xs text-white font-medium">
                      {project.clientIndustry || 'Creative Production'}
                    </span>
                  </div>
                  <div className="flex flex-col font-mono">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">
                      {data.labels.deliverable}
                    </span>
                    <span className="text-xs text-white font-medium">
                      {project.deliverable || 'Campaign & Video'}
                    </span>
                  </div>
                  <div className="flex flex-col font-mono">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">
                      {data.labels.result}
                    </span>
                    <span className="text-xs text-accent font-medium">
                      {project.result || '+250k Views & Engagement'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white font-bold">
                  <span>{data.viewLabel}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>

            {/* Mobile Under-Image Metadata (always visible below 768px) */}
            <div className="md:hidden mt-3 space-y-1.5 px-1 font-mono text-[11px]">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-tanker text-lg text-white uppercase tracking-wide">
                  {project.title}
                </h3>
                <span className="text-[10px] text-accent uppercase font-bold">
                  {data.viewLabel} →
                </span>
              </div>
              <div className="text-white/60 text-[10px] uppercase">
                {data.labels.client}: <span className="text-white">{project.clientIndustry || 'Creative'}</span>
              </div>
              <div className="text-white/60 text-[10px] uppercase">
                {data.labels.deliverable}: <span className="text-white">{project.deliverable || 'Production'}</span>
              </div>
              <div className="text-white/60 text-[10px] uppercase">
                {data.labels.result}: <span className="text-accent">{project.result || 'High Impact'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
