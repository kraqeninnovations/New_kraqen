'use client';

import ClientLogoGrid from './ClientLogoGrid';
import type { AboutContent } from '@/lib/schemas/about';
import type { HomeClient } from '@/lib/schemas/home';

interface AboutApproachProps {
  data: AboutContent['approach'];
  homeClients: HomeClient[];
}

export default function AboutApproach({ data, homeClients }: AboutApproachProps) {
  const clients = data.useHomePartners || !data.clients || data.clients.length === 0 ? homeClients : data.clients;

  return (
    <ClientLogoGrid
      labelLeft={data.labelLeft}
      labelRight={data.labelRight}
      headingLines={data.headlineLines}
      clients={clients}
      fillEmptyCells={data.fillEmptyCells}
      sectionId="approach"
      sectionAriaLabel="Approach and Selected Partners"
      className="pt-[40px] pb-[160px]"
    />
  );
}
