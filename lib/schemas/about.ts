import { z } from 'zod';
import { homeClientSchema } from './home';

export const teamMemberSchema = z.object({
  id: z.string().min(1, 'Team member id is required'),
  name: z.string().min(1, 'Team member name is required'),
  role: z.string().min(1, 'Team member role is required'),
  bio: z.string().min(1, 'Team member bio is required'),
  image: z.string().min(1, 'Team member image is required'),
  alt: z.string().min(1, 'Team member alt text is required'),
  isGreyscaleDefault: z.boolean().default(false),
});

export const aboutSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
  }),
  intro: z.object({
    title: z.string().min(1, 'Intro title is required'),
    paragraph: z.string().min(1, 'Intro paragraph is required'),
  }),
  team: z.object({
    heading: z.string().default('THE TEAM'),
    members: z.array(teamMemberSchema).min(1, 'At least one team member is required'),
  }),
  services: z.object({
    labelLeft: z.string().min(1, 'Services left label required'),
    labelRight: z.string().min(1, 'Services right label required'),
    useHomeServices: z.boolean().default(true),
    items: z.array(
      z.object({
        number: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
      })
    ).default([]),
  }),
  studioSplit: z.object({
    left: z.object({
      src: z.string().min(1, 'Left studio image src is required'),
      alt: z.string().min(1, 'Left studio image alt is required'),
      widthRatio: z.string().default('66%'),
    }),
    right: z.object({
      src: z.string().min(1, 'Right studio image src is required'),
      alt: z.string().min(1, 'Right studio image alt is required'),
      widthRatio: z.string().default('34%'),
    }),
  }),
  approach: z.object({
    labelLeft: z.string().min(1, 'Approach left label required'),
    labelRight: z.string().min(1, 'Approach right label required'),
    headlineLines: z.array(z.string().min(1)).min(1, 'Approach headline lines required'),
    useHomePartners: z.boolean().default(true),
    fillEmptyCells: z.boolean().default(true),
    clients: z.array(homeClientSchema).default([]),
  }),
});

export type AboutContent = z.infer<typeof aboutSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;

