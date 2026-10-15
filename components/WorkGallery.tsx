'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { WorkContent, WorkProject } from '@/lib/schemas/work';
import { interpolate } from '@/lib/content-utils';

interface WorkGalleryProps {
  data: WorkContent;
}

export default function WorkGallery({ data }: WorkGalleryProps) {
  const [activeFilterId, setActiveFilterId] = useState('all');
  const sectionRef = useRef<HTMLElement>(null);
  const titleInnerRef = useRef<HTMLSpanElement>(null);

  // Filter projects by active filter id
  const filteredProjects = useMemo(() => {
    if (activeFilterId === 'all') return data.projects;
    return data.projects.filter((p) => p.tags.includes(activeFilterId));
  }, [activeFilterId, data.projects]);

  const leftColumnProjects = useMemo(
    () => filteredProjects.filter((_, idx) => idx % 2 === 0),
    [filteredProjects]
  );

  const rightColumnProjects = useMemo(
    () => filteredProjects.filter((_, idx) => idx % 2 === 1),
    [filteredProjects]
  );

  // GSAP scroll reveals
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const initAnim = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        // Title slide up
        if (titleInnerRef.current) {
          gsap.set(titleInnerRef.current, { yPercent: 100 });
          gsap.to(titleInnerRef.current, {
            yPercent: 0,
            duration: 1.1,
            ease: 'power3.out',
          });
        }

        // Cards fade-up reveal
        const cards = sectionRef.current?.querySelectorAll('.work-gallery-card');
        if (cards && cards.length > 0) {
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                },
              }
            );
          });
        }
      }, sectionRef);
    };

    initAnim();

    return () => {
      ctx?.revert();
    };
  }, [filteredProjects]);

  const countString = interpolate(data.header.countFormat || '{count} / {total}', {
    count: filteredProjects.length,
    total: data.projects.length,
  });

  return (
    <section
      ref={sectionRef}
      className="bg-[#0f0f0f] text-[var(--text)] section-px pt-[clamp(80px,10vw,140px)] pb-[clamp(100px,12vw,180px)] min-h-screen"
      aria-label="Portfolio Work Gallery"
    >
      {/* ========================================================
          HEADER: WORK Title (Left) + Filter Tags (Right)
          ======================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[var(--line)] pb-12">
        {/* Left: Giant Tanker "WORK" */}
        <div className="overflow-hidden">
          <h1 className="font-tanker text-[clamp(72px,12vw,170px)] uppercase tracking-[-0.01em] leading-none text-[var(--text)]">
            <span ref={titleInnerRef} className="block reveal-line-inner">
              {data.header.title}
            </span>
          </h1>
        </div>

        {/* Right: Category Count + Filter Tags */}
        <div className="w-full md:w-[48%] flex flex-col items-start md:items-end text-left md:text-right">
          <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#FF3300] font-bold mb-3">
            [{countString}]
          </span>

          {/* Tags list */}
          <div className="flex flex-wrap md:justify-end gap-x-3 gap-y-1 font-tanker text-[clamp(19px,5vw,26px)] md:text-[17px] tracking-[0.02em] uppercase leading-tight">
            {data.header.filters.map((filter, i) => {
              const isActive = activeFilterId === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilterId(filter.id)}
                  className={`transition-colors cursor-pointer text-left min-h-[44px] py-1 flex items-center ${
                    isActive
                      ? 'text-[#FF3300]'
                      : 'text-[var(--text)] hover:text-[var(--text-hover)]'
                  }`}
                  aria-pressed={isActive}
                >
                  {filter.label}
                  {i < data.header.filters.length - 1 ? ',' : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          2-COLUMN STAGGERED MASONRY GALLERY (1 col on mobile)
          ======================================================== */}
      <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(24px,4vw,64px)] gap-y-[clamp(56px,14vw,96px)] items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[clamp(56px,14vw,96px)]">
          {leftColumnProjects.map((project) => (
            <WorkItemCard key={project.id} project={project} />
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-[clamp(56px,14vw,96px)]">
          {rightColumnProjects.map((project) => (
            <WorkItemCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkItemCard({ project }: { project: WorkProject }) {
  return (
    <article
      className="work-gallery-card group flex flex-col cursor-pointer"
      data-cursor
    >
      <div
        className={`relative w-full ${project.aspect || 'aspect-[16/9]'} overflow-hidden bg-[#1a1a1a] border border-[var(--line)]`}
      >
        {project.isVideo && project.videoSrc ? (
          <video
            src={project.videoSrc}
            poster={project.image}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 48vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>

      {/* Caption row */}
      <div className="mt-4 flex justify-between items-baseline border-t border-[var(--line)] pt-3">
        <h2 className="font-tanker text-[20px] tracking-tight uppercase text-[var(--text)] group-hover:text-[#FF3300] transition-colors">
          {project.title}
        </h2>
        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-[var(--text-muted)]">
          {project.category}
        </span>
      </div>
    </article>
  );
}
