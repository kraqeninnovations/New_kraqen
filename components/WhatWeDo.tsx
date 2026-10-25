'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { HomeContent } from '@/lib/schemas/home';

const Folder = dynamic<any>(() => import('@/components/fx/Folder'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full aspect-[4/3] rounded-2xl bg-[#151515] border border-white/10 animate-pulse"
      aria-hidden="true"
    />
  ),
});

interface WhatWeDoProps {
  data: HomeContent['services'];
  effects?: {
    folders?: {
      enabled?: boolean;
      draggable?: boolean;
      layout?: 'stack' | 'spread' | 'row';
    };
  };
}

function ServiceFolderCard({
  service,
  layout = 'stack',
  draggable = false,
  isFinePointer = true,
}: {
  service: NonNullable<HomeContent['services']['items']>[number];
  layout?: 'stack' | 'spread' | 'row';
  draggable?: boolean;
  isFinePointer?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState(260);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      if (entries[0]) {
        setColWidth(entries[0].contentRect.width);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const size = Math.min(1.05, Math.max(0.62, colWidth / 250));
  const folderItems = service.folderItems || [
    { title: 'Brand guidelines', description: 'Visual systems & rules' },
    { title: 'Launch strategy', description: 'Campaign timeline & distribution' },
    { title: 'Production cut', description: 'Cinema-grade narrative film' },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center text-center transition-all ${
        isOpen ? 'z-20' : 'z-10'
      }`}
      style={{
        overflow: 'visible',
      }}
    >
      {/* Folder Stage with padding-top calc(72px * size) so rising pages never overlap heading */}
      <div
        className="w-full flex justify-center items-center"
        style={{
          paddingTop: `calc(72px * ${size})`,
          overflow: 'visible',
        }}
        tabIndex={0}
        role="button"
        aria-label={`${service.title} folder`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <Folder
          mode="flap"
          variant="solid"
          layout={layout}
          tabPosition="right"
          label={service.folderLabel || service.title.split(' ')[0]}
          color={service.color || '#5B3CDB'}
          paperColor="#FFFFFF"
          size={size}
          tilt={0.35}
          bounce={0.4}
          peek={true}
          zoomOnClick={true}
          intro={true}
          theme="dark"
          closeOnOutsideClick={true}
          draggable={draggable}
          openOn={isFinePointer ? 'hover' : 'click'}
          open={isOpen}
          onOpenChange={setIsOpen}
          items={folderItems}
        />
      </div>

      {/* Under Folder: Number, Title, Description, Link */}
      <div className="w-full mt-4 flex flex-col items-center text-center px-1">
        <span className="font-mono text-[11px] text-white/40 tracking-wider uppercase block mb-1">
          {service.number}
        </span>
        <h3 className="font-tanker text-[clamp(20px,2vw,30px)] uppercase leading-[0.9] text-white tracking-tight mb-2">
          {service.title}
        </h3>
        <p className="font-mono text-[12px] text-white/70 leading-relaxed normal-case max-w-[260px] line-clamp-4 mb-3">
          {service.description}
        </p>
        <Link
          href={service.href || '/work'}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white font-bold hover:text-[#3D5AFE] transition-colors"
        >
          <span>EXPLORE</span>
          <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function WhatWeDo({ data, effects }: WhatWeDoProps) {
  const label = data.label || data.labelLeft || 'WHAT WE DO';
  const title = data.title || data.labelRight || 'FULL SERVICE PRODUCTION';
  const intro =
    data.intro ||
    'From the first idea to the final cut, one Chennai team handles strategy, production and visual finishing.';
  const items = data.items || [];

  const foldersEnabled = effects?.folders?.enabled !== false;
  const folderLayout = effects?.folders?.layout || 'stack';
  const folderDraggable = effects?.folders?.draggable ?? false;

  const [isClient, setIsClient] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  return (
    <section
      className="relative pt-[var(--space-section)] pb-[var(--space-section)] overflow-visible"
      style={{ backgroundColor: 'var(--bg-hero)' }}
      aria-label="Services"
    >
      <div className="max-w-[1440px] mx-auto px-[var(--page-x)]">
        {/* Section Header */}
        <div className="border-b border-white/15 pb-4 mb-8">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50 block mb-3">
            {label}
          </span>
          <h2 className="font-tanker text-white uppercase text-[clamp(48px,8vw,110px)] leading-[0.88] tracking-tight">
            {title}
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/70 max-w-xl mt-4 leading-relaxed normal-case">
            {intro}
          </p>
        </div>

        {/* 4-Folder Grid: 4 cols desktop (1024px+), 2x2 from 480px to 1023px, 2x2 on phones */}
        {foldersEnabled && isClient ? (
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-block)] items-start"
            style={{ overflow: 'visible' }}
          >
            {items.map((service, idx) => (
              <ServiceFolderCard
                key={service.number || idx}
                service={service}
                layout={folderLayout}
                draggable={folderDraggable}
                isFinePointer={isFinePointer}
              />
            ))}
          </div>
        ) : (
          /* Static Card Fallback */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-block)]">
            {items.map((service, idx) => (
              <div
                key={service.number || idx}
                className="h-full flex flex-col bg-[#151515] rounded-[16px] border border-white/10 p-5 group hover:border-white/30 transition-colors"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111] rounded-lg mb-4">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.alt || service.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 24vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#181818] flex items-center justify-center font-mono text-white/30 text-xs">
                      {service.number}
                    </div>
                  )}
                </div>
                <span className="font-mono text-[11px] text-white/40 tracking-wider uppercase block mb-1">
                  {service.number}
                </span>
                <h3 className="font-tanker text-[clamp(20px,2vw,30px)] uppercase leading-[0.9] text-white tracking-tight mb-2">
                  {service.title}
                </h3>
                <p className="font-mono text-[12px] text-white/70 leading-relaxed normal-case mb-4 flex-1">
                  {service.description}
                </p>
                <Link
                  href={service.href || '/work'}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white font-bold hover:text-[#3D5AFE] transition-colors mt-auto"
                >
                  <span>EXPLORE</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
