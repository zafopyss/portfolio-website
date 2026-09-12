import * as THREE from 'three';
import { seeded, TAU } from './stage';

// Painted sprites for everything the source artwork lacks. Each painter draws
// at 2x the artwork pixel size and returns a texture plus its artwork size.
export type Sprite = { texture: THREE.Texture; width: number; height: number };

const PX = 2;

export function canvas(width: number, height: number, px = PX) {
  const el = document.createElement('canvas');
  el.width = width * px;
  el.height = height * px;
  const ctx = el.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.scale(px, px);
  return { el, ctx };
}

// Props drawn at artwork resolution with nearest sampling pick up the same
// pixel grain as the painted backdrop instead of floating over it.
export function sprite(el: HTMLCanvasElement, width: number, height: number, crisp = false): Sprite {
  const texture = new THREE.CanvasTexture(el);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (crisp) {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
  } else {
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
  }
  return { texture, width, height };
}

type RGB = [number, number, number];
const hex = (color: string): RGB => [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Smooth radius profile from (y, radius) keyframes.
function profile(keys: [number, number][]) {
  return (y: number) => {
    if (y <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [y0, r0] = keys[i - 1];
      const [y1, r1] = keys[i];
      if (y <= y1) {
        const t = (y - y0) / (y1 - y0);
        const e = (1 - Math.cos(t * Math.PI)) / 2;
        return r0 + (r1 - r0) * e;
      }
    }
    return keys[keys.length - 1][1];
  };
}

// Paints a body of revolution lit from the upper left, one pixel at a time.
function lathe(
  ctx: CanvasRenderingContext2D,
  cx: number,
  yTop: number,
  yBottom: number,
  radius: (y: number) => number,
  color: (y: number, nx: number) => RGB,
  shine = 0.35,
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  const light = [-0.55, 0.83];
  for (let y = Math.floor(yTop); y < yBottom; y++) {
    const r = radius(y);
    const rr = radius(y - 1);
    const slope = (r - rr) * 0.9;
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const nx = (x - cx) / r;
      if (Math.abs(nx) > 1) continue;
      const nz = Math.sqrt(1 - nx * nx);
      const diffuse = Math.max(0, nx * light[0] + nz * light[1] + slope * 0.25);
      const shade = 0.32 + 0.68 * diffuse;
      const spec = Math.pow(diffuse, 14) * shine;
      const [cr, cg, cb] = color(y, nx);
      const i = (y * width + x) * 4;
      data[i] = Math.min(255, cr * shade + 255 * spec);
      data[i + 1] = Math.min(255, cg * shade + 255 * spec);
      data[i + 2] = Math.min(255, cb * shade + 255 * spec);
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

export function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, angle: number, fill: string | CanvasGradient, stroke?: string) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, angle, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

export function passionflower(diameter = 64): Sprite {
  const { el, ctx } = canvas(diameter, diameter);
  const c = diameter / 2;
  const R = c * 0.96;
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * TAU;
    const gradient = ctx.createLinearGradient(c, c, c + Math.cos(angle) * R, c + Math.sin(angle) * R);
    gradient.addColorStop(0, '#d9c6ee');
    gradient.addColorStop(1, i % 2 ? '#f7f2ff' : '#e6d8f7');
    ellipse(ctx, c + Math.cos(angle) * R * 0.52, c + Math.sin(angle) * R * 0.52, R * 0.5, R * 0.15, angle, gradient, '#b59bd8');
  }
  ctx.lineCap = 'round';
  for (let i = 0; i < 52; i++) {
    const angle = (i / 52) * TAU + Math.sin(i * 7.3) * 0.05;
    const length = R * (0.68 + Math.sin(i * 3.1) * 0.05);
    const gradient = ctx.createLinearGradient(c, c, c + Math.cos(angle) * length, c + Math.sin(angle) * length);
    gradient.addColorStop(0, '#3d1466');
    gradient.addColorStop(0.32, '#3d1466');
    gradient.addColorStop(0.42, '#f6f1ff');
    gradient.addColorStop(0.58, '#f6f1ff');
    gradient.addColorStop(0.7, '#7a3fc7');
    gradient.addColorStop(1, '#5a2aa8');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = diameter * 0.014;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.cos(angle) * length, c + Math.sin(angle) * length);
    ctx.stroke();
  }
  ellipse(ctx, c, c, R * 0.17, R * 0.17, 0, '#8fc45e', '#5f8f3a');
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * TAU + 0.3;
    ellipse(ctx, c + Math.cos(angle) * R * 0.2, c + Math.sin(angle) * R * 0.2, R * 0.11, R * 0.055, angle, '#e8e27a', '#a5a34c');
  }
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * TAU + 1.1;
    ctx.strokeStyle = '#4c2a6e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.cos(angle) * R * 0.16, c + Math.sin(angle) * R * 0.16);
    ctx.stroke();
    ellipse(ctx, c + Math.cos(angle) * R * 0.17, c + Math.sin(angle) * R * 0.17, R * 0.05, R * 0.05, 0, '#6b3d8f');
  }
  return sprite(el, diameter, diameter);
}

