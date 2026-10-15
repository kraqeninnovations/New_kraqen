'use client';

import { useEffect } from 'react';

export default function LenisInit() {
  useEffect(() => {
    let lenis: import('lenis').default | undefined;
    let tickerCallback: ((time: number) => void) | undefined;
    let cancelled = false;

    const init = async () => {
      const { default: Lenis } = await import('lenis');
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const instance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });
      lenis = instance;

      // Sync Lenis with GSAP ScrollTrigger
      instance.on('scroll', ScrollTrigger.update);

      tickerCallback = (time) => {
        instance.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      cancelled = true;
      if (lenis) lenis.destroy();
      if (tickerCallback) {
        import('gsap').then(({ gsap }) => gsap.ticker.remove(tickerCallback!));
      }
    };
  }, []);

  return null;
}
