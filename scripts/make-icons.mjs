import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const appIconPath = path.join(rootDir, 'app', 'icon.png');
const brandMarkPath = path.join(rootDir, 'public', 'brand', 'kraqen-mark.png');
const appAppleIconPath = path.join(rootDir, 'app', 'apple-icon.png');
const publicAppleIconPath = path.join(rootDir, 'public', 'apple-icon.png');
const publicIconPath = path.join(rootDir, 'public', 'icon.png');
const iconsDir = path.join(rootDir, 'public', 'icons');

async function makeIcons() {
  if (!fs.existsSync(appIconPath)) {
    console.error('ERROR: app/icon.png not found!');
    process.exit(1);
  }

  // 1. Delete favicon.ico files (to prevent the two-favicon / default icon conflict)
  const appFavicon = path.join(rootDir, 'app', 'favicon.ico');
  const publicFavicon = path.join(rootDir, 'public', 'favicon.ico');
  if (fs.existsSync(appFavicon)) {
    fs.unlinkSync(appFavicon);
    console.log('Removed app/favicon.ico');
  }
  if (fs.existsSync(publicFavicon)) {
    fs.unlinkSync(publicFavicon);
    console.log('Removed public/favicon.ico');
  }

  // 2. Ensure destination dirs exist
  fs.mkdirSync(path.dirname(brandMarkPath), { recursive: true });
  fs.mkdirSync(iconsDir, { recursive: true });

  // 3. Copy app/icon.png to public/brand/kraqen-mark.png and public/icon.png
  fs.copyFileSync(appIconPath, brandMarkPath);
  fs.copyFileSync(appIconPath, publicIconPath);
  console.log('Copied icon.png -> public/brand/kraqen-mark.png and public/icon.png');

  // 4. Generate app/apple-icon.png (180x180, solid #0f0f0f background, mark centered with padding)
  const mark140 = await sharp(appIconPath)
    .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const appleIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 15, g: 15, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: mark140, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(appAppleIconPath, appleIcon);
  fs.writeFileSync(publicAppleIconPath, appleIcon);
  console.log('Generated app/apple-icon.png and public/apple-icon.png (180x180, #0f0f0f)');

  // 5. Generate PWA icons in public/icons
  await sharp(appIconPath)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));

  await sharp(appIconPath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  // Maskable icon with 20% safe padding on solid background
  const mark380 = await sharp(appIconPath)
    .resize(380, 380, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 15, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: mark380, gravity: 'center' }])
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  console.log('Generated public/icons/icon-192.png, icon-512.png, icon-maskable-512.png');
  console.log('Icon generation complete!');
}

makeIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

