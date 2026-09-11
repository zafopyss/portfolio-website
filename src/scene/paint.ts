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

export function petal(color: string, width = 14, height = 9): Sprite {
  const { el, ctx } = canvas(width, height);
  ellipse(ctx, width / 2, height / 2, width * 0.45, height * 0.4, 0.3, color, 'rgba(0,0,0,0.15)');
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

export function pot(width = 118, height = 80): Sprite {
  const { el, ctx } = canvas(width, height, 1);
  const cx = 33;
  const clayLit = hex('#d9925e');
  const clayDeep = hex('#8f4a27');
  const glazeLit = hex('#e3d6bd');
  const glazeDeep = hex('#b8a583');
  const random = seeded(21);
  const speckles = Array.from({ length: 70 }, () => [random(), random()] as const);
  const shape = profile([[6, 17], [12, 14], [24, 27], [40, 30], [56, 27], [68, 21], [74, 20]]);
  ellipse(ctx, cx, 74, 21, 4.2, 0, 'rgba(45,25,12,0.75)');
  lathe(ctx, cx, 6, 74, shape, (y, nx) => {
    const angle = Math.asin(Math.max(-1, Math.min(1, nx)));
    const drip = 42 + Math.sin(angle * 4.2) * 4 + Math.sin(angle * 9.5 + 1) * 2.5;
    const rings = 1 + Math.sin(y * 1.6) * 0.035;
    if (y < drip) {
      const glaze = mix(glazeLit, glazeDeep, (y - 6) / 60);
      const r = shape(y);
      const dark = speckles.some(([sx, sy]) => Math.hypot((sx * 2 - 1 - nx) * r, sy * 70 - y) < 1.1);
      return (dark ? mix(glaze, hex('#5a3a22'), 0.7) : glaze).map((c) => c * rings) as RGB;
    }
    return mix(clayLit, clayDeep, (y - 40) / 40).map((c) => c * rings) as RGB;
  }, 0.28);
  ctx.beginPath();
  ctx.ellipse(cx, 74, 20, 3.6, 0, 0, Math.PI);
  ctx.fillStyle = '#4a2612';
  ctx.fill();
  ellipse(ctx, cx, 6, 17, 4.6, 0, '#c9b592', '#7d5a3a');
  ellipse(ctx, cx, 6.4, 14.5, 3.4, 0, '#3a2416');
  ellipse(ctx, cx, 7.2, 12, 2.2, 0, '#22140b');
  return sprite(el, width, height, true);
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
