import { z } from 'zod';

export const contactFieldSchema = z.object({
  enabled: z.boolean().default(true),
  required: z.boolean().default(true),
  label: z.string().min(1, 'Field label is required'),
  placeholder: z.string().optional(),
  helper: z.string().optional(),
});

export const contactSelectFieldSchema = z.object({
  enabled: z.boolean().default(true),
  required: z.boolean().default(true),
  label: z.string().min(1, 'Field label is required'),
  placeholder: z.string().optional(),
  helper: z.string().optional(),
  options: z.array(
    z.object({
      value: z.string().min(1),
      label: z.string().min(1),
    })
  ).min(1, 'Select field requires at least one option'),
});

export const contactProjectTypesFieldSchema = z.object({
  enabled: z.boolean().default(true),
  required: z.boolean().default(true),
  label: z.string().min(1, 'Field label is required'),
  helper: z.string().optional(),
  options: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
    })
  ).min(1, 'ProjectTypes field requires at least one option'),
});

export const contactSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
  }),
  hero: z.object({
    label: z.string().min(1, 'Hero label is required'),
    headlineLines: z.array(z.string().min(1)).min(1, 'Headline lines required'),
    paragraph: z.string().min(1, 'Hero paragraph is required'),
  }),
  fields: z.object({
    name: contactFieldSchema,
    email: contactFieldSchema,
    phone: contactFieldSchema.default({
      enabled: false,
      required: false,
      label: 'PHONE',
      placeholder: '',
    }),
    company: contactFieldSchema,
    projectTypes: contactProjectTypesFieldSchema,
    budget: contactSelectFieldSchema,
    timing: contactSelectFieldSchema,
    message: contactFieldSchema,
  }),
  validation: z.object({
    nameRequired: z.string().min(1),
    emailRequired: z.string().min(1),
    emailInvalid: z.string().min(1),
    projectTypeRequired: z.string().min(1),
    budgetRequired: z.string().min(1),
    timingRequired: z.string().min(1),
    messageRequired: z.string().min(1),
    messageMinLength: z.string().min(1),
  }),
  submit: z.object({
    label: z.string().min(1, 'Submit button label is required'),
    sending: z.string().min(1, 'Submitting label is required'),
  }),
  privacyNote: z.string().default(''),
  success: z.object({
    heading: z.string().min(1, 'Success heading is required'),
    message: z.string().min(1, 'Success message is required'),
    resetButton: z.string().min(1, 'Reset button label is required'),
  }),
  error: z.object({
    text: z.string().min(1, 'Error text is required'),
    showEmail: z.boolean().default(true),
  }),
});

export type ContactContent = z.infer<typeof contactSchema>;

