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

export const bookingAvailabilitySchema = z.object({
  days: z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5, 6]),
  start: z.string().default('10:00'),
  end: z.string().default('18:00'),
  slotMinutes: z.number().default(30),
  breaks: z.array(z.object({ start: z.string(), end: z.string() })).default([{ start: '13:00', end: '14:00' }]),
  minNoticeHours: z.number().default(12),
  maxDaysAhead: z.number().default(60),
});

export const bookingLabelsSchema = z.object({
  back: z.string().default('BACK'),
  next: z.string().default('NEXT'),
  noSlots: z.string().default('No times available on this day.'),
  enterDetails: z.string().default('Enter Details'),
  schedule: z.string().default('SCHEDULE EVENT'),
  confirmedTitle: z.string().default('YOU ARE SCHEDULED'),
  confirmedText: z.string().default('A confirmation was sent to your email. Web conferencing details will follow after confirmation.'),
  name: z.string().default('NAME'),
  email: z.string().default('EMAIL'),
  phone: z.string().default('CONTACT NUMBER'),
  notes: z.string().default('ANYTHING ELSE WE SHOULD KNOW?'),
  error: z.string().default('We could not book this time. Please pick another slot or email us.'),
});

export const bookingSchema = z.object({
  provider: z.enum(['calendly', 'builtin']).default('builtin'),
  calendlyUrl: z.string().optional().default(''),
  host: z.string().default('Kraqen Innovations'),
  title: z.string().default('30 Minute Meeting'),
  durationMinutes: z.number().default(30),
  durationLabel: z.string().default('30 min'),
  conferencingNote: z.string().default('Web conferencing details provided upon confirmation.'),
  selectLabel: z.string().default('Select a Date & Time'),
  timezoneLabel: z.string().default('Time zone'),
  businessTimezone: z.string().default('Asia/Kolkata'),
  availability: bookingAvailabilitySchema.default({
    days: [1, 2, 3, 4, 5, 6],
    start: '10:00',
    end: '18:00',
    slotMinutes: 30,
    breaks: [{ start: '13:00', end: '14:00' }],
    minNoticeHours: 12,
    maxDaysAhead: 60,
  }),
  labels: bookingLabelsSchema.default({
    back: 'BACK',
    next: 'NEXT',
    noSlots: 'No times available on this day.',
    enterDetails: 'Enter Details',
    schedule: 'SCHEDULE EVENT',
    confirmedTitle: 'YOU ARE SCHEDULED',
    confirmedText: 'A confirmation was sent to your email. Web conferencing details will follow after confirmation.',
    name: 'NAME',
    email: 'EMAIL',
    phone: 'CONTACT NUMBER',
    notes: 'ANYTHING ELSE WE SHOULD KNOW?',
    error: 'We could not book this time. Please pick another slot or email us.',
  }),
});

export type BookingContent = z.infer<typeof bookingSchema>;

