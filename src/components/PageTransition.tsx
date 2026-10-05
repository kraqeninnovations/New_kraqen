import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '@/lib/site-data';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { animations } = useSiteData();
  const duration = (animations?.pageTransition?.duration || 600) / 1000;

  if (animations?.enabled === false) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
