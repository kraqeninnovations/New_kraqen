'use client';

import ClientLogoGrid from './ClientLogoGrid';
import type { HomeContent } from '@/lib/schemas/home';

interface PartnersProps {
  data: HomeContent['partners'];
}

export default function Partners({ data }: PartnersProps) {
  return (
    <ClientLogoGrid
      labelLeft={data.labelLeft}
      labelRight={data.labelRight}
      headingLines={data.headingLines}
      clients={data.clients}
      fillEmptyCells={data.fillEmptyCells}
      sectionId="partners"
      sectionAriaLabel="Partners"
    />
  );
}
