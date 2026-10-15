import { z } from 'zod';

export const homeClientSchema = z.object({
  id: z.string().min(1, 'Client id is required'),
  name: z.string().min(1, 'Client name is required'),
  logo: z.string().min(1, 'Client logo path is required. Expected a string like "/logos/name.svg"'),
  hoverImage: z.string().min(1, 'Client hover image path is required. Expected a string like "/images/hover.jpg"'),
  scale: z.number().min(0.5).max(2.0).optional().default(1),
});

export const projectSchema = z
  .object({
    id: z.string().optional(),
    number: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    services: z.string().optional(),
    category: z.string().optional(),
    year: z.string().min(1, 'Project year required'),
    mediaType: z.enum(['reel', 'post', 'image']).default('image'),
    instagramUrl: z
      .string()
      .regex(
        /^https:\/\/(www\.)?instagram\.com\/(reel|reels|p|tv)\/[A-Za-z0-9_-]+\/?.*$/,
        'must look like https://www.instagram.com/reel/XXXX/ or https://www.instagram.com/p/XXXX/'
      )
      .optional()
      .or(z.literal('')),
    image: z.string().min(1, 'Project image required'),
    video: z.string().optional().default(''),
    alt: z.string().optional(),
    fit: z.enum(['cover', 'inset', 'full-bleed']).optional(),
    imageStyle: z.enum(['full-bleed', 'inset', 'cover']).optional(),
  })
  .transform((p) => {
    const id = p.id || p.number || '01';
    const number = p.number || p.id || '01';
    const title = p.title || p.name || 'PROJECT';
    const name = p.name || p.title || 'PROJECT';
    const category = p.category || p.services || 'WORK';
    const services = p.services || p.category || 'WORK';
    const fit = p.fit || (p.imageStyle === 'inset' ? 'inset' : 'cover');
    const imageStyle = p.imageStyle || (p.fit === 'inset' ? 'inset' : 'full-bleed');
    const alt = p.alt || title;
    return {
      ...p,
      id,
      number,
      title,
      name,
      category,
      services,
      fit,
      imageStyle,
      alt,
    };
  })
  .refine(
    (p) => {
      if (p.mediaType === 'reel' || p.mediaType === 'post') {
        const hasUrl = typeof p.instagramUrl === 'string' && p.instagramUrl.length > 0;
        const hasVid = typeof p.video === 'string' && p.video.length > 0;
        return hasUrl || hasVid;
      }
      return true;
    },
    {
      message: 'if mediaType is reel or post then instagramUrl or video is required',
      path: ['instagramUrl'],
    }
  );

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
        position: z.enum(['top-center', 'left', 'left-center', 'right']),
      })
    ).min(1, 'At least one hero image required'),
  }),
  selectedWork: z
    .object({
      label: z.string().optional(),
      labelLeft: z.string().optional().default('PORTFOLIO'),
      labelRight: z.string().optional().default('SELECTED WORK'),
      headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
      sideText: z.string().optional(),
      paragraph: z.string().optional(),
      hoverLabel: z.string().default('VIEW'),
      source: z.enum(['manual', 'instagram-api']).default('manual'),
      limit: z.number().optional().default(12),
      instagram: z
        .object({
          handle: z.string().min(1),
          profileUrl: z.string().url(),
          openLabel: z.string().default('OPEN ON INSTAGRAM'),
          followLabel: z.string().default('FOLLOW @KRAQEN.INNOVATIONS'),
          embedFailedText: z
            .string()
            .default('This post could not be loaded here. Open it on Instagram.'),
        })
        .optional(),
      viewer: z
        .object({
          closeLabel: z.string().default('CLOSE'),
          prevLabel: z.string().default('PREVIOUS'),
          nextLabel: z.string().default('NEXT'),
          hint: z.string().default('SWIPE UP OR DOWN FOR MORE'),
          reelBadge: z.string().default('REEL'),
          postBadge: z.string().default('POST'),
        })
        .optional()
        .default({
          closeLabel: 'CLOSE',
          prevLabel: 'PREVIOUS',
          nextLabel: 'NEXT',
          hint: 'SWIPE UP OR DOWN FOR MORE',
          reelBadge: 'REEL',
          postBadge: 'POST',
        }),
      projects: z.array(projectSchema).min(1, 'At least one project required'),
    })
    .transform((sw) => ({
      ...sw,
      label: sw.label || sw.labelRight || 'SELECTED WORK',
      labelLeft: sw.labelLeft || 'PORTFOLIO',
      labelRight: sw.labelRight || sw.label || 'SELECTED WORK',
      sideText: sw.sideText || sw.paragraph || '',
      paragraph: sw.paragraph || sw.sideText || '',
    })),
  services: z.object({
    labelLeft: z.string().min(1, 'Services left label required'),
    labelRight: z.string().min(1, 'Services right label required'),
    items: z.array(
      z.object({
        number: z.string().min(1, 'Service number required'),
        name: z.string().min(1, 'Service name required'),
        description: z.string().min(1, 'Service description required'),
      })
    ).min(1, 'At least one service required'),
  }),
  partners: z.object({
    labelLeft: z.string().min(1, 'Partners left label required'),
    labelRight: z.string().min(1, 'Partners right label required'),
    headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
    fillEmptyCells: z.boolean().default(true),
    clients: z.array(homeClientSchema).min(1, 'At least one partner client required'),
  }),
});

export type HomeContent = z.infer<typeof homeSchema>;
export type HomeProject = z.infer<typeof projectSchema>;
export type HomeClient = z.infer<typeof homeClientSchema>;
