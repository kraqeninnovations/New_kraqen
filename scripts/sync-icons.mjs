import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const appIconPath = path.join(rootDir, 'app', 'icon.png');
const appAppleIconPath = path.join(rootDir, 'app', 'apple-icon.png');
const brandMarkPath = path.join(rootDir, 'public', 'brand', 'kraqen-mark.png');
const iconsDir = path.join(rootDir, 'public', 'icons');
const publicAppleTouchIconPath = path.join(rootDir, 'public', 'apple-touch-icon.png');

async function syncIcons() {
  // 1. Verify app/icon.png exists
  if (!fs.existsSync(appIconPath)) {
    console.error('ERROR: app/icon.png not found!');
    process.exit(1);
  }

  // 2. Validate that app/icon.png is a valid PNG image using sharp
  try {
    const metadata = await sharp(appIconPath).metadata();
    if (!metadata || metadata.format !== 'png') {
      console.error('ERROR: app/icon.png is not a valid PNG image! Format received:', metadata?.format);
      process.exit(1);
    }
  } catch (err) {
    console.error('ERROR: app/icon.png failed image validation:', err.message);
    process.exit(1);
  }

  // 3. Delete any conflicting files in public/ that collide with Next.js app metadata routes
  const conflictingFiles = [
    path.join(rootDir, 'public', 'icon.png'),
    path.join(rootDir, 'public', 'apple-icon.png'),
    path.join(rootDir, 'public', 'favicon.ico'),
    path.join(rootDir, 'app', 'favicon.ico'),
  ];

  for (const file of conflictingFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Removed conflicting file: ${path.relative(rootDir, file)}`);
    }
  }

  // 4. Ensure destination directories exist
  fs.mkdirSync(path.dirname(brandMarkPath), { recursive: true });
  fs.mkdirSync(iconsDir, { recursive: true });

  // 5. Copy app/icon.png to public/brand/kraqen-mark.png
  fs.copyFileSync(appIconPath, brandMarkPath);
  console.log('Copied app/icon.png -> public/brand/kraqen-mark.png');

  // 6. Generate app/apple-icon.png (180x180, solid #0f0f0f background for Next.js metadata route)
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
  fs.writeFileSync(publicAppleTouchIconPath, appleIcon);
  console.log('Generated app/apple-icon.png and public/apple-touch-icon.png (180x180, #0f0f0f)');

  // 7. Generate PWA icons in public/icons
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
  console.log('Icon synchronization complete!');
}

syncIcons().catch((err) => {
  console.error('Error syncing icons:', err);
  process.exit(1);
});

