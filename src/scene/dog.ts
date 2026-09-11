import * as THREE from 'three';
import * as paint from './paint';
import { seeded, TAU } from './stage';

// An Italian greyhound dozing sphinx-style, facing +x, painted as flat sprites
// in the same hand as the pot and the pothos. Sprite pixels are artwork
// pixels with y down; the body pivots on the ground under the dog's centre and
// the head on the top of the neck.
type Pt = [number, number];

const BODY = { width: 224, height: 112, ground: 100, cx: 112 };
const NECK_TOP: Pt = [158, 22];
const HEAD = { width: 92, height: 72, pivot: { x: 26, y: 46 } };
const EAR = { width: 26, height: 26, pivot: { x: 22, y: 4 } };

const COAT_LIT = '#b0b3c0';
const COAT = '#9a9dab';
const COAT_DARK = '#6a6d7c';
const COAT_DEEP = '#4f5161';
const CREAM = '#ece6da';
const CREAM_DARK = '#c8bfae';
const INK = '#24222a';
const COLLAR = '#c9382b';
const COLLAR_DARK = '#7e1f16';
const BRASS = '#e0bb55';

const outlineFade = (ctx: CanvasRenderingContext2D, pts: Pt[]) => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const g = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
  g.addColorStop(0, 'rgba(38,36,48,0.22)');
  g.addColorStop(1, 'rgba(38,36,48,0.8)');
  return g;
};

// Closed Catmull-Rom curve through the points; a repeated point makes a corner.
function blob(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  const n = pts.length;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
      p2[0],
      p2[1],
    );
  }
  ctx.closePath();
}

// Fills a blob lit from the upper left and inks its lower-right edge.
function fur(ctx: CanvasRenderingContext2D, pts: Pt[], lit: string, dark: string, outline = true) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const g = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
  g.addColorStop(0, lit);
  g.addColorStop(1, dark);
  blob(ctx, pts);
  ctx.fillStyle = g;
  ctx.fill();
  if (!outline) return;
  ctx.strokeStyle = outlineFade(ctx, pts);
  ctx.lineWidth = 1.1;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Soft radial tint clipped to a blob: cream chests, belly shade, thigh light.
