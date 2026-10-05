import { Footer as ChromeFooter } from './site/Chrome';
import { useSiteData } from '@/lib/site-data';

export function Footer() {
  const data = useSiteData();
  return <ChromeFooter />;
}

export default Footer;
