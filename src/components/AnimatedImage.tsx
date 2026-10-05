import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '@/lib/site-data';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function AnimatedImage({ src, alt, className = '', containerClassName = '' }: AnimatedImageProps) {
  const { animations } = useSiteData();
  const imageReveal = animations?.imageReveal || { duration: 1000, scale: 1.05, blur: 8 };
  const duration = imageReveal.duration / 1000;

  if (animations?.enabled === false) {
    return (
      <div className={`overflow-hidden ${containerClassName}`}>
        <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: imageReveal.scale, filter: `blur(${imageReveal.blur}px)` }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      className={`overflow-hidden ${containerClassName}`}
    >
      <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />
    </motion.div>
  );
}

export default AnimatedImage;
