'use client';

import ClientLogoGrid from './ClientLogoGrid';

interface AboutApproachProps {
  data?: any;
  homeClients?: any[];
}

export default function AboutApproach({ data, homeClients = [] }: AboutApproachProps) {
  if (!data) return null;
  const clients = data.useHomePartners || !data.clients || data.clients.length === 0 ? homeClients : data.clients;

  return (
    <ClientLogoGrid
      labelLeft={data.labelLeft}
      labelRight={data.labelRight}
      headingLines={data.headlineLines}
      clients={clients}
      fillEmptyCells={data.fillEmptyCells}
      sectionId="approach"
      sectionAriaLabel="Our Approach and Partners"
    />
  );
}
