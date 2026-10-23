import { z } from 'zod';

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['text', 'email', 'tel', 'select', 'textarea']),
  label: z.string().min(1),
  placeholder: z.string().optional().default(''),
  required: z.boolean().default(false),
  row: z.string().optional(),
  optionsFrom: z.string().optional(),
});

export const siteSchema = z.object({
  brand: z.object({
    name: z.string().min(1, 'Brand name is required'),
    legalName: z.string().min(1, 'Brand legal name is required'),
    shortName: z.string().min(1, 'Brand short name is required'),
    url: z.string().url('Brand URL must be a valid URL'),
    email: z.string().email('Brand email must be a valid email'),
    phone: z.string().min(1, 'Brand phone is required'),
    tagline: z.string().min(1, 'Brand tagline is required'),
    description: z.string().min(1, 'Brand description is required'),
    giantWordmark: z.string().min(1, 'Giant wordmark is required'),
    copyright: z.string().min(1, 'Copyright is required'),
    instagramHandle: z.string().optional(),
  }),
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
    ogImage: z.string().min(1, 'ogImage path is required'),
    keywords: z.array(z.string()).default([]),
  }),
  logos: z
    .object({
      navbarLogo: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i, 'Must be a path like "/brand/kraqen-mark.png"'),
      whiteLogo: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i)
        .optional(),
      darkLogo: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i)
        .optional(),
      mark: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i)
        .optional(),
      favicon: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i)
        .optional(),
      alt: z.string().default('Kraqen Innovations LLP'),
    })
    .transform((l) => ({
      ...l,
      whiteLogo: l.whiteLogo ?? l.navbarLogo,
      darkLogo: l.darkLogo ?? l.navbarLogo,
      mark: l.mark ?? l.navbarLogo,
      favicon: l.favicon ?? l.navbarLogo,
    })),
  navigation: z.object({
    links: z.array(
      z.object({
        label: z.string().min(1, 'Nav link label required'),
        href: z.string().min(1, 'Nav link href required'),
      })
    ),
    cta: z.object({
      label: z.string().min(1, 'Nav CTA label required'),
      href: z.string().min(1, 'Nav CTA href required'),
    }),
    mobileMenuLabel: z.string().default('MENU'),
    mobileCloseLabel: z.string().default('CLOSE'),
  }),
  socials: z.array(
    z.object({
      label: z.string().min(1, 'Social link label required'),
      href: z.string().min(1, 'Social link href required'),
    })
  ),
  footer: z.object({
    ctaLines: z.array(z.string().min(1)).min(1, 'Footer CTA lines required'),
    ctaHref: z.string().min(1, 'Footer CTA href required'),
    columnA: z.array(
      z.object({
        label: z.string().min(1, 'Footer link label required'),
        href: z.string().min(1, 'Footer link href required'),
      })
    ),
    columnBUseSocials: z.boolean().default(true),
    formTitle: z.string().min(1, 'Form title required'),
    formSubtitle: z.string().min(1, 'Form subtitle required'),
    hideFormOnPaths: z.array(z.string()).default([]),
    copyright: z.string().min(1, 'Copyright is required'),
    legal: z.array(
      z.object({
        label: z.string().min(1, 'Legal link label required'),
        href: z.string().min(1, 'Legal link href required'),
      })
    ),
  }),
  serviceOptions: z.array(z.string().min(1)).min(1, 'At least one service option required'),
  forms: z.object({
    fieldSets: z.record(z.string(), z.array(formFieldSchema)),
    labels: z.object({
      required: z.string().default('(REQUIRED)'),
      optional: z.string().default('(OPTIONAL)'),
    }),
    submit: z.object({
      footer: z.string().default("LET'S TALK"),
      about: z.string().default('SEND ENQUIRY'),
      contact: z.string().default("LET'S TALK GROWTH!"),
      sending: z.string().default('SENDING...'),
    }),
    validation: z.object({
      required: z.string().default('This field is required'),
      email: z.string().default('Please enter a valid email'),
      phone: z.string().default('Please enter a valid phone number'),
    }),
    success: z.object({
      title: z.string().default('THANK YOU.'),
      text: z.string().default('We got your enquiry and will reply within 1 to 2 business days.'),
    }),
    error: z.string().default('Something went wrong. Please try again or email us directly.'),
  }),
  office: z.object({
    label: z.string().default('OUR CHENNAI OFFICE'),
    addressLines: z.array(z.string()).default([]),
    mapUrl: z.string().default(''),
    whatsapp: z.object({
      label: z.string().default('WHATSAPP'),
      number: z.string().min(1),
      message: z.string().default(''),
    }),
    email: z.object({
      label: z.string().default('EMAIL'),
      address: z.string().email(),
    }),
  }),
  notFound: z.object({
    title: z.string().min(1, '404 title is required'),
    message: z.string().min(1, '404 message is required'),
    buttonLabel: z.string().min(1, '404 button label is required'),
    buttonHref: z.string().min(1, '404 button href is required'),
  }),
  errors: z.object({
    generic: z.string().min(1, 'Generic error message required'),
    network: z.string().min(1, 'Network error message required'),
    formRequired: z.string().min(1, 'Required error message required'),
    formInvalidEmail: z.string().min(1, 'Invalid email error message required'),
    formServerError: z.string().min(1, 'Server error message required'),
  }),
});

export type SiteContent = z.infer<typeof siteSchema>;
export type FormFieldConfig = z.infer<typeof formFieldSchema>;
