import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Team member name is required'),
  role: z.string().min(1, 'Team member role is required'),
  bio: z.string().min(1, 'Team member bio is required'),
  image: z.string().min(1, 'Team member image is required'),
  alt: z.string().min(1, 'Team member alt text is required'),
  linkedin: z.string().optional().default(''),
});

export const blueprintStepSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  image: z.string().min(1),
  alt: z.string().min(1),
});

export const onSetItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const aboutSchema = z.object({
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
    title: z.string().min(1, 'Hero title is required'),
    subtitle: z.string().min(1, 'Hero subtitle is required'),
  }),
  intro: z.object({
    title: z.string().min(1, 'Intro title is required'),
    paragraph: z.string().min(1, 'Intro paragraph is required'),
  }),
  team: z.object({
    title: z.string().default('THE MINDS BEHIND THE LENS'),
    subtitle: z.string().default('Directed by technical precision, driven by creative strategy'),
    members: z.array(teamMemberSchema).min(1, 'At least one team member is required'),
  }),
  blueprint: z.object({
    title: z.string().default('THE BLUEPRINT TO EXECUTION'),
    subtitle: z.string().default('A production pipeline built for scale, speed, and cinematic quality.'),
    steps: z.array(blueprintStepSchema).min(1, 'At least one step required'),
  }),
  onSet: z.object({
    title: z.string().default('ON SET & IN THE SUITE'),
    subtitle: z.string().default('Where raw footage meets visual finishing.'),
    layout: z.object({
      aspect: z.string().default('4/3'),
      columns: z.number().default(3),
    }).optional(),
    items: z.array(onSetItemSchema).min(1, 'At least one on-set item required'),
  }),
  cta: z.object({
    title: z.string().default("LET'S BUILD SOMETHING CULT."),
    subtitle: z.string().default('Ready to dominate your niche? Drop your project details below.'),
  }),
  legacy: z.object({
    whatWeDo: z.boolean().default(false),
    studioSplit: z.boolean().default(false),
    approachClients: z.boolean().default(false),
  }).default({
    whatWeDo: false,
    studioSplit: false,
    approachClients: false,
  }),
  services: z.any().optional(),
  studioSplit: z.any().optional(),
  approach: z.any().optional(),
});

export type AboutContent = z.infer<typeof aboutSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type BlueprintStep = z.infer<typeof blueprintStepSchema>;
export type OnSetItem = z.infer<typeof onSetItemSchema>;
