'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ScrollRowProps {
  children: React.ReactNode;
  itemCount: number;
  className?: string;
  itemWidthClass?: string;
}

export default function ScrollRow({
  children,
  itemCount,
  className = '',
  itemWidthClass = 'w-[78vw] max-w-[340px] shrink-0',
}: ScrollRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setProgress(1);
      setCurrentIndex(0);
      return;
    }

    const currentScroll = el.scrollLeft;
    const progressPct = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
    setProgress(progressPct);

    // Calculate which item is currently closest to the start
    const itemWidth = el.scrollWidth / itemCount;
    const idx = Math.min(Math.round(currentScroll / itemWidth), itemCount - 1);
    setCurrentIndex(idx);
  };

  useEffect(() => {
    handleScroll();
  }, [itemCount]);

  const currentFormatted = String(currentIndex + 1).padStart(2, '0');
  const totalFormatted = String(itemCount).padStart(2, '0');

  return (
    <div className={`md:hidden w-full ${className}`}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        data-lenis-prevent="true"
        className="flex gap-[var(--space-block)] overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-[var(--page-x)] [scroll-padding-inline:var(--page-x)] [overscroll-behavior-x:contain] touch-pan-x touch-pan-y no-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className={`snap-start shrink-0 ${itemWidthClass}`}>
            {child}
          </div>
        ))}
      </div>

      {/* Progress Line & Counter */}
      {itemCount > 1 && (
        <div className="mt-4 px-[var(--page-x)] flex items-center justify-between gap-4">
          <div className="flex-1 h-[1px] bg-[var(--line)] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-white transition-[width] duration-150 ease-out"
              style={{
                width: `${Math.max(15, progress * 100)}%`,
              }}
            />
          </div>
          <span className="font-mono text-[11px] tracking-wider text-[var(--text-muted)] shrink-0">
            {currentFormatted} / {totalFormatted}
          </span>
        </div>
      )}
    </div>
  );
}

