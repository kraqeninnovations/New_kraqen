import { z } from 'zod';

export const homePartnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().min(1),
});

export const homeServiceItemSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1).default('/work'),
});

export const homeSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
  }),
  hero: z.object({
    headlineLines: z.array(z.string().min(1)).min(1, 'Hero headline lines required'),
    location: z.string().min(1, 'Hero location is required'),
    paragraph: z.string().min(1, 'Hero paragraph is required'),
    cta: z.object({
      label: z.string().min(1, 'Hero CTA label is required'),
      href: z.string().min(1, 'Hero CTA href is required'),
    }),
    images: z.array(
      z.object({
        src: z.string().min(1, 'Hero image src is required'),
        alt: z.string().min(1, 'Hero image alt is required'),
        position: z.string().optional().default('top-center'),
      })
    ).min(1, 'At least one hero image required'),
  }),
  selectedWork: z.object({
    label: z.string().default('SELECTED WORK'),
    headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
    sideText: z.string().default(''),
    featuredSlugs: z.array(z.string().min(1)).min(1, 'At least one featured slug required'),
    labels: z.object({
      client: z.string().default('CLIENT / INDUSTRY'),
      deliverable: z.string().default('DELIVERABLE'),
      result: z.string().default('RESULT / IMPACT'),
    }),
    viewLabel: z.string().default('VIEW PROJECT'),
  }),
  services: z.object({
    labelLeft: z.string().default('WHAT WE DO'),
    labelRight: z.string().default('FULL SERVICE PRODUCTION'),
    items: z.array(homeServiceItemSchema).min(1, 'At least one service required'),
  }),
  partners: z.object({
    labelLeft: z.string().default('OUR CLIENTS'),
    labelRight: z.string().default('SELECTED PARTNERS'),
    headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
    runner: z.object({
      enabled: z.boolean().default(true),
      direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
      speedSeconds: z.number().min(5).max(120).default(40),
      pauseOnHover: z.boolean().default(true),
    }).default({
      enabled: true,
      direction: 'horizontal',
      speedSeconds: 40,
      pauseOnHover: true,
    }),
    items: z.array(homePartnerSchema).min(1, 'At least one partner item required'),
  }),
});

export type HomeContent = z.infer<typeof homeSchema>;
export type HomePartner = z.infer<typeof homePartnerSchema>;
export type HomeServiceItem = z.infer<typeof homeServiceItemSchema>;
