import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const publicDir = path.join(rootDir, 'public');

let totalErrors = 0;
const report = [];

// Check conflicting public files and route files in app/
const conflictingPairs = [
  { app: 'app/icon.png', pub: 'public/icon.png', route: '/icon.png' },
  { app: 'app/apple-icon.png', pub: 'public/apple-icon.png', route: '/apple-icon.png' },
  { app: 'app/favicon.ico', pub: 'public/favicon.ico', route: '/favicon.ico' },
];

for (const pair of conflictingPairs) {
  const appPath = path.join(rootDir, pair.app);
  const pubPath = path.join(rootDir, pair.pub);
  if (fs.existsSync(appPath) && fs.existsSync(pubPath)) {
    console.error(`\x1b[31mCONFLICT: ${pair.pub} and ${pair.app} both serve ${pair.route}. Delete the file in /public.\x1b[0m`);
    report.push({
      file: pair.pub,
      path: pair.route,
      message: `CONFLICT: ${pair.pub} and ${pair.app} both serve ${pair.route}. Delete the file in /public.`,
    });
    totalErrors++;
  }
}

function checkAssetExists(assetPath, contextStr) {
  if (!assetPath || typeof assetPath !== 'string') return;
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return;

  const normalized = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const fullPath = path.join(publicDir, normalized);

  if (!fs.existsSync(fullPath)) {
    report.push({
      file: contextStr.file,
      path: contextStr.path,
      message: `file "${assetPath}" not found in /public.`,
    });
    totalErrors++;
  }
}

function scanForAssets(obj, file, currentPath = '') {
  if (!obj || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      scanForAssets(item, file, `${currentPath}[${idx}]`);
    });
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    const keyPath = currentPath ? `${currentPath}.${key}` : key;
    if (typeof value === 'string') {
      if (
        key === 'image' ||
        key === 'logo' ||
        key === 'src' ||
        key === 'poster' ||
        key === 'ogImage' ||
        key === 'navbarLogo' ||
        key === 'mark' ||
        key === 'whiteLogo' ||
        key === 'darkLogo'
      ) {
        if (value.trim().length > 0) {
          checkAssetExists(value, { file: `content/${file}.json`, path: keyPath });
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      scanForAssets(value, file, keyPath);
    }
  }
}

// Schemas for validation
const formFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['text', 'email', 'tel', 'select', 'textarea']),
  label: z.string().min(1),
  placeholder: z.string().optional().default(''),
  required: z.boolean().default(false),
  row: z.string().optional(),
  optionsFrom: z.string().optional(),
});

const siteSchema = z.object({
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
      whiteLogo: z.string().min(1).regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i).optional(),
      darkLogo: z.string().min(1).regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i).optional(),
      mark: z.string().min(1).regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i).optional(),
      favicon: z.string().min(1).regex(/^\/.+\.(png|svg|webp|jpe?g|ico)$/i).optional(),
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

const homePartnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().min(1),
});

const homeServiceItemSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1).default('/work'),
});

const homeSchema = z.object({
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
        position: z.string().optional().default('top-center'),
      })
    ).min(1, 'At least one hero image required'),
  }),
  selectedWork: z.object({
    label: z.string().default('SELECTED WORK'),
    headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
    sideText: z.string().default(''),
    featuredSlugs: z.array(z.string().min(1)).min(1, 'At least one featured slug required'),
    labels: z.object({
      client: z.string().default('CLIENT / INDUSTRY'),
      deliverable: z.string().default('DELIVERABLE'),
      result: z.string().default('RESULT / IMPACT'),
    }),
    viewLabel: z.string().default('VIEW PROJECT'),
  }),
  services: z.object({
    labelLeft: z.string().default('WHAT WE DO'),
    labelRight: z.string().default('FULL SERVICE PRODUCTION'),
    items: z.array(homeServiceItemSchema).min(1, 'At least one service required'),
  }),
  partners: z.object({
    labelLeft: z.string().default('OUR CLIENTS'),
    labelRight: z.string().default('SELECTED PARTNERS'),
    headingLines: z.array(z.string().min(1)).min(1, 'Heading lines required'),
    runner: z.object({
      enabled: z.boolean().default(true),
      direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
      speedSeconds: z.number().min(5).max(120).default(40),
      pauseOnHover: z.boolean().default(true),
    }).default({
      enabled: true,
      direction: 'horizontal',
      speedSeconds: 40,
      pauseOnHover: true,
    }),
    items: z.array(homePartnerSchema).min(1, 'At least one partner item required'),
  }),
});

const teamMemberSchema = z.object({
  id: z.string().min(1, 'Team member id is required'),
  name: z.string().min(1, 'Team member name is required'),
  role: z.string().min(1, 'Team member role is required'),
  bio: z.string().min(1, 'Team member bio is required'),
  image: z.string().min(1, 'Team member image is required'),
  alt: z.string().min(1, 'Team member alt text is required'),
  isGreyscaleDefault: z.boolean().default(false),
});

const blueprintStepSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  image: z.string().min(1),
  alt: z.string().min(1),
});

const onSetItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  shape: z.enum(['wide', 'tall', 'square']),
});

const aboutSchema = z.object({
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
  services: z.any().optional(),
  studioSplit: z.any().optional(),
  approach: z.any().optional(),
});

const workFilterSchema = z.object({
  id: z.string().min(1, 'Filter id is required'),
  label: z.string().min(1, 'Filter label is required'),
});

const workCategorySchema = z.object({
  id: z.string().min(1, 'Category id is required'),
  title: z.string().min(1, 'Category title is required'),
});

const workItemSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  mediaType: z.enum(['image', 'video', 'reel']).default('image'),
  ratio: z.enum(['4:5', '16:9', '9:16']).default('4:5'),
  src: z.string().min(1, 'Src image is required'),
  poster: z.string().optional().default(''),
  video: z.string().optional().default(''),
  instagramUrl: z.string().optional().default(''),
  alt: z.string().default(''),
  year: z.union([z.number(), z.string()]).default(2026),
  featured: z.boolean().optional().default(false),
  clientIndustry: z.string().default(''),
  deliverable: z.string().default(''),
  result: z.string().default(''),
  detail: z.object({
    intro: z.string().default(''),
    brief: z.string().default(''),
    process: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    gear: z.array(z.string()).default([]),
    location: z.string().default(''),
    credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
    gallery: z.array(z.object({ src: z.string(), alt: z.string(), ratio: z.string() })).default([]),
  }),
});

const workSchema = z.object({
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
  }),
  header: z.object({
    title: z.string().min(1, 'Header title is required'),
    subtitle: z.string().min(1, 'Header subtitle is required'),
  }),
  filters: z.object({
    enabled: z.boolean().default(false),
    items: z.array(workFilterSchema).default([]),
  }).default({ enabled: false, items: [] }),
  layout: z.object({
    maxWidth: z.number().default(1400),
    gap: z.number().default(12),
    pattern: z.array(z.array(z.string())),
  }),
  categories: z.array(workCategorySchema).min(1, 'At least one category required'),
  items: z.array(workItemSchema).min(1, 'At least one work item required'),
});

const contactSchema = z.object({
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

const schemas = {
  site: siteSchema,
  home: homeSchema,
  about: aboutSchema,
  work: workSchema,
  contact: contactSchema,
};

console.log('\n🔍 Validating content files in /content...\n');

const loadedContent = {};

for (const name of ['site', 'home', 'about', 'work', 'contact']) {
  const filePath = path.join(contentDir, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    report.push({
      file: `content/${name}.json`,
      path: '',
      message: 'file not found.',
    });
    totalErrors++;
    continue;
  }

  let parsed;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    parsed = JSON.parse(raw);
    loadedContent[name] = parsed;
  } catch (err) {
    report.push({
      file: `content/${name}.json`,
      path: '',
      message: `Syntax error: ${err.message}`,
    });
    totalErrors++;
    continue;
  }

  // Scan assets
  scanForAssets(parsed, name);

  // Validate with Zod schema
  const schema = schemas[name];
  const result = schema.safeParse(parsed);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      report.push({
        file: `content/${name}.json`,
        path: issue.path.join('.'),
        message: issue.message,
      });
      totalErrors++;
    });
  }
}

// Extra cross-validation checks
if (loadedContent.work && loadedContent.home) {
  const workSlugs = new Set((loadedContent.work.items || []).map((item) => item.slug));
  const featured = loadedContent.home.selectedWork?.featuredSlugs || [];
  featured.forEach((slug, idx) => {
    if (!workSlugs.has(slug)) {
      report.push({
        file: 'content/home.json',
        path: `selectedWork.featuredSlugs[${idx}]`,
        message: `featured slug "${slug}" does not exist in content/work.json items.`,
      });
      totalErrors++;
    }
  });

  const categoryIds = new Set((loadedContent.work.categories || []).map((c) => c.id));
  const seenSlugs = new Set();
  (loadedContent.work.items || []).forEach((item, idx) => {
    if (seenSlugs.has(item.slug)) {
      report.push({
        file: 'content/work.json',
        path: `items[${idx}].slug`,
        message: `Duplicate item slug "${item.slug}" found. Slugs must be unique.`,
      });
      totalErrors++;
    }
    seenSlugs.add(item.slug);

    if (!categoryIds.has(item.category)) {
      report.push({
        file: 'content/work.json',
        path: `items[${idx}].category`,
        message: `Category "${item.category}" in item "${item.slug}" does not match any category in categories.`,
      });
      totalErrors++;
    }

    if (!['4:5', '16:9', '9:16'].includes(item.ratio)) {
      report.push({
        file: 'content/work.json',
        path: `items[${idx}].ratio`,
        message: `Ratio "${item.ratio}" is invalid. Must be one of 4:5, 16:9, 9:16.`,
      });
      totalErrors++;
    }
  });
}

if (loadedContent.contact) {
  const calUrl = loadedContent.contact.booking?.calendlyUrl;
  if (calUrl && calUrl.trim().length > 0) {
    if (!calUrl.startsWith('https://')) {
      report.push({
        file: 'content/contact.json',
        path: 'booking.calendlyUrl',
        message: 'calendlyUrl must be a valid https URL if specified.',
      });
      totalErrors++;
    }
  }
}

if (totalErrors > 0) {
  console.error(`\x1b[31m❌ Content check failed with ${totalErrors} error(s):\x1b[0m\n`);
  report.forEach((err) => {
    console.error(`  \x1b[31mCONTENT ERROR in ${err.file}${err.path ? ` at ${err.path}` : ''}: "${err.message}"\x1b[0m`);
  });
  console.error('\nPlease fix the above errors in /content and re-run "npm run content:check".\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✅ All 5 content files validated successfully with 0 errors.\x1b[0m');
  for (const name of ['site', 'home', 'about', 'work', 'contact']) {
    console.log(`   - content/${name}.json: OK`);
  }
  console.log('');
  process.exit(0);
}