function glaze(ctx: CanvasRenderingContext2D, pts: Pt[], x: number, y: number, r: number, color: string, alpha: number) {
  ctx.save();
  blob(ctx, pts);
  ctx.clip();
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

function tail(ctx: CanvasRenderingContext2D, from: Pt, c1: Pt, c2: Pt, to: Pt, r0: number, r1: number) {
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u ** 3 * from[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * to[0];
    const y = u ** 3 * from[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * to[1];
    const r = r0 + (r1 - r0) * t;
    ctx.fillStyle = 'rgba(38,36,48,0.7)';
    ctx.beginPath();
    ctx.arc(x, y, r + 0.7, 0, TAU);
    ctx.fill();
  }
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u ** 3 * from[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * to[0];
    const y = u ** 3 * from[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * to[1];
    const r = r0 + (r1 - r0) * t;
    ctx.fillStyle = t < 0.5 ? COAT_DARK : COAT;
    ctx.beginPath();
    ctx.arc(x, y - 0.4, r, 0, TAU);
    ctx.fill();
  }
}

// Per-artwork-pixel brightness noise so the flat fills carry the backdrop's
// painted grain.
function grain(ctx: CanvasRenderingContext2D, seed: number, amount: number) {
  const { width, height } = ctx.canvas;
  const px = ctx.getTransform().a;
  const image = ctx.getImageData(0, 0, width, height);
  const d = image.data;
  const random = seeded(seed);
  for (let by = 0; by < height; by += px) {
    for (let bx = 0; bx < width; bx += px) {
      const k = 1 + (random() - 0.5) * amount;
      for (let y = by; y < Math.min(height, by + px); y++) {
        for (let x = bx; x < Math.min(width, bx + px); x++) {
          const i = (y * width + x) * 4;
          if (!d[i + 3]) continue;
          d[i] = Math.min(255, d[i] * k);
          d[i + 1] = Math.min(255, d[i + 1] * k);
          d[i + 2] = Math.min(255, d[i + 2] * k);
        }
      }
    }
  }
  ctx.putImageData(image, 0, 0);
}

const TORSO: Pt[] = [
  [22, 58], [38, 48], [66, 43], [96, 46], [118, 44], [150, 14], [158, 10], [168, 22], [158, 40], [146, 56],
  [146, 74], [140, 94], [120, 100], [100, 96], [84, 84], [66, 84], [44, 94], [26, 98], [14, 82], [14, 68],
];
const THIGH: Pt[] = [[24, 50], [48, 47], [68, 58], [76, 76], [66, 92], [42, 97], [20, 90], [12, 72]];
const HIND_FOOT: Pt[] = [[50, 91], [74, 92], [92, 94], [98, 98], [94, 101], [72, 101], [50, 100]];
const FORELEG: Pt[] = [
  [126, 84], [140, 87], [160, 90], [180, 91], [192, 89], [204, 93], [207, 99], [200, 101], [184, 101], [160, 101], [138, 100], [124, 96],
];

function bodySprite(): paint.Sprite {
  const { el, ctx } = paint.canvas(BODY.width, BODY.height);
  tail(ctx, [22, 60], [0, 72], [2, 100], [62, 97], 3.2, 1.6);
  ctx.save();
  ctx.translate(-6, -5);
  fur(ctx, FORELEG, COAT_DARK, COAT_DEEP);
  ctx.restore();
  fur(ctx, TORSO, COAT_LIT, COAT_DARK);
  glaze(ctx, TORSO, 142, 78, 30, CREAM, 1);
  glaze(ctx, TORSO, 134, 94, 24, CREAM, 0.85);
  glaze(ctx, TORSO, 100, 98, 22, CREAM_DARK, 0.7);
  glaze(ctx, TORSO, 92, 80, 26, COAT_DEEP, 0.4);
  glaze(ctx, TORSO, 122, 60, 26, COAT_DEEP, 0.2);
  glaze(ctx, TORSO, 80, 46, 40, '#c8cbd6', 0.6);
  glaze(ctx, TORSO, 132, 46, 26, '#c8cbd6', 0.4);
  fur(ctx, THIGH, COAT_LIT, COAT_DARK);
  glaze(ctx, THIGH, 40, 62, 26, '#c4c7d2', 0.5);
  glaze(ctx, THIGH, 62, 88, 22, COAT_DEEP, 0.4);
  fur(ctx, HIND_FOOT, COAT_LIT, COAT_DARK);
  fur(ctx, FORELEG, COAT_LIT, COAT_DARK);
  glaze(ctx, FORELEG, 130, 100, 22, COAT_DEEP, 0.35);
  ctx.strokeStyle = 'rgba(38,36,48,0.5)';
  ctx.lineWidth = 0.9;
  for (const x of [195, 199]) {
    ctx.beginPath();
    ctx.moveTo(x, 95);
    ctx.lineTo(x + 2, 100);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(98, 96);
  ctx.lineTo(100, 100);
  ctx.stroke();
  grain(ctx, 5, 0.09);
  return paint.sprite(el, BODY.width, BODY.height, true);
}

// Head in its own sprite so it can nod on the neck; the stub below the pivot
// overlaps the torso's neck and the collar hides the seam.
const SKULL: Pt[] = [
  [18, 34], [21, 19], [32, 14], [44, 15], [60, 22], [78, 30], [82, 35], [78, 40], [62, 41], [46, 42],
  [36, 46], [26, 62], [4, 54], [18, 38],
];

function headSprite(): paint.Sprite {
  const { el, ctx } = paint.canvas(HEAD.width, HEAD.height);
  fur(ctx, SKULL, COAT_LIT, COAT_DARK);
  glaze(ctx, SKULL, 52, 44, 22, CREAM, 0.9);
  glaze(ctx, SKULL, 18, 60, 18, CREAM, 0.6);
  glaze(ctx, SKULL, 30, 16, 16, '#c4c7d2', 0.45);
  glaze(ctx, SKULL, 46, 30, 12, COAT_DEEP, 0.2);
  ctx.strokeStyle = 'rgba(38,36,48,0.35)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(48, 36);
  ctx.quadraticCurveTo(62, 38, 76, 37);
  ctx.stroke();
  paint.ellipse(ctx, 79, 33, 3.6, 3, 0.2, INK);
  paint.ellipse(ctx, 78, 32, 1.3, 0.8, 0, 'rgba(255,255,255,0.45)');
  paint.ellipse(ctx, 45, 23, 2.7, 1.4, 0.15, INK);
  paint.ellipse(ctx, 44.3, 22.6, 0.7, 0.5, 0, 'rgba(255,255,255,0.8)');
  ctx.strokeStyle = 'rgba(38,36,48,0.55)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(41.5, 20.5);
  ctx.quadraticCurveTo(45, 19, 48.5, 20.5);
  ctx.stroke();
  const band: Pt[] = [[12, 50], [30, 60], [26, 66], [8, 56]];
  fur(ctx, band, COLLAR, COLLAR_DARK, false);
  ctx.strokeStyle = 'rgba(60,20,14,0.7)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  paint.ellipse(ctx, 26, 67, 2.4, 2.8, 0, BRASS, 'rgba(90,60,10,0.8)');
  paint.ellipse(ctx, 25.3, 66.2, 0.8, 0.8, 0, 'rgba(255,255,230,0.8)');
  grain(ctx, 9, 0.09);
  return paint.sprite(el, HEAD.width, HEAD.height, true);
}

const EAR_SHAPE: Pt[] = [[22, 4], [15, 2], [9, 7], [4, 16], [6, 22], [11, 19], [18, 10]];

function earSprite(): paint.Sprite {
  const { el, ctx } = paint.canvas(EAR.width, EAR.height);
  fur(ctx, EAR_SHAPE, COAT, COAT_DEEP);
  const fold: Pt[] = [[17, 6], [12, 8], [8, 15], [9, 19], [13, 15]];
  fur(ctx, fold, '#b8a2a4', '#7d666c', false);
  grain(ctx, 3, 0.08);
  return paint.sprite(el, EAR.width, EAR.height, true);
}

function billboard(sprite: paint.Sprite, order: number, pivot: { x: number; y: number }) {
  const geometry = new THREE.PlaneGeometry(sprite.width, sprite.height);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, p.getX(i) + sprite.width / 2 - pivot.x, sprite.height / 2 - p.getY(i) - pivot.y, 0);
  }
  const material = new THREE.MeshBasicMaterial({
    map: sprite.texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = order;
  mesh.frustumCulled = false;
  return mesh;
}

export function createDog() {
  const group = new THREE.Group();
  const shadow = billboard(paint.shadow(), 7, { x: 30, y: 8 });
  shadow.scale.set(3.6, 1.1, 1);
  shadow.position.set(-4, -2, 0);
  const body = billboard(bodySprite(), 8, { x: BODY.cx, y: BODY.ground });
  const neck = new THREE.Group();
  const neckRest = { x: NECK_TOP[0] - BODY.cx, y: NECK_TOP[1] - BODY.ground };
  neck.position.set(neckRest.x, neckRest.y, 0);
  const head = billboard(headSprite(), 9, HEAD.pivot);
  const ear = billboard(earSprite(), 10, EAR.pivot);
  ear.position.set(25 - HEAD.pivot.x, 17 - HEAD.pivot.y, 0);
  neck.add(head, ear);
  group.add(shadow, body, neck);

  const meshes = [shadow, body, head, ear];
  return {
    group,
    update(seconds: number) {
      const breath = 1 + 0.012 * Math.sin((TAU * seconds) / 4.6);
      body.scale.y = breath;
      neck.position.y = neckRest.y * breath;
      neck.rotation.z = 0.035 * Math.sin(seconds * 0.42) + 0.015 * Math.sin(seconds * 1.15 + 1);
      const flick = (seconds % 9) - 7.4;
      ear.rotation.z = flick > 0 && flick < 0.5 ? 0.35 * Math.sin((flick / 0.5) * Math.PI) : 0;
    },
    dispose() {
      for (const mesh of meshes) {
        mesh.geometry.dispose();
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.map?.dispose();
        material.dispose();
      }
    },
  };
}
