'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { HomeProject } from '@/lib/schemas/home';

export function extractInstagramEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const rawType = match[1];
  const type = rawType === 'reels' ? 'reel' : rawType;
  const shortcode = match[2];
  return `https://www.instagram.com/${type}/${shortcode}/embed`;
}

interface ReelViewerProps {
  isOpen: boolean;
  projects: HomeProject[];
  initialIndex: number;
  onClose: () => void;
  viewerLabels: {
    closeLabel: string;
    prevLabel: string;
    nextLabel: string;
    hint: string;
    reelBadge: string;
    postBadge: string;
  };
  instagram: {
    handle: string;
    profileUrl: string;
    openLabel: string;
    followLabel: string;
    embedFailedText: string;
  };
  triggerElement?: HTMLElement | null;
}

export default function ReelViewer({
  isOpen,
  projects,
  initialIndex,
  onClose,
  viewerLabels,
  instagram,
  triggerElement,
}: ReelViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Touch hint on first open
  useEffect(() => {
    if (isOpen) {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch) {
        setShowHint(true);
        const timer = setTimeout(() => setShowHint(false), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  // Lock scroll & stop Lenis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === 'function') lenis.stop();
    } else {
      document.body.style.overflow = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') lenis.start();
    };
  }, [isOpen]);

  // Safe navigation
  const goToNext = useCallback(() => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, projects.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Sync URL ?reel=XX and history
  useEffect(() => {
    if (!isOpen || projects.length === 0) return;
    const item = projects[currentIndex];
    if (!item) return;

    const reelParam = item.number || item.id;
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get('reel') !== reelParam) {
      currentParams.set('reel', reelParam);
      const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.pushState({ reel: reelParam }, '', newUrl);
    }
  }, [isOpen, currentIndex, projects]);

  // Handle browser Back button popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const reelParam = params.get('reel');
      if (!reelParam) {
        onClose();
      } else {
        const foundIndex = projects.findIndex(
          (p) => (p.number || p.id) === reelParam
        );
        if (foundIndex !== -1) {
          setCurrentIndex(foundIndex);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [projects, onClose]);

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reel')) {
      params.delete('reel');
      const newSearch = params.toString();
      const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
    onClose();
    if (triggerElement) {
      triggerElement.focus();
    }
  }, [onClose, triggerElement]);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, handleClose]);

  // Focus trap: focus close button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Iframe load timeout (6 seconds fallback)
  useEffect(() => {
    setIframeLoaded(false);
    setIframeFailed(false);

    const timer = setTimeout(() => {
      setIframeLoaded((loaded) => {
        if (!loaded) setIframeFailed(true);
        return loaded;
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Mouse wheel navigation (debounced 600ms)
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 600) return;

    if (e.deltaY > 30) {
      lastWheelTime.current = now;
      goToNext();
    } else if (e.deltaY < -30) {
      lastWheelTime.current = now;
      goToPrev();
    }
  };

  // Touch swipe up/down (>60px threshold)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current !== null) {
      if (touchDeltaY.current < -60) {
        goToNext();
      } else if (touchDeltaY.current > 60) {
        goToPrev();
      }
    }
    touchStartY.current = null;
    touchDeltaY.current = 0;
  };

  if (!mounted || !isOpen) return null;

  const currentItem = projects[currentIndex];
  if (!currentItem) return null;

  const totalCount = String(projects.length).padStart(2, '0');
  const activeCount = String(currentIndex + 1).padStart(2, '0');
  const embedUrl = extractInstagramEmbedUrl(currentItem.instagramUrl);
  const isReel = currentItem.mediaType === 'reel';
  const hasDirectVideo = Boolean(currentItem.video && currentItem.video.trim().length > 0);

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${currentItem.title} viewer`}
      className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background click to close */}
      <div
        className="absolute inset-0 z-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Top Left Counter */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 font-mono text-[12px] tracking-[0.05em] text-white/80 pointer-events-none">
        {activeCount} / {totalCount}
      </div>

      {/* Top Right Close Button (min 44x44px) */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={handleClose}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center font-mono text-[11px] uppercase tracking-wider text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF3300]"
        aria-label={viewerLabels.closeLabel}
      >
        ✕
      </button>

      {/* Touch device hint */}
      {showHint && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#FF3300] text-[#1a1a1a] font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded pointer-events-none transition-opacity">
          {viewerLabels.hint}
        </div>
      )}

      {/* Main Centered Frame */}
      <div
        ref={frameRef}
        className="relative z-10 w-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          maxHeight: 'min(88svh, 920px)',
          maxWidth: isReel ? 'calc(min(88svh, 920px) * 9 / 16)' : 'calc(min(88svh, 920px) * 4 / 5)',
          aspectRatio: isReel ? '9 / 16' : '4 / 5',
          borderRadius: '12px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Content Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          {/* Mode A: Direct video file */}
          {hasDirectVideo ? (
            <div className="relative w-full h-full">
              <video
                key={currentItem.video}
                src={currentItem.video}
                poster={currentItem.image}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 z-20 min-h-[44px] min-w-[44px] p-2 bg-black/60 text-white rounded-full text-xs font-mono"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          ) : embedUrl && !iframeFailed ? (
            /* Mode B: Instagram official embed iframe */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {/* Poster image until iframe finishes loading */}
              {!iframeLoaded && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={currentItem.image}
                    alt={currentItem.alt || currentItem.title}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-xs text-white/70 animate-pulse tracking-wider">
                      LOADING EMBED...
                    </span>
                  </div>
                </div>
              )}
              <iframe
                key={embedUrl}
                src={embedUrl}
                loading="lazy"
                scrolling="no"
                allow="autoplay; encrypted-media; fullscreen"
                title={`Instagram post: ${currentItem.title}`}
                className="relative z-10 w-full h-full border-0"
                style={{ borderRadius: '8px' }}
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          ) : (
            /* Fallback: Poster image + Open on Instagram button */
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#0f0f0f]">
              <Image
                src={currentItem.image}
                alt={currentItem.alt || currentItem.title}
                fill
                className="object-cover opacity-40"
              />
              <div className="relative z-10 max-w-xs flex flex-col items-center gap-4">
                <span className="font-tanker text-xl sm:text-2xl text-white tracking-wide uppercase">
                  {currentItem.title}
                </span>
                <p className="font-mono text-[11px] text-white/70 leading-relaxed">
                  {instagram.embedFailedText}
                </p>
                <a
                  href={currentItem.instagramUrl || instagram.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3 bg-[#FF3300] text-[#1a1a1a] font-mono text-[11px] font-bold uppercase tracking-wider rounded transition-transform hover:scale-105 min-h-[44px]"
                >
                  {instagram.openLabel} ↗
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-1 text-left font-mono">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#FF3300] font-bold">
              @{instagram.handle}
            </span>
            {currentItem.instagramUrl && (
              <a
                href={currentItem.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-wider text-white/80 hover:text-white underline underline-offset-2 min-h-[32px] flex items-center"
              >
                {instagram.openLabel} ↗
              </a>
            )}
          </div>
          <div className="font-tanker text-[18px] sm:text-[22px] text-white uppercase leading-none tracking-wide">
            {currentItem.title}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/60">
            {currentItem.category} • {currentItem.year}
          </div>
        </div>
      </div>

      {/* Desktop Up/Down Navigation Buttons (on the right of the frame) */}
      <div className="hidden md:flex flex-col gap-3 absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20">
        <button
          type="button"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-white font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF3300]"
          aria-label={viewerLabels.prevLabel}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={goToNext}
          disabled={currentIndex === projects.length - 1}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center text-white font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF3300]"
          aria-label={viewerLabels.nextLabel}
        >
          ▼
        </button>
      </div>
    </div>,
    document.body
  );
}

