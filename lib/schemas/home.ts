import { z } from 'zod';

export const homePartnerSchema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1),
  tile: z.string().optional(),
  url: z.string().optional().default(''),
});

export const folderItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  alt: z.string().optional(),
});

export const homeServiceItemSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  folderLabel: z.string().optional(),
  color: z.string().optional(),
  folderItems: z.array(folderItemSchema).optional(),
  image: z.string().optional(),
  alt: z.string().optional(),
  href: z.string().min(1).default('/work'),
});

export const homeSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
    keywords: z.union([
      z.array(z.string()),
      z.object({
        primary: z.array(z.string()).default([]),
        secondary: z.array(z.string()).default([]),
      }),
    ]).optional(),
  }),
  hero: z.object({
    headlineLines: z.array(z.string().min(1)).min(1, 'Hero headline lines required'),
    location: z.string().optional().default('CHENNAI - IN'),
    paragraph: z.string().min(1, 'Hero paragraph is required'),
    cta: z.object({
      label: z.string().min(1, 'Hero CTA label is required'),
      href: z.string().min(1, 'Hero CTA href is required'),
    }),
    video: z.object({
      src: z.string().min(1),
      srcMobile: z.string().optional(),
      poster: z.string().min(1),
      overlay: z.number().min(0).max(1).default(0.45),
    }).optional(),
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
    label: z.string().optional().default('WHAT WE DO'),
    title: z.string().optional().default('FULL SERVICE PRODUCTION'),
    intro: z.string().optional(),
    labelLeft: z.string().optional(),
    labelRight: z.string().optional(),
    items: z.array(homeServiceItemSchema).min(1, 'At least one service required'),
  }).transform((s) => ({
    ...s,
    label: s.label || s.labelLeft || 'WHAT WE DO',
    title: s.title || s.labelRight || 'FULL SERVICE PRODUCTION',
  })),
  partners: z.object({
    labelLeft: z.string().default('OUR CLIENTS'),
    labelRight: z.string().default('SELECTED PARTNERS'),
    headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
    tileMode: z.enum(['keep', 'white']).default('keep'),
    runner: z.any().optional(),
    items: z.array(homePartnerSchema).min(1, 'At least one partner item required'),
  }),
});

export type HomeContent = z.infer<typeof homeSchema>;
export type HomePartner = z.infer<typeof homePartnerSchema>;
export type HomeServiceItem = z.infer<typeof homeServiceItemSchema>;
