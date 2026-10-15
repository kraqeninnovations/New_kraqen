'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { SiteContent } from '@/lib/schemas/site';

interface FloatingReelWidgetProps {
  data: SiteContent['reelWidget'];
}

export default function FloatingReelWidget({ data }: FloatingReelWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Show widget after scrolling down 300px
  useEffect(() => {
    if (!data?.enabled) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data?.enabled]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Play / reset when modal opens or closes
  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.muted = isMuted;
      modalVideoRef.current.play().catch(() => {
        if (modalVideoRef.current) {
          modalVideoRef.current.muted = true;
          setIsMuted(true);
          modalVideoRef.current.play().catch(() => {});
        }
      });
    } else if (!isOpen && modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  }, [isOpen, isMuted]);

  // Update muted state without resetting video
  useEffect(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  if (!data?.enabled) return null;

  return (
    <>
      {/* Floating Thumbnail Widget */}
      <div
        className="floating-reel-widget"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          transform: isVisible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="View Showreel video"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <video
          ref={previewVideoRef}
          src={data.previewSrc}
          poster={data.posterSrc}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={(e) => {
            e.currentTarget.muted = true;
            e.currentTarget.play().catch(() => {});
          }}
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <span className="floating-reel-badge">{data.label}</span>
      </div>

      {/* Fullscreen Showreel Modal */}
      {isOpen && (
        <div
          className="reel-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={data.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="reel-modal-content">
            {/* Modal Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
              <span className="text-white font-mono text-[11px] tracking-[0.05em] uppercase drop-shadow-md">
                {data.title}
              </span>
              <div className="flex items-center gap-3 pointer-events-auto">
                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="px-3 py-1.5 rounded bg-black/60 hover:bg-black/80 text-white font-mono text-[10px] uppercase tracking-wider backdrop-blur border border-white/20 transition-colors"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? 'UNMUTE 🔈' : 'MUTE 🔊'}
                </button>
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded bg-black/60 hover:bg-black/80 text-white font-mono text-[10px] uppercase tracking-wider backdrop-blur border border-white/20 transition-colors"
                  aria-label="Close showreel modal"
                >
                  CLOSE [ESC] ✕
                </button>
              </div>
            </div>

            {/* Video Player */}
            <video
              ref={modalVideoRef}
              src={data.videoSrc}
              poster={data.posterSrc}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
