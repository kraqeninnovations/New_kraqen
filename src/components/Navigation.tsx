import { Navbar } from './site/Chrome';
import { useSiteData } from '@/lib/site-data';

export function Navigation() {
  const data = useSiteData();
  return <Navbar />;
}

export default Navigation;
