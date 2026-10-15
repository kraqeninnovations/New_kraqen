import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const publicDir = path.join(rootDir, 'public');

const files = ['site', 'home', 'about', 'work', 'contact'];

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
    const extra = contextStr.path && contextStr.path.includes('apkUrl')
      ? ' Build the APK (see docs/ANDROID_APK.md) or set install.enabled to false.'
      : '';
    report.push({
      file: contextStr.file,
      path: contextStr.path,
      message: `file "${assetPath}" not found in /public.${extra}`,
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
        key === 'hoverImage' ||
        key === 'src' ||
        key === 'videoSrc' ||
        key === 'previewSrc' ||
        key === 'posterSrc' ||
        key === 'ogImage' ||
        key === 'navbarLogo' ||
        key === 'mark' ||
        key === 'whiteLogo' ||
        key === 'darkLogo' ||
        key === 'appIcon' ||
        key === 'apkUrl'
      ) {
        checkAssetExists(value, { file: `content/${file}.json`, path: keyPath });
      }
    } else if (typeof value === 'object' && value !== null) {
      scanForAssets(value, file, keyPath);
    }
  }
}

// Schemas for validation
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
    generic: z.string().min(1),
    network: z.string().min(1),
    formRequired: z.string().min(1),
    formInvalidEmail: z.string().min(1),
    formServerError: z.string().min(1),
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
        position: z.enum(['top-center', 'left', 'left-center', 'right']),
      })
    ).min(1, 'At least one hero image required'),
  }),
  selectedWork: z.object({
    label: z.string().optional(),
    labelLeft: z.string().optional(),
    labelRight: z.string().optional(),
    headingLines: z.array(z.string().min(1)).min(1),
    sideText: z.string().optional(),
    paragraph: z.string().optional(),
    hoverLabel: z.string().optional(),
    source: z.enum(['manual', 'instagram-api']).optional(),
    limit: z.number().optional(),
    instagram: z
      .object({
        handle: z.string().min(1),
        profileUrl: z.string().url(),
        openLabel: z.string().optional(),
        followLabel: z.string().optional(),
        embedFailedText: z.string().optional(),
      })
      .optional(),
    viewer: z
      .object({
        closeLabel: z.string().optional(),
        prevLabel: z.string().optional(),
        nextLabel: z.string().optional(),
        hint: z.string().optional(),
        reelBadge: z.string().optional(),
        postBadge: z.string().optional(),
      })
      .optional(),
    projects: z.array(
      z.object({
        id: z.string().optional(),
        number: z.string().optional(),
        name: z.string().optional(),
        title: z.string().optional(),
        services: z.string().optional(),
        category: z.string().optional(),
        year: z.string().min(1),
        mediaType: z.enum(['reel', 'post', 'image']).optional(),
        instagramUrl: z
          .string()
          .regex(
            /^https:\/\/(www\.)?instagram\.com\/(reel|reels|p|tv)\/[A-Za-z0-9_-]+\/?.*$/,
            'must look like https://www.instagram.com/reel/XXXX/ or https://www.instagram.com/p/XXXX/'
          )
          .optional()
          .or(z.literal('')),
        image: z.string().min(1),
        video: z.string().optional(),
        alt: z.string().optional(),
        fit: z.enum(['cover', 'inset', 'full-bleed']).optional(),
        imageStyle: z.enum(['full-bleed', 'inset', 'cover']).optional(),
      }).refine(
        (p) => {
          if (p.mediaType === 'reel' || p.mediaType === 'post') {
            const hasUrl = typeof p.instagramUrl === 'string' && p.instagramUrl.length > 0;
            const hasVid = typeof p.video === 'string' && p.video.length > 0;
            return hasUrl || hasVid;
          }
          return true;
        },
        {
          message: 'if mediaType is reel or post then instagramUrl or video is required',
          path: ['instagramUrl'],
        }
      )
    ).min(1),
  }),
  services: z.object({
    labelLeft: z.string().min(1),
    labelRight: z.string().min(1),
    items: z.array(
      z.object({
        number: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
      })
    ).min(1),
  }),
  partners: z.object({
    labelLeft: z.string().min(1),
    labelRight: z.string().min(1),
    headingLines: z.array(z.string().min(1)).min(1),
    fillEmptyCells: z.boolean().default(true),
    clients: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        logo: z.string().min(1, 'Required. Expected a string like "/logos/name.svg".'),
        hoverImage: z.string().min(1, 'Required. Expected a string like "/images/hover.jpg".'),
        scale: z.number().optional().default(1),
      })
    ).min(1),
  }),
});

const aboutSchema = z.object({
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  intro: z.object({
    title: z.string().min(1),
    paragraph: z.string().min(1),
  }),
  team: z.object({
    heading: z.string().default('THE TEAM'),
    members: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        role: z.string().min(1),
        bio: z.string().min(1),
        image: z.string().min(1),
        alt: z.string().min(1),
        isGreyscaleDefault: z.boolean().default(false),
      })
    ).min(1),
  }),
  services: z.object({
    labelLeft: z.string().min(1),
    labelRight: z.string().min(1),
    useHomeServices: z.boolean().default(true),
    items: z.array(z.any()).default([]),
  }),
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
  }),
  approach: z.object({
    labelLeft: z.string().min(1),
    labelRight: z.string().min(1),
    headlineLines: z.array(z.string().min(1)).min(1),
    useHomePartners: z.boolean().default(true),
    fillEmptyCells: z.boolean().default(true),
    clients: z.array(z.any()).default([]),
  }),
});

