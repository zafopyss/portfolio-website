import { canvas, ellipse, sprite, type Sprite } from './paint';
import { seeded, TAU } from './stage';

// Alpine flower beds for the terrace bushes. Each species is a painter that
// draws one plant standing on (x, y); a bed mixes a few of them and fades its
// base into the bush behind.
type Random = () => number;
type Painter = (ctx: CanvasRenderingContext2D, random: Random, x: number, y: number, size: number) => void;

const BED = { width: 160, height: 150 };
const OUTLINE = 'rgba(22,44,24,0.5)';

function stem(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, bow: number, width: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) / 2 + bow, (y0 + y1) / 2, x1, y1);
  ctx.stroke();
}

// Point on the quadratic stem at t, plus its heading.
function along(x0: number, y0: number, x1: number, y1: number, bow: number, t: number) {
  const cx = (x0 + x1) / 2 + bow;
  const cy = (y0 + y1) / 2;
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
    heading: Math.atan2(2 * u * (cy - y0) + 2 * t * (y1 - cy), 2 * u * (cx - x0) + 2 * t * (x1 - cx)),
  };
}

// Pointed leaf from (x, y) along angle, lit from the upper left.
function blade(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, width: number, angle: number, light: string, dark: string, outline = OUTLINE) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.45, -width, length, 0);
  ctx.quadraticCurveTo(length * 0.45, width, 0, 0);
  ctx.closePath();
  const lit = Math.cos(angle + Math.PI * 0.75);
  const gradient = ctx.createLinearGradient(0, -width, length * 0.6, width);
  gradient.addColorStop(0, lit > 0 ? light : dark);
  gradient.addColorStop(1, lit > 0 ? dark : light);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.restore();
}

function ball(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, light: string, dark: string, outline = OUTLINE) {
  const gradient = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r * 1.25);
  gradient.addColorStop(0, light);
  gradient.addColorStop(1, dark);
  ellipse(ctx, x, y, r, r, 0, gradient, outline);
}

// Bush-coloured foliage under a plant so its foot melts into the backdrop.
function tuft(ctx: CanvasRenderingContext2D, random: Random, x: number, y: number, spread: number) {
  for (let i = 0; i < 4; i++) {
    const angle = -Math.PI * 0.9 + (i / 3) * Math.PI * 0.8 + (random() - 0.5) * 0.4;
    blade(ctx, x + (random() - 0.5) * spread * 0.4, y + 2, spread * (0.5 + random() * 0.4), 3 + random() * 2, angle, '#a9c957', '#4d7a2e', 'rgba(30,60,25,0.35)');
  }
}

const LUPIN_TONES = [['#8a94dc', '#3c4694'], ['#a686d0', '#5a3e96'], ['#d993bb', '#8e4472']];

const lupin: Painter = (ctx, random, x, y, size) => {
  const h = Math.min(92 * size, y - 8);
  const bow = (random() - 0.5) * 10;
  const topX = x + (random() - 0.5) * 8;
  for (const side of [-1, 1]) {
    const lx = x + side * 12 * size;
    const ly = y - 6;
    stem(ctx, x, y, lx, ly + 2, 0, 1.4, '#3f6b2a');
    for (let i = 0; i < 7; i++) {
      const angle = -Math.PI * 0.95 + (i / 6) * Math.PI * 0.9 + side * 0.25;
      blade(ctx, lx, ly, 15 * size + random() * 5, 2.6, angle, '#7fae4c', '#3f6f2e');
    }
  }
  stem(ctx, x, y, topX, y - h, bow, 2.2, '#4f7a35');
  const [light, dark] = LUPIN_TONES[Math.floor(random() * LUPIN_TONES.length)];
  const rows = 15;
  for (let i = 0; i < rows; i++) {
    const t = 0.36 + (i / rows) * 0.66;
    const p = along(x, y, topX, y - h, bow, t);
    const r = (4.6 - i * 0.2) * size;
    const spin = i * 2.2;
    const bud = i > rows - 4;
    for (const k of [0, 1, 2]) {
      const px = p.x + Math.cos(spin + k * 2.1) * r * 1.25;
      const py = p.y + Math.sin(spin + k * 2.1) * r * 0.45;
      if (bud) ball(ctx, px, py, r * 0.8, '#9cbb7e', '#587a45');
      else {
        ball(ctx, px, py, r, light, dark);
        ellipse(ctx, px - r * 0.2, py - r * 0.3, r * 0.42, r * 0.28, -0.4, 'rgba(245,240,255,0.55)');
      }
    }
  }
};

