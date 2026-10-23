import { z } from 'zod';

export const workFilterSchema = z.object({
  id: z.string().min(1, 'Filter id is required'),
  label: z.string().min(1, 'Filter label is required'),
});

export const workCategorySchema = z.object({
  id: z.string().min(1, 'Category id is required'),
  title: z.string().min(1, 'Category title is required'),
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

export const workItemSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  mediaType: z.enum(['image', 'video', 'reel']).default('image'),
  ratio: z.enum(['4:5', '16:9', '9:16']).default('4:5'),
  src: z.string().min(1, 'Src image is required'),
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
});

export const workSchema = z
  .object({
    seo: z.object({
      title: z.string().min(1, 'SEO title is required'),
      description: z.string().min(1, 'SEO description is required'),
    }),
    header: z.object({
      title: z.string().min(1, 'Header title is required'),
      subtitle: z.string().min(1, 'Header subtitle is required'),
    }),
    filters: z.object({
      enabled: z.boolean().default(false),
      items: z.array(workFilterSchema).default([]),
    }).default({
      enabled: false,
      items: [],
    }),
    layout: z.object({
      maxWidth: z.number().default(1400),
      gap: z.number().default(12),
      pattern: z.array(z.array(z.string())).default([
        ['4:5', '4:5', '4:5', '4:5'],
        ['16:9', '16:9', '9:16'],
        ['9:16', '16:9', '9:16', '4:5'],
      ]),
    }).default({
      maxWidth: 1400,
      gap: 12,
      pattern: [
        ['4:5', '4:5', '4:5', '4:5'],
        ['16:9', '16:9', '9:16'],
        ['9:16', '16:9', '9:16', '4:5'],
      ],
    }),
    categories: z.array(workCategorySchema).min(1, 'At least one category required'),
    items: z.array(workItemSchema).min(1, 'At least one work item required'),
  })
  .superRefine((data, ctx) => {
    const categoryIds = new Set(data.categories.map((c) => c.id));
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
    });
  });

export type WorkContent = z.infer<typeof workSchema>;
export type WorkItem = z.infer<typeof workItemSchema>;
export type WorkCategory = z.infer<typeof workCategorySchema>;
export type WorkDetail = z.infer<typeof workDetailSchema>;
export type WorkGalleryItem = z.infer<typeof workGalleryItemSchema>;
