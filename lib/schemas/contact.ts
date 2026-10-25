import { z } from 'zod';

export const contactSchema = z.object({
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
    label: z.string().default('CONTACT'),
    titleLines: z.array(z.string().min(1)).min(1, 'Title lines required'),
    paragraph: z.string().min(1, 'Header paragraph is required'),
  }),
  formCard: z.object({
    title: z.string().default('SEND A MESSAGE'),
    fieldSet: z.string().default('contact'),
    submit: z.string().default("LET'S TALK GROWTH!"),
    followLabel: z.string().default('FOLLOW US'),
    followText: z.string().default('Prefer to talk on social? Say hi and we will reply fast.'),
    showSocials: z.boolean().default(true),
  }),
});

export type ContactContent = z.infer<typeof contactSchema>;
