import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const homeJsonPath = path.join(rootDir, 'content', 'home.json');
const clientsDir = path.join(rootDir, 'public', 'images', 'clients');
const tilesDir = path.join(clientsDir, 'tiles');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createTextTile(name, outputPath) {
  const svg = `
    <svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="900" fill="#151515" />
      <rect x="1" y="1" width="1198" height="898" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" rx="16" />
      <text x="50%" y="50%" font-family="sans-serif" font-weight="bold" font-size="52" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
        ${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outputPath);
}

async function generateClientTiles() {
  if (!fs.existsSync(homeJsonPath)) {
    console.error('home.json not found');
    return;
  }

  const raw = fs.readFileSync(homeJsonPath, 'utf8');
  const homeData = JSON.parse(raw);
  const partners = homeData.partners;
  if (!partners || !Array.isArray(partners.items)) {
    console.log('No partners.items found in home.json');
    return;
  }

  fs.mkdirSync(tilesDir, { recursive: true });

  const tileMode = partners.tileMode || 'keep';
  let jsonModified = false;

  for (const item of partners.items) {
    const slug = slugify(item.name || path.basename(item.logo || '', path.extname(item.logo || '')));
    const expectedTilePath = `/images/clients/tiles/${slug}.webp`;
    const outputFilePath = path.join(tilesDir, `${slug}.webp`);

    if (item.tile !== expectedTilePath) {
      item.tile = expectedTilePath;
      jsonModified = true;
    }

    if (typeof item.url === 'undefined') {
      item.url = '';
      jsonModified = true;
    }

    let logoPath = null;
    if (item.logo) {
      const cleanRel = item.logo.startsWith('/') ? item.logo.slice(1) : item.logo;
      const candidate = path.join(rootDir, 'public', cleanRel);
      if (fs.existsSync(candidate)) {
        logoPath = candidate;
      }
    }

    if (!logoPath) {
      await createTextTile(item.name || 'Client', outputFilePath);
      continue;
    }

    try {
      // 1200 x 900 tile: logo max 62% width (744px) and 46% height (414px)
      const maxW = Math.round(1200 * 0.62); // 744
      const maxH = Math.round(900 * 0.46);  // 414

      let logoBuffer;
      if (tileMode === 'white') {
        // extract alpha channel or color as white
        const resized = await sharp(logoPath)
          .resize(maxW, maxH, { fit: 'inside' })
          .png()
          .toBuffer();

        // Convert non-transparent pixels to white
        const { data, info } = await sharp(resized).raw().toBuffer({ resolveWithObject: true });
        for (let i = 0; i < data.length; i += info.channels) {
          if (info.channels >= 4 && data[i + 3] > 0) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          }
        }
        logoBuffer = await sharp(data, {
          raw: { width: info.width, height: info.height, channels: info.channels },
        })
          .png()
          .toBuffer();
      } else {
        logoBuffer = await sharp(logoPath)
          .resize(maxW, maxH, { fit: 'inside' })
          .png()
          .toBuffer();
      }

      // Base 1200x900 canvas with #151515 and subtle 1px border
      const baseSvg = `
        <svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="900" fill="#151515" />
          <rect x="0.5" y="0.5" width="1199" height="899" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" rx="16" />
        </svg>
      `;

      await sharp(Buffer.from(baseSvg))
        .composite([{ input: logoBuffer, gravity: 'center' }])
        .webp({ quality: 90 })
        .toFile(outputFilePath);

    } catch (err) {
      console.warn(`Could not process logo for ${item.name}, creating text tile fallback:`, err.message);
      await createTextTile(item.name || 'Client', outputFilePath);
    }
  }

  if (jsonModified) {
    fs.writeFileSync(homeJsonPath, JSON.stringify(homeData, null, 2) + '\n', 'utf8');
    console.log('Updated home.json with tile paths');
  }

  console.log(`Generated ${partners.items.length} client tiles in public/images/clients/tiles/`);
}

generateClientTiles().catch(err => {
  console.error('Error in make-client-tiles:', err);
  process.exit(1);
});

