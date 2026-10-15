import { z } from 'zod';

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
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i, 'Must be a path like "/brand/kraqen-logo.png"'),
      whiteLogo: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i, 'Must be a path like "/brand/kraqen-logo.png"')
        .optional(),
      darkLogo: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i, 'Must be a path like "/brand/kraqen-logo.png"')
        .optional(),
      mark: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i, 'Must be a path like "/brand/kraqen-logo.png"')
        .optional(),
      favicon: z
        .string()
        .min(1)
        .regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i, 'Must be a path like "/brand/kraqen-logo.png"')
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
  marquee: z.object({
    pill: z.string().min(1, 'Marquee pill text is required'),
    category: z.string().min(1, 'Marquee category is required'),
    p1: z.string().min(1, 'Marquee paragraph 1 is required'),
    p2: z.string().min(1, 'Marquee paragraph 2 is required'),
  }),
  footer: z.object({
    cta: z.object({
      line1: z.string().min(1, 'Footer CTA line 1 required'),
      line2: z.string().min(1, 'Footer CTA line 2 required'),
      href: z.string().min(1, 'Footer CTA href required'),
    }),
    navColumns: z.array(
      z.array(
        z.object({
          label: z.string().min(1, 'Footer nav label required'),
          href: z.string().min(1, 'Footer nav href required'),
        })
      )
    ),
  }),
  reelWidget: z.object({
    title: z.string().min(1, 'Reel widget title is required'),
    label: z.string().min(1, 'Reel widget label is required'),
    videoSrc: z.string().min(1, 'Reel videoSrc is required'),
    previewSrc: z.string().min(1, 'Reel previewSrc is required'),
    posterSrc: z.string().min(1, 'Reel posterSrc is required'),
    enabled: z.boolean().default(true),
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
  install: z
    .object({
      enabled: z.boolean().default(true),
      label: z.string().default('GET THE APP'),
      title: z.string().default('INSTALL KRAQEN'),
      text: z.string().default('Add Kraqen to your phone for faster access. Works with the latest content, every time.'),
      appIcon: z.string().default('/brand/kraqen-mark.png'),
      closeLabel: z.string().default('CLOSE'),
      installedLabel: z.string().default('ALREADY INSTALLED'),
      android: z.object({
        label: z.string().default('ANDROID'),
        subLabel: z.string().default('DOWNLOAD APK'),
        apkUrl: z.string().default('/downloads/kraqen.apk'),
        version: z.string().default('1.0.0'),
        playStoreUrl: z.string().default(''),
        helpTitle: z.string().default('INSTALL ON ANDROID'),
        helpSteps: z.array(z.string()).min(1, 'needs at least 1 step'),
      }),
      ios: z.object({
        label: z.string().default('iOS'),
        subLabel: z.string().default('INSTALL ON IPHONE'),
        appStoreUrl: z.string().default(''),
        helpTitle: z.string().default('INSTALL ON IPHONE OR IPAD'),
        helpSteps: z.array(z.string()).min(1, 'needs at least 1 step'),
        inAppBrowserNote: z.string().default('Open this page in Safari to install the app.'),
        copyLinkLabel: z.string().default('COPY LINK'),
      }),
      qr: z.object({
        enabled: z.boolean().default(true),
        caption: z.string().default('SCAN TO INSTALL ON YOUR PHONE'),
        url: z.string().default('https://www.kraqeninc.com/install'),
      }),
    })
    .optional(),
});

export type SiteContent = z.infer<typeof siteSchema>;