const foxglove: Painter = (ctx, random, x, y, size) => {
  const h = Math.min(96 * size, y - 8);
  const lean = (random() > 0.5 ? 1 : -1) * (14 + random() * 10);
  const topX = x + lean;
  const bow = -lean * 0.9;
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI * 1.05 + (i / 4) * Math.PI * 1.1 + (random() - 0.5) * 0.3;
    blade(ctx, x, y - 2, 22 * size + random() * 6, 6, angle, '#86b356', '#3f6f2e');
  }
  stem(ctx, x, y, topX, y - h, bow, 2, '#5c8a3c');
  const outer = ['#d98fb5', '#b45e8b'];
  for (let i = 0; i < 9; i++) {
    const t = 0.34 + (i / 9) * 0.62;
    const p = along(x, y, topX, y - h, bow, t);
    const s = (10.5 - i * 0.7) * size;
    const side = i % 2 ? 1 : -1;
    const angle = Math.PI / 2 + side * 0.85 - Math.sign(lean) * 0.25;
    if (i > 6) {
      ball(ctx, p.x + side * 2, p.y, s * 0.55, '#e2b0cb', '#a35b86');
      continue;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    const gradient = ctx.createLinearGradient(0, -s * 0.5, s * 0.6, s * 0.5);
    gradient.addColorStop(0, outer[0]);
    gradient.addColorStop(1, outer[1]);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.22);
    ctx.bezierCurveTo(s * 0.7, -s * 0.5, s * 1.35, -s * 0.45, s * 1.45, -s * 0.1);
    ctx.lineTo(s * 1.45, s * 0.1);
    ctx.bezierCurveTo(s * 1.35, s * 0.45, s * 0.7, s * 0.5, 0, s * 0.22);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ellipse(ctx, s * 1.32, 0, s * 0.18, s * 0.42, 0, '#f3dfe9', '#8f4a72');
    ellipse(ctx, s * 1.2, -s * 0.05, s * 0.12, s * 0.28, 0, '#f6ecf1');
    for (const [dx, dy] of [[1.1, -0.15], [1.02, 0.12], [1.22, 0.2]]) ellipse(ctx, s * dx, s * dy, s * 0.05, s * 0.05, 0, '#7a2f55');
    ctx.restore();
  }
};

const allium: Painter = (ctx, random, x, y, size) => {
  const count = 1 + Math.floor(random() * 2);
  for (let n = 0; n < count; n++) {
    const r = (12 + random() * 3) * size;
    const h = Math.min((86 + random() * 26) * size, y - r * 1.5 - 4);
    const bx = x + (n ? 14 : 0) * (random() > 0.5 ? 1 : -1);
    const topX = bx + (random() - 0.5) * 12;
    stem(ctx, bx, y, topX, y - h, (random() - 0.5) * 6, 1.6, '#7f9a63');
    const cx = topX;
    const cy = y - h - r * 0.4;
    ball(ctx, cx, cy, r * 0.92, 'rgba(120,80,160,0.35)', 'rgba(70,40,110,0.5)', 'rgba(0,0,0,0)');
    const stars = 42;
    for (let i = 0; i < stars; i++) {
      const z = 1 - (2 * (i + 0.5)) / stars;
      const ring = Math.sqrt(1 - z * z);
      const a = i * 2.39996 + random() * 0.3;
      const px = cx + Math.cos(a) * ring * r;
      const py = cy + z * r;
      const lit = (-(Math.cos(a) * ring) - z) * 0.5 + 0.5;
      ctx.strokeStyle = 'rgba(85,55,130,0.65)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(cx + (px - cx) * 0.35, cy + (py - cy) * 0.35);
      ctx.lineTo(px, py);
      ctx.stroke();
      ellipse(ctx, px, py, 1.7, 1.7, 0, lit > 0.55 ? '#cfaee6' : lit > 0.3 ? '#a67fcf' : '#7250a6');
    }
  }
};

