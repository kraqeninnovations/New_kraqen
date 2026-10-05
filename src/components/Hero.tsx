import { HeroSection } from './site/KraqenSections';
import { useSiteData } from '@/lib/site-data';

export function Hero() {
  const data = useSiteData();
  return <HeroSection />;
}

export default Hero;
