import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '@/lib/site-data';

interface AnimatedTextProps {
  text: string | string[];
  className?: string;
  as?: React.ElementType;
}

export function AnimatedText({ text, className = '', as: Component = 'div' }: AnimatedTextProps) {
  const { animations } = useSiteData();
  const textReveal = animations?.textReveal || { duration: 900, stagger: 100, y: 60 };
  const duration = textReveal.duration / 1000;
  const lines = Array.isArray(text) ? text : [text];

  if (animations?.enabled === false) {
    return (
      <Component className={className}>
        {lines.map((line, idx) => (
          <span key={idx} className="block">{line}</span>
        ))}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {lines.map((line, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: textReveal.y }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration, delay: (idx * textReveal.stagger) / 1000, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {line}
        </motion.span>
      ))}
    </Component>
  );
}

export default AnimatedText;