const eryngium: Painter = (ctx, random, x, y, size) => {
  const heads = 1 + Math.floor(random() * 2);
  const h = 66 * size;
  stem(ctx, x, y, x + 2, y - h * 0.55, 0, 2.2, '#6a88ad');
  for (let n = 0; n < heads; n++) {
    const spread = (n - (heads - 1) / 2) * 24 * size;
    const hx = x + 2 + spread;
    const hy = y - h + Math.abs(spread) * 0.35 + random() * 6;
    stem(ctx, x + 2, y - h * 0.55, hx, hy + 8, spread * 0.2, 1.8, '#6a88ad');
    const s = (14 + random() * 3) * size;
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * TAU + 0.35;
      blade(ctx, hx, hy + 4, s * (1.1 + random() * 0.3), 2, angle, '#b4cbec', '#4f6ea3', 'rgba(35,55,95,0.55)');
    }
    const cone = ctx.createLinearGradient(hx - s * 0.5, hy - s, hx + s * 0.5, hy + s * 0.3);
    cone.addColorStop(0, '#92b0dc');
    cone.addColorStop(1, '#3d5590');
    ctx.beginPath();
    ctx.moveTo(hx - s * 0.42, hy + 5);
    ctx.quadraticCurveTo(hx - s * 0.5, hy - s * 0.8, hx, hy - s * 1.15);
    ctx.quadraticCurveTo(hx + s * 0.5, hy - s * 0.8, hx + s * 0.42, hy + 5);
    ctx.closePath();
    ctx.fillStyle = cone;
    ctx.fill();
    ctx.strokeStyle = 'rgba(40,60,90,0.55)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const row = Math.floor(i / 3);
      const px = hx - s * 0.25 + (i % 3) * s * 0.25 + (row % 2) * s * 0.12;
      const py = hy + 2 - row * s * 0.32;
      ellipse(ctx, px, py, 0.9, 0.9, 0, 'rgba(30,45,75,0.55)');
    }
  }
};

const edelweiss: Painter = (ctx, random, x, y, size) => {
  const count = 1 + Math.floor(random() * 2);
  for (let n = 0; n < count; n++) {
    const fx = x + (n - (count - 1) / 2) * 24 * size + (random() - 0.5) * 6;
    const fy = y - (16 + random() * 14) * size;
    stem(ctx, fx + (random() - 0.5) * 4, y, fx, fy + 2, 0, 1.6, '#8ea87a');
    blade(ctx, fx - 1, y - 8, 9, 2.2, -Math.PI * 0.8, '#b9c9a8', '#6e8a62');
    const petals = 9 + Math.floor(random() * 3);
    const r = (14 + random() * 3) * size;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * TAU + random() * 0.25;
      const length = r * (i % 2 ? 0.7 : 1) * (0.85 + random() * 0.3);
      blade(ctx, fx, fy, length, 2.8, angle, '#f6f3e8', '#bdb8a4', 'rgba(80,80,70,0.5)');
    }
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * TAU + n;
      const d = i ? r * 0.28 : 0;
      ball(ctx, fx + Math.cos(angle) * d, fy + Math.sin(angle) * d * 0.8, r * 0.17, '#ecd97e', '#a0842c', 'rgba(90,70,20,0.5)');
    }
  }
};

const fern: Painter = (ctx, random, x, y, size) => {
  const fronds = 3;
  for (let n = 0; n < fronds; n++) {
    const dir = n === 1 ? 0 : n ? 1 : -1;
    const length = (48 + random() * 16) * size;
    const tipX = x + dir * length * 0.8 + (random() - 0.5) * 10;
    const tipY = y - length * (dir ? 0.55 : 1);
    const bow = dir * -length * 0.35;
    stem(ctx, x, y, tipX, tipY, bow, 1.3, '#3f6f2e');
    const pinnae = 9;
    for (let i = 1; i < pinnae; i++) {
      const t = i / pinnae;
      const p = along(x, y, tipX, tipY, bow, t);
      const len = (14 - i * 1.2) * size;
      for (const side of [-1, 1]) {
        blade(ctx, p.x, p.y, len, 2, p.heading + side * 1.1, '#8cbb55', '#3f6f2e');
      }
    }
  }
};

const gentian: Painter = (ctx, random, x, y, size) => {
  const count = 2 + Math.floor(random() * 2);
  for (let n = 0; n < count; n++) {
    const fx = x + (n - (count - 1) / 2) * 16 * size + (random() - 0.5) * 6;
    const fy = y - (16 + random() * 12) * size;
    stem(ctx, fx + (random() - 0.5) * 3, y, fx, fy + 4, 0, 1.6, '#4f7a35');
    for (const side of [-1, 1]) blade(ctx, fx, y - 6, 10, 2.6, -Math.PI / 2 + side * 1.1, '#7fae4c', '#3f6f2e');
    const s = (10 + random() * 2) * size;
    ctx.save();
    ctx.translate(fx, fy);
    const tube = ctx.createLinearGradient(-s * 0.5, 0, s * 0.5, s);
    tube.addColorStop(0, '#3f63c4');
    tube.addColorStop(1, '#1f3480');
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 1.1);
    ctx.quadraticCurveTo(-s * 0.55, s * 0.2, -s * 0.85, -s * 0.5);
    ctx.lineTo(s * 0.85, -s * 0.5);
    ctx.quadraticCurveTo(s * 0.55, s * 0.2, s * 0.3, s * 1.1);
    ctx.closePath();
    ctx.fillStyle = tube;
    ctx.fill();
    ctx.strokeStyle = 'rgba(15,25,70,0.6)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - Math.PI / 2;
      ellipse(ctx, Math.cos(a) * s * 0.62, -s * 0.5 + Math.sin(a) * s * 0.36, s * 0.5, s * 0.3, a, i < 3 ? '#5f86e0' : '#2c48a8', 'rgba(15,25,70,0.6)');
    }
    ellipse(ctx, 0, -s * 0.5, s * 0.34, s * 0.2, 0, '#182a6a');
    ellipse(ctx, -s * 0.06, -s * 0.56, s * 0.14, s * 0.08, 0, '#d4dbb0');
    ctx.restore();
  }
};

