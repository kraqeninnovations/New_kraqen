import { SelectedWorkSection } from './site/KraqenSections';
import { useSiteData } from '@/lib/site-data';

export function SelectedWork() {
  const data = useSiteData();
  return <SelectedWorkSection />;
}

export default SelectedWork;
