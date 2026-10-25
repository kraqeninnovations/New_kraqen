'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PageTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // On page change, wipe out the curtain
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealPage = async () => {
      const { gsap } = await import('gsap');
      if (curtainRef.current) {
        gsap.to(curtainRef.current, {
          yPercent: -100,
          duration: 0.3,
          ease: 'power3.inOut',
          onComplete: () => {
            if (curtainRef.current) {
              gsap.set(curtainRef.current, { yPercent: 100 });
            }
          },
        });
      }
    };

    revealPage();
  }, [pathname]);

  // Intercept navigation links between distinct app pages for smooth wipe
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleLinkClick = async (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      const targetPath = href.split('#')[0] || '/';
      const isInternalNav =
        (targetPath === '/' ||
          targetPath === '/work' ||
          targetPath === '/about' ||
          targetPath === '/contact') &&
        targetPath !== pathname;

      if (isInternalNav) {
        e.preventDefault();
        const { gsap } = await import('gsap');

        if (curtainRef.current) {
          gsap.fromTo(
            curtainRef.current,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.3,
              ease: 'power3.inOut',
              onComplete: () => {
                router.push(href);
              },
            }
          );
        } else {
          router.push(href);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [pathname, router]);

  return (
    <div
      ref={curtainRef}
      className="page-transition-curtain flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    />
  );
}
