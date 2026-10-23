import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceIconPath = path.join(rootDir, 'assets', 'brand', 'kraqen-icon-source.png');
const appIconPath = path.join(rootDir, 'app', 'icon.png');
const appIcoPath = path.join(rootDir, 'app', 'favicon.ico');
const appAppleIconPath = path.join(rootDir, 'app', 'apple-icon.png');
const brandMarkPath = path.join(rootDir, 'public', 'brand', 'kraqen-mark.png');
const iconsDir = path.join(rootDir, 'public', 'icons');
const publicAppleTouchIconPath = path.join(rootDir, 'public', 'apple-touch-icon.png');

function createRoundedMask(size, radiusRatio = 0.22) {
  const radius = Math.round(size * radiusRatio);
  return Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );
}

async function createRoundedImage(inputPath, size, radiusRatio = 0.22) {
  const mask = createRoundedMask(size, radiusRatio);
  return await sharp(inputPath)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function syncIcons() {
  // Ensure source artwork exists in assets/brand/kraqen-icon-source.png
  fs.mkdirSync(path.dirname(sourceIconPath), { recursive: true });
  if (!fs.existsSync(sourceIconPath)) {
    if (fs.existsSync(appIconPath)) {
      fs.copyFileSync(appIconPath, sourceIconPath);
      console.log('Saved source icon to assets/brand/kraqen-icon-source.png');
    } else {
      console.error('ERROR: neither assets/brand/kraqen-icon-source.png nor app/icon.png found!');
      process.exit(1);
    }
  }

  // Delete colliding files in public/ that conflict with Next.js app/ metadata routes
  const conflictingPublicFiles = [
    path.join(rootDir, 'public', 'icon.png'),
    path.join(rootDir, 'public', 'apple-icon.png'),
    path.join(rootDir, 'public', 'favicon.ico'),
  ];
  for (const file of conflictingPublicFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Removed conflicting public file: ${path.relative(rootDir, file)}`);
    }
  }

  // Ensure destination folders exist
  fs.mkdirSync(path.dirname(brandMarkPath), { recursive: true });
  fs.mkdirSync(iconsDir, { recursive: true });

  // 1. Unrounded copy for UI navbar logo: public/brand/kraqen-mark.png
  fs.copyFileSync(sourceIconPath, brandMarkPath);
  console.log('Copied unrounded mark -> public/brand/kraqen-mark.png');

  // 2. Generate app/icon.png (512x512, rounded corners radius = 22%)
  const rounded512 = await createRoundedImage(sourceIconPath, 512, 0.22);
  fs.writeFileSync(appIconPath, rounded512);
  console.log('Generated app/icon.png (512x512, rounded corners 22%)');

  // 3. Generate app/favicon.ico (16, 32, 48 rounded)
  const [rounded16, rounded32, rounded48] = await Promise.all([
    createRoundedImage(sourceIconPath, 16, 0.22),
    createRoundedImage(sourceIconPath, 32, 0.22),
    createRoundedImage(sourceIconPath, 48, 0.22),
  ]);
  const icoBuffer = await pngToIco([rounded16, rounded32, rounded48]);
  fs.writeFileSync(appIcoPath, icoBuffer);
  console.log('Generated app/favicon.ico (16, 32, 48 rounded)');

  // 4. Generate app/apple-icon.png (180x180, full-bleed square with NO transparency)
  const mark140 = await sharp(sourceIconPath)
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
  console.log('Generated app/apple-icon.png and public/apple-touch-icon.png (180x180, solid #0f0f0f)');

  // 5. Generate PWA icons in public/icons
  const rounded192 = await createRoundedImage(sourceIconPath, 192, 0.22);
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), rounded192);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), rounded512);

  // Maskable icon with 20% safe padding on solid background
  const mark380 = await sharp(sourceIconPath)
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
