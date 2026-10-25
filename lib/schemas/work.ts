import { z } from 'zod';

export const workSourceSchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  label: z.string().min(1),
  profileUrl: z.string().url(),
  category: z.string().min(1),
});

export const workFilterSchema = z.object({
  id: z.string().min(1, 'Filter id is required'),
  label: z.string().min(1, 'Filter label is required'),
});

export const workCategorySchema = z.object({
  id: z.string().min(1, 'Category id is required'),
  title: z.string().min(1, 'Category title is required'),
  enabled: z.boolean().default(true),
});

export const workProcessStepSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

export const workGalleryItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  ratio: z.enum(['4:5', '16:9', '9:16']).default('16:9'),
});

export const workCreditSchema = z.object({
  role: z.string().default(''),
  name: z.string().default(''),
});

export const workDetailSchema = z.object({
  intro: z.string().default(''),
  brief: z.string().default(''),
  process: z.array(workProcessStepSchema).default([]),
  gear: z.array(z.string()).default([]),
  location: z.string().default(''),
  credits: z.array(workCreditSchema).default([]),
  gallery: z.array(workGalleryItemSchema).default([]),
});

export const workItemSchema = z
  .object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().min(1, 'Title is required'),
    source: z.string().optional().default('kraqen'),
    category: z.string().min(1, 'Category is required'),
    mediaType: z.enum(['image', 'video', 'reel']).default('image'),
    ratio: z.enum(['4:5', '16:9', '9:16']).default('4:5'),
    image: z.string().optional(),
    src: z.string().optional(),
    focus: z.string().default('50% 30%'),
    poster: z.string().optional().default(''),
    video: z.string().optional().default(''),
    instagramUrl: z.string().optional().default(''),
    alt: z.string().default(''),
    year: z.union([z.number(), z.string()]).default(2026),
    featured: z.boolean().optional().default(false),
    clientIndustry: z.string().default(''),
    deliverable: z.string().default(''),
    result: z.string().default(''),
    detail: workDetailSchema,
  })
  .transform((item) => {
    const finalImage = item.image || item.src || '/images/work/reel-01.webp';
    return {
      ...item,
      image: finalImage,
      src: finalImage,
    };
  });

export const workSchema = z
  .object({
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
    header: z.object({
      title: z.string().min(1, 'Header title is required'),
      subtitle: z.string().min(1, 'Header subtitle is required'),
    }),
    sources: z.array(workSourceSchema).default([]),
    filters: z
      .object({
        enabled: z.boolean().default(false),
        items: z.array(workFilterSchema).default([]),
      })
      .default({ enabled: false, items: [] }),
    layout: z
      .object({
        tileAspect: z.string().default('4/5'),
        columns: z
          .object({
            desktop: z.number().default(4),
            laptop: z.number().default(3),
            tablet: z.number().default(2),
          })
          .default({ desktop: 4, laptop: 3, tablet: 2 }),
        gridGap: z.number().default(8),
      })
      .default({
        tileAspect: '4/5',
        columns: { desktop: 4, laptop: 3, tablet: 2 },
        gridGap: 8,
      }),
    categories: z.array(workCategorySchema).min(1, 'At least one category required'),
    items: z.array(workItemSchema).min(1, 'At least one work item required'),
  })
  .superRefine((data, ctx) => {
    const categoryIds = new Set(data.categories.map((c) => c.id));
    const sourceIds = new Set(data.sources.map((s) => s.id));
    const slugs = new Set<string>();

    data.items.forEach((item, index) => {
      // Check unique slug
      if (slugs.has(item.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate item slug "${item.slug}" found. Slugs must be unique.`,
          path: ['items', index, 'slug'],
        });
      }
      slugs.add(item.slug);

      // Check category match
      if (!categoryIds.has(item.category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Category "${item.category}" in item "${item.slug}" does not match any category id. Valid ids: ${Array.from(categoryIds).join(', ')}`,
          path: ['items', index, 'category'],
        });
      }

      // Check source match if sources are defined
      if (sourceIds.size > 0 && item.source && !sourceIds.has(item.source)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Source "${item.source}" in item "${item.slug}" does not match any source id.`,
          path: ['items', index, 'source'],
        });
      }
    });
  });

export type WorkContent = z.infer<typeof workSchema>;
export type WorkItem = z.infer<typeof workItemSchema>;
export type WorkCategory = z.infer<typeof workCategorySchema>;
export type WorkSource = z.infer<typeof workSourceSchema>;
export type WorkDetail = z.infer<typeof workDetailSchema>;
export type WorkGalleryItem = z.infer<typeof workGalleryItemSchema>;
