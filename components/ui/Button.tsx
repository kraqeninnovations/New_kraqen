'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SpecularButton from '@/components/fx/SpecularButton';

let activeSpecularButtons = 0;

function checkWebGL2(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'round';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  disabled?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  children,
  className = '',
  onClick,
  disabled = false,
  style,
  type = 'button',
  ...rest
}: ButtonProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [canMountSpecular, setCanMountSpecular] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [hasWebGl, setHasWebGl] = useState(true);
  const isHoldingSlotRef = useRef(false);

  useEffect(() => {
    if (variant !== 'primary') return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    setIsFinePointer(fine);
    const webglSupported = checkWebGL2();
    setHasWebGl(webglSupported);

    if (!webglSupported) return;

    const maxLive = fine ? 8 : 3;
    const el = containerRef.current;
    if (!el) return;

    // Observer to mount when within 300px
    const mountObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isHoldingSlotRef.current && activeSpecularButtons < maxLive) {
            activeSpecularButtons++;
            isHoldingSlotRef.current = true;
            setCanMountSpecular(true);
          }
        }
      },
      { rootMargin: '300px 0px 300px 0px' }
    );

    // Observer to release when more than 800px away
    const releaseObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          if (isHoldingSlotRef.current) {
            activeSpecularButtons = Math.max(0, activeSpecularButtons - 1);
            isHoldingSlotRef.current = false;
            setCanMountSpecular(false);
          }
        }
      },
      { rootMargin: '800px 0px 800px 0px' }
    );

    mountObserver.observe(el);
    releaseObserver.observe(el);

    return () => {
      mountObserver.disconnect();
      releaseObserver.disconnect();
      if (isHoldingSlotRef.current) {
        activeSpecularButtons = Math.max(0, activeSpecularButtons - 1);
        isHoldingSlotRef.current = false;
      }
    };
  }, [variant]);

  // VARIANT: ROUND (plain CSS circle button, no WebGL)
  if (variant === 'round') {
    const roundClasses = `btn-round ${className}`.trim();

    if (href) {
      const isExternal = href.startsWith('http') || target === '_blank';
      return (
        <Link
          ref={containerRef as any}
          href={href}
          target={target}
          rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
          className={roundClasses}
          onClick={onClick}
          style={style}
          {...(rest as any)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={containerRef as any}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={roundClasses}
        style={style}
        {...rest}
      >
        {children}
      </button>
    );
  }

  // VARIANT: PRIMARY with WebGL SpecularButton
  if (canMountSpecular && hasWebGl) {
    return (
      <SpecularButton
        ref={containerRef as any}
        size={size}
        radius={999}
        tint="#3D5AFE"
        tintOpacity={0.92}
        textColor="#FFFFFF"
        lineColor="#FFFFFF"
        baseColor="#7C8CFF"
        intensity={1}
        idleIntensity={0.45}
        shineSize={12}
        shineFade={34}
        thickness={1.2}
        glow={1}
        followMouse={isFinePointer}
        proximity={250}
        autoAnimate={false}
        disabled={disabled}
        onClick={onClick}
        href={href}
        target={target}
        rel={rel}
        type={type}
        className={`btn-primary font-mono text-xs uppercase tracking-wider ${className}`}
        style={{
          minHeight: '52px',
          ...style,
        }}
        {...(rest as any)}
      >
        {children}
      </SpecularButton>
    );
  }

  // PLAIN FALLBACK for PRIMARY (when outside viewport, WebGL2 missing, or over live budget)
  const fallbackClasses = `specular-button specular-button--${size} btn-primary font-mono text-xs uppercase tracking-wider ${className}`.trim();
  const fallbackStyle: React.CSSProperties = {
    '--sb-radius': '999px',
    '--sb-tint': '#3D5AFE',
    '--sb-tint-opacity': '0.92',
    '--sb-text-color': '#FFFFFF',
    minHeight: '52px',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.22), 0 10px 24px -14px rgba(0, 0, 0, 0.45)',
    backgroundColor: '#3D5AFE',
    color: '#FFFFFF',
    borderRadius: '999px',
    ...style,
  } as React.CSSProperties;

  if (href) {
    const isExternal = href.startsWith('http') || target === '_blank';
    return (
      <Link
        ref={containerRef as any}
        href={href}
        target={target}
        rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
        className={fallbackClasses}
        onClick={onClick}
        style={fallbackStyle}
        {...(rest as any)}
      >
        <span className="specular-button__label">{children}</span>
      </Link>
    );
  }

  return (
    <button
      ref={containerRef as any}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={fallbackClasses}
      style={fallbackStyle}
      {...rest}
    >
      <span className="specular-button__label">{children}</span>
    </button>
  );
}

