import { z } from 'zod';

export const teamMemberSchema = z.object({
  id: z.string().min(1, 'Team member id is required'),
  name: z.string().min(1, 'Team member name is required'),
  role: z.string().min(1, 'Team member role is required'),
  bio: z.string().min(1, 'Team member bio is required'),
  image: z.string().min(1, 'Team member image is required'),
  alt: z.string().min(1, 'Team member alt text is required'),
  isGreyscaleDefault: z.boolean().default(false),
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
  shape: z.enum(['wide', 'tall', 'square']),
});

export const aboutSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
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
  services: z.object({
    labelLeft: z.string().optional().default('WHAT WE DO'),
    labelRight: z.string().optional().default('FULL SERVICE PRODUCTION'),
    useHomeServices: z.boolean().default(true),
    items: z.array(
      z.object({
        number: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
      })
    ).default([]),
  }).optional(),
  studioSplit: z.object({
    left: z.object({
      src: z.string().min(1),
      alt: z.string().min(1),
      widthRatio: z.string().default('66%'),
    }),
    right: z.object({
      src: z.string().min(1),
      alt: z.string().min(1),
      widthRatio: z.string().default('34%'),
    }),
  }).optional(),
  approach: z.object({
    labelLeft: z.string().optional().default('APPROACH'),
    labelRight: z.string().optional().default('SELECTED PARTNERS'),
    headlineLines: z.array(z.string()).default([]),
    useHomePartners: z.boolean().default(true),
    fillEmptyCells: z.boolean().default(true),
    clients: z.array(z.any()).default([]),
  }).optional(),
});

export type AboutContent = z.infer<typeof aboutSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type BlueprintStep = z.infer<typeof blueprintStepSchema>;
export type OnSetItem = z.infer<typeof onSetItemSchema>;
