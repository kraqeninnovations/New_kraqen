'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const SplashCursor = dynamic<any>(() => import('@/components/fx/SplashCursor'), {
  ssr: false,
});

interface FxLayerProps {
  effects?: {
    splashCursor?: {
      enabled?: boolean;
      colors?: string[];
      clickSplash?: boolean;
      trailOnMove?: boolean;
      desktopQuality?: 'low' | 'medium' | 'high';
      touchQuality?: 'low' | 'medium' | 'high';
      intensity?: number;
      size?: number;
      force?: number;
      swirl?: number;
      trail?: number;
      momentum?: number;
      shading?: number;
    };
  };
}

function checkWebGL2(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function FxLayer({ effects }: FxLayerProps) {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const fpsMonitoringActive = useRef(false);

  const splashConfig = effects?.splashCursor;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Guard checks:
    if (splashConfig?.enabled === false) return;

    try {
      if (sessionStorage.getItem('fx-off') === '1') return;
    } catch {
      // sessionStorage might fail in strict private mode
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nav = navigator as any;
    if (nav.connection?.saveData) return;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return;
    if (nav.deviceMemory && nav.deviceMemory <= 2) return;
    if (!checkWebGL2()) return;

    const touchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touchDevice);
    setMounted(true);

    // Performance Guard: measure FPS over 3 seconds after first pointer interaction
    const startFpsMonitor = () => {
      if (fpsMonitoringActive.current) return;
      fpsMonitoringActive.current = true;

      window.removeEventListener('pointerdown', startFpsMonitor);
      window.removeEventListener('pointermove', startFpsMonitor);

      let frames = 0;
      let startTime = performance.now();
      let rafId = 0;

      const loop = (now: number) => {
        frames++;
        const elapsed = now - startTime;
        if (elapsed < 3000) {
          rafId = requestAnimationFrame(loop);
        } else {
          const fps = frames / (elapsed / 1000);
          if (fps < 40) {
            try {
              sessionStorage.setItem('fx-off', '1');
            } catch {}
            setMounted(false);
          }
        }
      };

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointerdown', startFpsMonitor, { passive: true });
    window.addEventListener('pointermove', startFpsMonitor, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', startFpsMonitor);
      window.removeEventListener('pointermove', startFpsMonitor);
    };
  }, [splashConfig]);

  if (!mounted || !splashConfig || splashConfig.enabled === false) {
    return null;
  }

  const quality = isTouch
    ? splashConfig.touchQuality || 'low'
    : splashConfig.desktopQuality || 'medium';

  const trailOnMove = isTouch ? false : splashConfig.trailOnMove ?? true;

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 40 }}
      aria-hidden="true"
    >
      <SplashCursor
        colors={splashConfig.colors || ['#5B3CDB', '#3D5AFE', '#22C55E']}
        rainbow={false}
        intensity={splashConfig.intensity ?? 0.5}
        size={splashConfig.size ?? 0.7}
        force={splashConfig.force ?? 0.6}
        swirl={splashConfig.swirl ?? 2}
        trail={splashConfig.trail ?? 0.7}
        momentum={splashConfig.momentum ?? 0.8}
        shading={splashConfig.shading ?? 0.6}
        glow={0}
        clickSplash={splashConfig.clickSplash ?? true}
        trailOnMove={trailOnMove}
        intro={false}
        contained={false}
        theme="dark"
        quality={quality}
        zIndex={40}
      />
    </div>
  );
}
