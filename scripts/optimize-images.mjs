import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'assets', 'images');

const presets = [
  {
    input: 'tati-palco-sonora.jpg',
    localSource: path.join(root, 'tati banner top_files', '612813421_18298850545260663_6190278921622877883_n.heic'),
    outDir: 'hero',
    base: 'tati-palco',
    widths: [480, 800, 1200],
    aspect: { width: 4, height: 5 },
    position: 'top',
    enhance: { brightness: 1.02, saturation: 0.78, contrast: 1.12 },
  },
  {
    input: 'tati-retrato.jpg',
    outDir: 'sobre',
    base: 'tati-retrato',
    widths: [320, 360],
    aspect: { width: 4, height: 5 },
    position: 'attention',
    enhance: { brightness: 1.04, saturation: 0.9, contrast: 1.1 },
  },
  {
    input: 'tati-retrato.jpg',
    outDir: 'thumbs',
    base: 'tati-retrato-thumb',
    widths: [400],
    aspect: { width: 16, height: 9 },
    position: 'attention',
    enhance: { brightness: 1.03, saturation: 0.88, contrast: 1.08 },
    allowUpscale: true,
  },
];

async function prepareSource(preset) {
  const dest = path.join(srcDir, preset.input);
  if (preset.localSource && fs.existsSync(preset.localSource)) {
    await sharp(preset.localSource)
      .rotate()
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(dest);
    console.log('Source upgraded from local', path.basename(preset.localSource));
  }
  return dest;
}

function enhancePipeline(inputPath, enhance) {
  return sharp(inputPath)
    .rotate()
    .normalize()
    .modulate({
      brightness: enhance.brightness,
      saturation: enhance.saturation,
      contrast: enhance.contrast,
    })
    .sharpen({ sigma: 0.85, m1: 0.55, m2: 0.4 });
}

async function exportVariant(pipeline, meta, dest, width, aspect, position, allowUpscale) {
  const height = Math.round(width * (aspect.height / aspect.width));
  const withoutEnlargement = !allowUpscale && width > (meta.width || width);

  const resized = pipeline.clone().resize(width, height, {
    fit: 'cover',
    position,
    withoutEnlargement,
  });

  await resized.clone().webp({ quality: 84, effort: 4 }).toFile(dest.replace(/\.jpg$/, '.webp'));
  await resized
    .clone()
    .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(dest.endsWith('.jpg') ? dest : dest.replace(/\.webp$/, '.jpg'));
}

for (const preset of presets) {
  const inputPath = await prepareSource(preset);
  if (!fs.existsSync(inputPath)) {
    console.warn('Skip missing', preset.input);
    continue;
  }

  const meta = await sharp(inputPath).metadata();
  const outDir = path.join(srcDir, preset.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const pipeline = enhancePipeline(inputPath, preset.enhance);

  for (const width of preset.widths) {
    if (width > meta.width && !preset.allowUpscale) {
      console.warn('Skip upscale', preset.base, width, `(source ${meta.width}px)`);
      continue;
    }

    const webpDest = path.join(outDir, `${preset.base}-${width}w.webp`);
    await exportVariant(pipeline, meta, webpDest, width, preset.aspect, preset.position, preset.allowUpscale);
    console.log('OK', path.relative(root, webpDest));
  }
}

console.log('Image optimization complete.');
