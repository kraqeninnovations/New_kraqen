'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type BrandVariant = 'nav' | 'menu' | 'footer' | 'marquee' | 'default';

interface BrandProps {
  variant?: BrandVariant;
  src?: string;
  alt?: string;
  name?: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
  style?: React.CSSProperties;
  height?: number | string;
}

export default function Brand({
  variant = 'nav',
  src = '/brand/kraqen-mark.png',
  name = 'KRAQEN INNOVATIONS',
  className = '',
  onClick,
  priority = true,
  style,
  height,
}: BrandProps) {
  let heightStyle: string | number = height || (style?.height as string | number) || 'var(--logo-h)';
  if (!height && !style?.height) {
    if (variant === 'menu') heightStyle = '28px';
    else if (variant === 'footer') heightStyle = 'var(--footer-logo-h, 44px)';
    else if (variant === 'marquee') heightStyle = '32px';
  }

  const showWord = variant === 'nav' || variant === 'menu';

  if (!showWord) {
    return (
      <Link
        href="/"
        aria-label="Kraqen Innovations LLP - Home"
        onClick={onClick}
        className={`inline-flex items-center justify-center p-1 min-h-[44px] min-w-[44px] pointer-events-auto transition-opacity hover:opacity-85 ${className}`}
      >
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          width={0}
          height={0}
          sizes="44px"
          priority={priority}
          style={{ height: heightStyle, width: 'auto' }}
          className="object-contain flex-shrink-0"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Kraqen Innovations LLP - Home"
      onClick={onClick}
      className={`brand-link pointer-events-auto text-white flex items-center gap-2.5 md:gap-3 ${className}`}
      style={{
        color: '#FFFFFF',
        textDecoration: 'none',
      }}
    >
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={0}
        height={0}
        sizes="40px"
        priority={priority}
        style={{ height: heightStyle, width: 'auto' }}
        className="object-contain flex-shrink-0"
      />
      <span
        className="brand-word text-white font-tanker uppercase text-[16px] md:text-[22px] tracking-[0.04em] whitespace-nowrap"
        style={{
          color: '#FFFFFF',
          WebkitTextFillColor: '#FFFFFF',
          opacity: 1,
          textShadow: 'none',
          filter: 'none',
        }}
      >
        {name}
      </span>
    </Link>
  );
}
