'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('a, button, [data-cursor]')) {
        cursor.classList.add('hovered');
      } else {
        cursor.classList.remove('hovered');
      }

      if (target.closest('input, textarea, select, [data-cursor-input]')) {
        cursor.classList.add('cursor-input');
      } else {
        cursor.classList.remove('cursor-input');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
