import { WhatWeDoSection } from './site/KraqenSections';
import { useSiteData } from '@/lib/site-data';

export function Services() {
  const data = useSiteData();
  return <WhatWeDoSection />;
}

export default Services;
