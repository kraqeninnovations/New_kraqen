import { BrandStatementSection } from './site/KraqenSections';
import { useSiteData } from '@/lib/site-data';

export function BrandStatement() {
  const data = useSiteData();
  return <BrandStatementSection />;
}

export default BrandStatement;
