import React from 'react';
import Image from 'next/image';

// variant kept for API compatibility; color is baked into the PNG itself
export type LogoVariant = 'white' | 'dark' | 'ink' | 'accent' | 'currentColor' | 'default' | 'raw';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  alt?: string;
  src?: string;
}

export default function Logo({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'white',
  className = 'h-6 md:h-8 w-auto',
  style,
  priority = false,
  alt = 'Kraqen Innovations LLP',
  src = '/brand/kraqen-mark.png',
}: LogoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={512}
      height={512}
      priority={priority}
      className={`object-contain ${className}`}
      style={{ width: 'auto', ...style }}
      sizes="(max-width: 768px) 48px, 64px"
    />
  );
}
