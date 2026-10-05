import { BuiltWithSection } from './site/KraqenSections';
import { useSiteData } from '@/lib/site-data';

export function ProjectGrid() {
  const data = useSiteData();
  return <BuiltWithSection />;
}

export default ProjectGrid;
