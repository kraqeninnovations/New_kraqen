import { z } from 'zod';

export const workFilterSchema = z.object({
  id: z.string().min(1, 'Filter id is required'),
  label: z.string().min(1, 'Filter label is required'),
});

export const workProjectSchema = z.object({
  id: z.string().min(1, 'Project id is required'),
  title: z.string().min(1, 'Project title is required'),
  category: z.string().min(1, 'Project category is required'),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
  year: z.string().min(1, 'Project year is required'),
  image: z.string().min(1, 'Project image is required'),
  isVideo: z.boolean().optional(),
  videoSrc: z.string().optional(),
  aspect: z.string().default('aspect-[16/9]'),
  column: z.enum(['left', 'right']),
});

export const workSchema = z
  .object({
    seo: z.object({
      title: z.string().min(1, 'SEO title is required'),
      description: z.string().min(1, 'SEO description is required'),
    }),
    header: z.object({
      title: z.string().min(1, 'Header title is required'),
      countFormat: z.string().default('{count} / {total}'),
      filters: z.array(workFilterSchema).min(1, 'At least one filter is required'),
    }),
    projects: z.array(workProjectSchema).min(1, 'At least one project is required'),
  })
  .superRefine((data, ctx) => {
    const validFilterIds = new Set(data.header.filters.map((f) => f.id));
    // Check project tags
    data.projects.forEach((proj, projIndex) => {
      proj.tags.forEach((tag, tagIndex) => {
        if (!validFilterIds.has(tag) && tag !== 'all') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `"${tag}" is not a valid filter id. Valid ids: ${Array.from(validFilterIds).join(', ')}`,
            path: ['projects', projIndex, 'tags', tagIndex],
          });
        }
      });
    });

    // Check duplicate slugs
    const ids = new Set<string>();
    data.projects.forEach((proj, projIndex) => {
      if (ids.has(proj.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate project id "${proj.id}" found. Slugs must be unique.`,
          path: ['projects', projIndex, 'id'],
        });
      }
      ids.add(proj.id);
    });
  });

export type WorkContent = z.infer<typeof workSchema>;
export type WorkProject = z.infer<typeof workProjectSchema>;
export type WorkFilter = z.infer<typeof workFilterSchema>;