export function leaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number, light: string, dark: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  for (const lobe of [-0.75, 0, 0.75]) {
    const gradient = ctx.createLinearGradient(0, 0, Math.cos(lobe) * size, Math.sin(lobe) * size);
    gradient.addColorStop(0, dark);
    gradient.addColorStop(1, light);
    ellipse(ctx, Math.cos(lobe) * size * 0.5, Math.sin(lobe) * size * 0.5, size * 0.52, size * 0.2, lobe, gradient, '#2d5a26');
  }
  ctx.strokeStyle = '#2f6a2a';
  ctx.lineWidth = 0.9;
  for (const lobe of [-0.75, 0, 0.75]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(lobe) * size * 0.9, Math.sin(lobe) * size * 0.9);
    ctx.stroke();
  }
  ctx.restore();
}

// Vine path in region coordinates, t from the pot (0) up the trunk (1).
export const VINE = { width: 260, height: 440 };
export const vinePoint = (t: number) => ({
  x: 200 - 40 * t + 26 * Math.sin(t * 7.5),
  y: 425 - 400 * t,
});

export function vine(): Sprite {
  const { el, ctx } = canvas(VINE.width, VINE.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#3f6b2a';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const p = vinePoint(i / 80);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.strokeStyle = '#6f9a45';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  const random = seeded(7);
  for (let i = 0; i < 16; i++) {
    const t = 0.03 + (i / 16) * 0.95;
    const p = vinePoint(t);
    const side = i % 2 ? 1 : -1;
    const angle = side * (1.15 + random() * 0.5) - 0.25;
    leaf(ctx, p.x + side * 5, p.y, 22 + random() * 10, angle, i % 3 ? '#68b04b' : '#8ccb5e', '#2f7a30');
    if (i % 4 === 1) {
      ctx.strokeStyle = '#7fae4f';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const cx = p.x - side * 14;
      const cy = p.y - 8;
      for (let a = 0; a < TAU * 2.2; a += 0.2) {
        const r = 2 + a * 1.1;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.7;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  return sprite(el, VINE.width, VINE.height);
}

export function bird(width = 26, height = 12): Sprite {
  const { el, ctx } = canvas(width, height);
  ctx.strokeStyle = '#1f2a33';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(1, height - 2);
  ctx.quadraticCurveTo(width * 0.3, 0, width / 2, height * 0.55);
  ctx.quadraticCurveTo(width * 0.7, 0, width - 1, height - 2);
  ctx.stroke();
  return sprite(el, width, height);
}

export function puff(size = 44): Sprite {
  const { el, ctx } = canvas(size, size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.75)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.28)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite(el, size, size);
}

// A blossom petal, base at the left and a notched tip at the right. Lit along
// its upper edge and curling into shadow along the lower one.
export function petal(color: string, width = 20, height = 14): Sprite {
  const { el, ctx } = canvas(width, height);
  const base = hex(color);
  const rgb = (c: RGB) => `rgb(${c.map(Math.round).join(',')})`;
  const mid = height / 2;
  const reach = height * 0.46;
  ctx.beginPath();
  ctx.moveTo(1.5, mid);
  ctx.bezierCurveTo(width * 0.34, mid - reach, width * 0.74, mid - reach * 0.96, width - 1, mid - reach * 0.56);
  ctx.quadraticCurveTo(width * 0.78, mid, width - 1, mid + reach * 0.56);
  ctx.bezierCurveTo(width * 0.74, mid + reach * 0.96, width * 0.34, mid + reach, 1.5, mid);
  ctx.closePath();
  const wash = ctx.createLinearGradient(width * 0.3, 0, width * 0.5, height);
  wash.addColorStop(0, rgb(mix(base, [255, 255, 255], 0.3)));
  wash.addColorStop(0.45, rgb(base));
  wash.addColorStop(1, rgb(mix(base, [104, 74, 112], 0.42)));
  ctx.fillStyle = wash;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const glow = ctx.createRadialGradient(width * 0.42, mid - reach * 0.5, 0.5, width * 0.42, mid - reach * 0.5, width * 0.45);
  glow.addColorStop(0, 'rgba(255,255,255,0.55)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(120,84,126,0.22)';
  ctx.lineWidth = 0.6;
  for (const spread of [-0.5, 0, 0.5]) {
    ctx.beginPath();
    ctx.moveTo(width * 0.1, mid);
    ctx.quadraticCurveTo(width * 0.55, mid + reach * spread * 0.8, width * 0.92, mid + reach * spread);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(96,66,104,0.3)';
  ctx.lineWidth = 0.7;
  ctx.stroke();
  return sprite(el, width, height);
}

// A small oak leaf from the canopy: lobed on both edges, stalk to the left.
export function oakLeaf(tone: number, width = 22, height = 14): Sprite {
  const { el, ctx } = canvas(width, height);
  const light = mix(hex('#b2d466'), hex('#6c9c38'), tone);
  const dark = mix(hex('#5f8f2e'), hex('#2c5220'), tone);
  const rgb = (c: RGB) => `rgb(${c.map(Math.round).join(',')})`;
  const mid = height / 2;
  const stalk = width * 0.14;
  const span = width - stalk - 1;
  const steps = 30;
  // Half-width is a leaf envelope times a ripple, so both edges get the same
  // lobes and the widest point sits past the middle.
  const halfWidth = (t: number) =>
    Math.sin(Math.PI * Math.min(1, t * 1.06)) ** 0.62 * (1 + 0.22 * Math.sin(t * Math.PI * 4.2 - 1.1)) * height * 0.42;
  ctx.beginPath();
  ctx.moveTo(stalk, mid);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    ctx.lineTo(stalk + t * span, mid - halfWidth(t));
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    ctx.lineTo(stalk + t * span, mid + halfWidth(t));
  }
  ctx.closePath();
  const wash = ctx.createLinearGradient(stalk, 0, width * 0.75, height);
  wash.addColorStop(0, rgb(light));
  wash.addColorStop(1, rgb(dark));
  ctx.fillStyle = wash;
  ctx.fill();
  ctx.strokeStyle = 'rgba(28,56,22,0.4)';
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(222,240,180,0.3)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(stalk * 0.3, mid);
  ctx.lineTo(stalk + span * 0.92, mid);
  ctx.stroke();
  ctx.lineWidth = 0.45;
  ctx.strokeStyle = 'rgba(222,240,180,0.2)';
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    const x = stalk + t * span;
    const reach = halfWidth(t) * 0.65;
    ctx.beginPath();
    ctx.moveTo(x - span * 0.12, mid);
    ctx.lineTo(x, mid - reach);
    ctx.moveTo(x - span * 0.12, mid);
    ctx.lineTo(x, mid + reach);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(70,96,46,0.75)';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0.8, mid + height * 0.06);
  ctx.lineTo(stalk + 0.6, mid);
  ctx.stroke();
  return sprite(el, width, height);
}

export function sparkle(size = 12): Sprite {
  const { el, ctx } = canvas(size, size);
  const c = size / 2;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(c, 0);
  ctx.quadraticCurveTo(c, c, size, c);
  ctx.quadraticCurveTo(c, c, c, size);
  ctx.quadraticCurveTo(c, c, 0, c);
  ctx.quadraticCurveTo(c, c, c, 0);
  ctx.fill();
  return sprite(el, size, size);
}

export function coffeeCup(width = 56, height = 48): Sprite {
  const { el, ctx } = canvas(width, height, 1);
  const cx = 26;
  const saucer = ctx.createLinearGradient(cx - 26, 0, cx + 26, 0);
  saucer.addColorStop(0, '#fbf8f1');
  saucer.addColorStop(0.5, '#ece6da');
  saucer.addColorStop(1, '#b6ab99');
  ellipse(ctx, cx, 40, 26, 7, 0, saucer, '#8f8474');
  ellipse(ctx, cx, 39, 24, 5.4, 0, 'rgba(255,255,255,0.35)');
  ellipse(ctx, cx, 41, 13, 3.6, 0, '#bfb4a2');
  ellipse(ctx, cx + 3, 42, 11, 2.6, 0, 'rgba(60,40,20,0.4)');
  const cream = hex('#f6f1e7');
  const shadow = hex('#c9bfae');
  lathe(ctx, cx, 12, 42, profile([[12, 15], [22, 14], [32, 11.5], [42, 9]]), (y) => mix(cream, shadow, (y - 12) / 60), 0.45);
  ctx.beginPath();
  ctx.ellipse(cx, 40, 26, 7, 0, 0.15, Math.PI - 0.15);
  ctx.strokeStyle = '#e4dccd';
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, 41, 13, 3.6, 0, 0.3, Math.PI - 0.3);
  ctx.strokeStyle = 'rgba(80,60,40,0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.strokeStyle = '#a89c88';
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.arc(cx + 15, 22, 7.5, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();
  ctx.strokeStyle = '#efe8db';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx + 15, 21.4, 7.5, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();
  ellipse(ctx, cx, 12, 15, 4.8, 0, '#d8cfc0', '#9a8f7c');
  ellipse(ctx, cx, 12.6, 13.2, 3.8, 0, '#ece5d8');
  ellipse(ctx, cx, 13, 12.2, 3.2, 0, '#6a3f22');
  ellipse(ctx, cx, 13.2, 10.8, 2.6, 0, '#2c170b');
  ellipse(ctx, cx - 4, 12.4, 3.2, 0.9, 0.2, 'rgba(255,240,220,0.35)');
  return sprite(el, width, height, true);
}

// A terracotta flowerpot matching the clay already painted on the desk: a
// flared rim over a body tapering to a narrow foot, soil at the mouth. Drawn
// on a scratch canvas and blitted back through a small blur, because the
// backdrop is soft at this depth and a crisp sprite sits on top of it like a
// sticker.
export function pot(width = 118, height = 80): Sprite {
  const { el, ctx } = canvas(width, height, 1);
  const scratch = canvas(width, height, 1);
  const paint = scratch.ctx;
  const cx = 33;
  const RIM = { outer: 30, top: 5, thickness: 7, drop: 11 };
  const BODY = { top: 27, bottom: 17, y: 74 };
  const random = seeded(21);

  // Sun from the upper left: the left flank turns away, the lit band sits a
  // third in, and the right flank falls into shadow.
  const turned = (radius: number, stops: [number, string][]) => {
    const g = paint.createLinearGradient(cx - radius, 0, cx + radius, 0);
    for (const [at, color] of stops) g.addColorStop(at, color);
    return g;
  };

  paint.beginPath();
  paint.moveTo(cx - BODY.top, RIM.drop);
  paint.quadraticCurveTo(cx - BODY.top + 2, (RIM.drop + BODY.y) / 2, cx - BODY.bottom, BODY.y);
  paint.ellipse(cx, BODY.y, BODY.bottom, 4.4, 0, Math.PI, 0, true);
  paint.quadraticCurveTo(cx + BODY.top - 2, (RIM.drop + BODY.y) / 2, cx + BODY.top, RIM.drop);
  paint.closePath();
  paint.fillStyle = turned(BODY.top, [
    [0, '#a85719'],
    [0.2, '#ef a061'.replace(' ', '')],
    [0.42, '#dd8a44'],
    [0.74, '#a85a22'],
    [1, '#70390f'],
  ]);
  paint.fill();
  paint.save();
  paint.clip();
  const sink = paint.createLinearGradient(0, RIM.drop, 0, BODY.y + 6);
  sink.addColorStop(0, 'rgba(56,26,8,0.18)');
  sink.addColorStop(0.35, 'rgba(56,26,8,0)');
  sink.addColorStop(1, 'rgba(56,26,8,0.5)');
  paint.fillStyle = sink;
  paint.fillRect(0, 0, width, height);
  // Throwing rings and a little grit, so the clay is not a flat fill.
  paint.strokeStyle = 'rgba(120,60,20,0.16)';
  paint.lineWidth = 1;
  for (let y = RIM.drop + 5; y < BODY.y; y += 7) {
    paint.beginPath();
    paint.ellipse(cx, y, BODY.top, 3.4, 0, 0, Math.PI);
    paint.stroke();
  }
  for (let i = 0; i < 40; i++) {
    const gx = cx - BODY.top + random() * BODY.top * 2;
    const gy = RIM.drop + random() * (BODY.y - RIM.drop);
    paint.fillStyle = random() > 0.5 ? 'rgba(90,44,14,0.18)' : 'rgba(255,205,150,0.16)';
    paint.fillRect(gx, gy, 1.4, 1.1);
  }
  paint.restore();

  // Rim: a band that overhangs the body, with its shadow cast on the shoulder.
  paint.beginPath();
  paint.ellipse(cx, RIM.top + RIM.thickness, RIM.outer, RIM.thickness, 0, 0, Math.PI);
  paint.lineTo(cx - RIM.outer, RIM.top);
  paint.ellipse(cx, RIM.top, RIM.outer, RIM.thickness, 0, Math.PI, 0);
  paint.closePath();
  paint.fillStyle = turned(RIM.outer, [
    [0, '#b56220'],
    [0.22, '#ffb madness'.replace(' madness', '77a')],
    [0.5, '#e89550'],
    [0.78, '#b46124'],
    [1, '#7c3f12'],
  ]);
  paint.fill();
  paint.beginPath();
  paint.ellipse(cx, RIM.top + RIM.thickness, RIM.outer - 0.5, RIM.thickness, 0, 0.15, Math.PI - 0.15);
  paint.strokeStyle = 'rgba(64,30,8,0.45)';
  paint.lineWidth = 1.6;
  paint.stroke();

  // Soil sunk below the rim, with the far inner wall catching a little light.
  ellipse(paint, cx, RIM.top, RIM.outer - 4.5, RIM.thickness - 1.6, 0, '#8a5326');
  ellipse(paint, cx, RIM.top + 1.2, RIM.outer - 6, RIM.thickness - 2.4, 0, '#3d2a1b');
  ellipse(paint, cx, RIM.top + 1.8, RIM.outer - 9, RIM.thickness - 3.4, 0, '#2a1d13');

  paint.strokeStyle = 'rgba(255,222,180,0.55)';
  paint.lineWidth = 1.2;
  paint.beginPath();
  paint.ellipse(cx, RIM.top, RIM.outer - 1, RIM.thickness - 0.5, 0, Math.PI * 1.06, Math.PI * 1.55);
  paint.stroke();

  ctx.filter = 'blur(0.45px)';
  ctx.drawImage(scratch.el, 0, 0);
  ctx.filter = 'none';
  return sprite(el, width, height);
}

// Contact shadow: stacked ellipses, dense in the middle. The wall and desk are
// already in shade, so it has to be strong to read at all.
export function shadow(width = 60, height = 16): Sprite {
  const { el, ctx } = canvas(width, height);
  const rings = 7;
  for (let i = rings; i >= 1; i--) {
    const t = i / rings;
    ctx.fillStyle = `rgba(20,10,4,${(0.2 + (1 - t) * 0.12).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, (width / 2) * t, (height / 2) * t, 0, 0, TAU);
    ctx.fill();
  }
  return sprite(el, width, height);
}

// The joiner's mark burned into the desk leg: a near-black char with a faint
// scorch halo on a white ground. The scene multiplies it over the wood, so the
// grain and the sun raking across the leg still read through the burn.
export function engraved(image: HTMLImageElement, width: number): Sprite {
  const height = (width * image.naturalHeight) / image.naturalWidth;
  const ink = canvas(width, height, 8);
  ink.ctx.drawImage(image, 0, 0, width, height);
  ink.ctx.globalCompositeOperation = 'source-in';
  ink.ctx.fillStyle = '#191009';
  ink.ctx.fillRect(0, 0, width, height);

  const { el, ctx } = canvas(width, height, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.2;
  ctx.filter = 'blur(0.5px)';
  ctx.drawImage(ink.el, 0, 0, width, height);
  ctx.filter = 'none';
  ctx.globalAlpha = 0.74;
  ctx.drawImage(ink.el, 0, 0, width, height);
  return sprite(el, width, height);
}
