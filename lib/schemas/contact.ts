import { z } from 'zod';

export const contactSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
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
  }),
  booking: z.object({
    enabled: z.boolean().default(true),
    title: z.string().default('BOOK A CALL'),
    text: z.string().default('Pick a time that suits you.'),
    calendlyUrl: z.string().default(''),
    height: z.object({
      desktop: z.number().default(700),
      mobile: z.number().default(760),
    }).default({ desktop: 700, mobile: 760 }),
    fallbackText: z.string().default('The calendar could not be loaded.'),
    openLabel: z.string().default('OPEN CALENDAR'),
  }),
});

export type ContactContent = z.infer<typeof contactSchema>;
