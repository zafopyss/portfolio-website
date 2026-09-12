// Turns the raw layers in art-src into the WebP layers the hero
// stacks. Runs in headless Chromium because the repo has no native image lib.
//   node scripts/prepare-art.mjs
import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'art-src');
const outDir = path.join(root, 'public', 'art');

const toDataUrl = async (name) =>
  `data:image/png;base64,${(await readFile(path.join(srcDir, name))).toString('base64')}`;

const sources = {
  backdrop: await toDataUrl('backdrop.png'),
  cloud: await toDataUrl('cloud.png'),
  canopy: await toDataUrl('canopy.png'),
};

const browser = await chromium.launch();
const page = await browser.newPage();
const outputs = await page.evaluate(async (sources) => {
  const load = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  const draw = (img) => {
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return { c, ctx };
  };
  const keyed = (img, keep) => {
    const { c, ctx } = draw(img);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < d.data.length; i += 4) {
      d.data[i + 3] = Math.round(d.data[i + 3] * keep(d.data[i], d.data[i + 1], d.data[i + 2]));
    }
    ctx.putImageData(d, 0, 0);
    return c;
  };
  const crop = (canvas, x, y, w, h) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
    return c;
  };
  const webp = (canvas, quality) => canvas.toDataURL('image/webp', quality);

  const [backdrop, cloud, canopy] = await Promise.all(
    [sources.backdrop, sources.cloud, sources.canopy].map(load),
  );

  const skyRemoved = keyed(backdrop, (r, g, b) => (b > r * 1.15 && b > g * 1.04 ? 0 : 1));
  const leaves = keyed(canopy, (r, g, b) =>
    Math.max(0, Math.min(1, (Math.max(r, g, b) - Math.min(r, g, b) - 8) / 12)),
  );

  return {
    'backdrop.webp': webp(draw(backdrop).c, 0.86),
    'branches.webp': webp(crop(skyRemoved, 1180, 0, 492, 560), 0.9),
    'canopy.webp': webp(crop(leaves, 880, 0, 792, 500), 0.9),
    'cloud.webp': webp(draw(cloud).c, 0.86),
  };
}, sources);
await browser.close();

await mkdir(outDir, { recursive: true });
for (const [name, dataUrl] of Object.entries(outputs)) {
  const bytes = Buffer.from(dataUrl.split(',')[1], 'base64');
  await writeFile(path.join(outDir, name), bytes);
  console.log(name, `${(bytes.length / 1024).toFixed(0)} kB`);
}