const SPIRES: Painter[] = [lupin, foxglove, allium];
const GROUND: Painter[] = [eryngium, edelweiss, fern, gentian];

// One spire so the bed pokes out of the bush, one or two ground species, then
// four or five plants laid out back to front. Species come from the seed
// modulo so the seven terrace beds cover every spire.
export function bed(seed: number): Sprite {
  const { width, height } = BED;
  const { el, ctx } = canvas(width, height);
  const random = seeded(seed);
  const spire = SPIRES[seed % SPIRES.length];
  const firstGround = seed % GROUND.length;
  const mix = [spire, GROUND[firstGround]];
  if (random() > 0.45) mix.push(GROUND[(firstGround + 1 + Math.floor(random() * (GROUND.length - 1))) % GROUND.length]);
  const count = 4 + Math.floor(random() * 2);
  const plants = Array.from({ length: count }, (_, i) => ({
    paint: mix[i % mix.length],
    x: 24 + ((i + random() * 0.6) / count) * (width - 48),
    y: height - 34 + random() * 22,
    size: 0.85 + random() * 0.3,
  })).sort((a, b) => a.y - b.y);
  for (const p of plants) tuft(ctx, random, p.x, p.y, 26);
  for (const p of plants) p.paint(ctx, random, p.x, p.y, p.size);
  const fade = ctx.createLinearGradient(0, height - 30, 0, height);
  fade.addColorStop(0, 'rgba(0,0,0,0)');
  fade.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = fade;
  ctx.fillRect(0, height - 30, width, 30);
  return sprite(el, width, height, true);
}

// Marigolds in the wall pot: a mound of orange heads over the rim, no
// foliage. CROWN sits on the pot mouth.
export const NASTURTIUM = { width: 170, height: 120, crown: { x: 85, y: 62 } };

// A ruffled head seen from the side: three rings of petals, darkest at the
// back, over a short russet stem.
function bloom(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, random: Random) {
  const rings = [
    { r: 1, count: 9, light: '#c94d12', dark: '#9c3a0e', squash: 0.42 },
    { r: 0.74, count: 8, light: '#f08a24', dark: '#d2600f', squash: 0.5 },
    { r: 0.46, count: 7, light: '#ffb547', dark: '#ec8319', squash: 0.58 },
  ];
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      const a = (i / ring.count) * TAU + random() * 0.25;
      const px = x + Math.cos(a) * size * ring.r * 0.62;
      const py = y + Math.sin(a) * size * ring.r * 0.42;
      ellipse(ctx, px, py, size * ring.r * 0.42, size * ring.r * ring.squash * 0.42, a, i % 2 ? ring.light : ring.dark, 'rgba(120,52,8,0.4)');
    }
  }
  const heart = ctx.createRadialGradient(x - size * 0.08, y - size * 0.1, size * 0.04, x, y, size * 0.34);
  heart.addColorStop(0, '#ffe08a');
  heart.addColorStop(1, '#e8791a');
  ellipse(ctx, x, y, size * 0.3, size * 0.24, 0, heart);
}

export function nasturtium(): Sprite {
  const { width, height, crown } = NASTURTIUM;
  const { el, ctx } = canvas(width, height);
  const random = seeded(29);
  // Back row first so the front heads overlap it.
  const heads = [
    [-26, -4, 13], [26, -2, 13], [-11, -17, 12], [13, -18, 12], [1, -29, 11],
    [-33, 8, 12], [33, 9, 12], [-17, 7, 15], [17, 8, 15], [0, -3, 16],
  ] as const;
  for (const [dx, dy, size] of heads) bloom(ctx, crown.x + dx, crown.y + dy, size * (0.92 + random() * 0.16), random);
  return sprite(el, width, height, true);
}