const workSchema = z
  .object({
    seo: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
    header: z.object({
      title: z.string().min(1),
      countFormat: z.string().default('{count} / {total}'),
      filters: z.array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
        })
      ).min(1),
    }),
    projects: z.array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        category: z.string().min(1),
        tags: z.array(z.string().min(1)).min(1),
        year: z.string().min(1),
        image: z.string().min(1),
        isVideo: z.boolean().optional(),
        videoSrc: z.string().optional(),
        aspect: z.string().default('aspect-[16/9]'),
        column: z.enum(['left', 'right']),
      })
    ).min(1),
  })
  .superRefine((data, ctx) => {
    const validFilterIds = new Set(data.header.filters.map((f) => f.id));
    data.projects.forEach((proj, projIndex) => {
      proj.tags.forEach((tag, tagIndex) => {
        if (!validFilterIds.has(tag) && tag !== 'all') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `"${tag}" is not a valid filter id. Valid ids: ${Array.from(validFilterIds).join(', ')}`,
            path: ['projects', projIndex, 'tags', tagIndex],
          });
        }
      });
    });

    const ids = new Set();
    data.projects.forEach((proj, projIndex) => {
      if (ids.has(proj.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate project id "${proj.id}" found. Slugs must be unique.`,
          path: ['projects', projIndex, 'id'],
        });
      }
      ids.add(proj.id);
    });
  });

const contactSchema = z.object({
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  hero: z.object({
    label: z.string().min(1),
    headlineLines: z.array(z.string().min(1)).min(1),
    paragraph: z.string().min(1),
  }),
  fields: z.object({
    name: z.object({ enabled: z.boolean(), required: z.boolean(), label: z.string(), placeholder: z.string() }),
    email: z.object({ enabled: z.boolean(), required: z.boolean(), label: z.string(), placeholder: z.string() }),
    phone: z.object({ enabled: z.boolean(), required: z.boolean(), label: z.string(), placeholder: z.string() }).optional(),
    company: z.object({ enabled: z.boolean(), required: z.boolean(), label: z.string(), placeholder: z.string() }),
    projectTypes: z.object({
      enabled: z.boolean(),
      required: z.boolean(),
      label: z.string(),
      options: z.array(z.object({ id: z.string(), label: z.string() })),
    }),
    budget: z.object({
      enabled: z.boolean(),
      required: z.boolean(),
      label: z.string(),
      placeholder: z.string(),
      options: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    timing: z.object({
      enabled: z.boolean(),
      required: z.boolean(),
      label: z.string(),
      placeholder: z.string(),
      options: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    message: z.object({
      enabled: z.boolean(),
      required: z.boolean(),
      label: z.string(),
      helper: z.string().optional(),
      placeholder: z.string(),
    }),
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
    label: z.string().min(1),
    sending: z.string().min(1),
  }),
  privacyNote: z.string().default(''),
  success: z.object({
    heading: z.string().min(1),
    message: z.string().min(1),
    resetButton: z.string().min(1),
  }),
  error: z.object({
    text: z.string().min(1),
    showEmail: z.boolean().default(true),
  }),
});

const schemaMap = {
  site: siteSchema,
  home: homeSchema,
  about: aboutSchema,
  work: workSchema,
  contact: contactSchema,
};

async function validateFile(name) {
  const filePath = path.join(contentDir, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    report.push({
      file: `content/${name}.json`,
      path: 'root',
      message: `File does not exist: content/${name}.json`,
    });
    totalErrors++;
    return;
  }

  let raw = '';
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    report.push({
      file: `content/${name}.json`,
      path: 'root',
      message: `Could not read file: ${err.message}`,
    });
    totalErrors++;
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const match = err.message.match(/position (\d+)/i);
    let lineInfo = '';
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = raw.slice(0, pos).split('\n');
      lineInfo = ` at line ${lines.length}, column ${lines[lines.length - 1].length + 1}`;
    }
    report.push({
      file: `content/${name}.json`,
      path: 'syntax',
      message: `JSON SYNTAX ERROR in content/${name}.json${lineInfo}: ${err.message}. Check for a missing comma or quote.`,
    });
    totalErrors++;
    return;
  }

  // Schema check
  const schema = schemaMap[name];
  if (schema) {
    const result = schema.safeParse(parsed);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const pathStr = issue.path.length > 0 ? issue.path.join('.') : 'root';
        report.push({
          file: `content/${name}.json`,
          path: pathStr,
          message: issue.message,
        });
        totalErrors++;
      });
    }
  }

  // Check asset paths
  scanForAssets(parsed, name);
}

async function run() {
  console.log('\n🔍 Validating content files in /content...\n');

  for (const name of files) {
    await validateFile(name);
  }

  if (totalErrors > 0) {
    console.error('❌ Content check failed with ' + totalErrors + ' error(s):\n');
    report.forEach((err) => {
      console.error(`  CONTENT ERROR in ${err.file} at ${err.path}: "${err.message}"`);
    });
    console.error('\nPlease fix the above errors in /content and re-run "npm run content:check".\n');
    process.exit(1);
  }

  console.log('✅ All 5 content files validated successfully with 0 errors.');
  console.log('   - content/site.json: OK');
  console.log('   - content/home.json: OK');
  console.log('   - content/about.json: OK');
  console.log('   - content/work.json: OK');
  console.log('   - content/contact.json: OK\n');
}

run();