export const siteSchema = z.object({
  brand: z.object({
    name: z.string().min(1, 'Brand name is required'),
    displayName: z.string().default('Kraqen Innovations'),
    legalName: z.string().default('Kraqen Innovations LLP'),
    shortName: z.string().default('Kraqen Innovations'),
    url: z.string().url('Brand URL must be a valid URL'),
    email: z.string().email('Brand email must be a valid email'),
    phone: z.string().min(1, 'Brand phone is required'),
    tagline: z.string().min(1, 'Brand tagline is required'),
    description: z.string().min(1, 'Brand description is required'),
    giantWordmark: z.string().min(1, 'Giant wordmark is required'),
    giantWordmarkLines: z.array(z.string()).default(['kraqen', 'innovations']),
    copyright: z.string().min(1, 'Copyright is required'),
    instagramHandle: z.string().optional(),
  }),
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
    ogImage: z.string().min(1, 'ogImage path is required'),
    keywords: z.union([
      z.array(z.string()),
      z.object({
        primary: z.array(z.string()).default([]),
        secondary: z.array(z.string()).default([]),
      }),
    ]).default([]),
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
    cta: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
    mobileMenuLabel: z.string().default('MENU'),
    mobileCloseLabel: z.string().default('CLOSE'),
  }),
  effects: z
    .object({
      splashCursor: z
        .object({
          enabled: z.boolean().default(true),
          colors: z.array(z.string()).default(['#5B3CDB', '#3D5AFE', '#22C55E']),
          clickSplash: z.boolean().default(true),
          trailOnMove: z.boolean().default(true),
          desktopQuality: z.enum(['low', 'medium', 'high']).default('medium'),
          touchQuality: z.enum(['low', 'medium', 'high']).default('low'),
          intensity: z.number().default(0.5),
          size: z.number().default(0.7),
          force: z.number().default(0.6),
          swirl: z.number().default(2),
          trail: z.number().default(0.7),
          momentum: z.number().default(0.8),
          shading: z.number().default(0.6),
        })
        .default({
          enabled: true,
          colors: ['#5B3CDB', '#3D5AFE', '#22C55E'],
          clickSplash: true,
          trailOnMove: true,
          desktopQuality: 'medium',
          touchQuality: 'low',
          intensity: 0.5,
          size: 0.7,
          force: 0.6,
          swirl: 2,
          trail: 0.7,
          momentum: 0.8,
          shading: 0.6,
        }),
      specularButtons: z
        .object({
          enabled: z.boolean().default(true),
          maxLiveDesktop: z.number().int().min(1).default(8),
          maxLiveTouch: z.number().int().min(1).default(3),
        })
        .default({
          enabled: true,
          maxLiveDesktop: 8,
          maxLiveTouch: 3,
        }),
      folders: z
        .object({
          enabled: z.boolean().default(true),
          draggable: z.boolean().default(false),
          layout: z.enum(['stack', 'spread', 'row']).default('stack'),
        })
        .default({
          enabled: true,
          draggable: false,
          layout: 'stack',
        }),
      clientCarousel: z
        .object({
          enabled: z.boolean().default(true),
          preset: z.string().default('arch'),
          cardHeight: z.number().default(0.5),
          gap: z.number().default(12),
          radius: z.number().default(16),
          squeeze: z.number().default(0.1),
          autoplay: z.boolean().default(false),
        })
        .default({
          enabled: true,
          preset: 'arch',
          cardHeight: 0.5,
          gap: 12,
          radius: 16,
          squeeze: 0.1,
          autoplay: false,
        }),
    })
    .default({
      splashCursor: {
        enabled: true,
        colors: ['#5B3CDB', '#3D5AFE', '#22C55E'],
        clickSplash: true,
        trailOnMove: true,
        desktopQuality: 'medium',
        touchQuality: 'low',
        intensity: 0.5,
        size: 0.7,
        force: 0.6,
        swirl: 2,
        trail: 0.7,
        momentum: 0.8,
        shading: 0.6,
      },
      specularButtons: {
        enabled: true,
        maxLiveDesktop: 8,
        maxLiveTouch: 3,
      },
      folders: {
        enabled: true,
        draggable: false,
        layout: 'stack',
      },
      clientCarousel: {
        enabled: true,
        preset: 'arch',
        cardHeight: 0.5,
        gap: 12,
        radius: 16,
        squeeze: 0.1,
        autoplay: false,
      },
    }),
  socials: z.array(
    z.object({
      label: z.string().min(1, 'Social link label required'),
      url: z.string().optional(),
      href: z.string().optional(),
    })
  ).transform((items) =>
    items.map((s) => ({
      label: s.label,
      url: s.url || s.href || '',
      href: s.href || s.url || '',
    }))
  ),
  calendly: z.object({
    url: z.string().default(''),
    meetingLabel: z.string().default('30 MINUTE MEETING'),
    locationNote: z.string().default('Meeting link (Google Meet) is sent after confirmation.'),
  }).default({
    url: '',
    meetingLabel: '30 MINUTE MEETING',
    locationNote: 'Meeting link (Google Meet) is sent after confirmation.',
  }),
  booking: bookingSchema.optional(),
  footer: z.object({
    ctaLines: z.array(z.string().min(1)).min(1, 'Footer CTA lines required'),
    ctaHref: z.string().min(1, 'Footer CTA href required'),
    formTitle: z.string().default('START A PROJECT'),
    formSubtitle: z.string().optional(),
    bookingTitle: z.string().default('BOOK A CALL'),
    rightColumn: z.record(z.string(), z.string()).default({
      default: 'form',
      '/about': 'booking',
      '/contact': 'none',
    }),
    columnA: z.array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    ).optional(),
    columnBUseSocials: z.boolean().default(true),
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
    label: z.string().default('OUR OFFICE'),
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
    phone: z.string().default('+91 8939651621'),
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
