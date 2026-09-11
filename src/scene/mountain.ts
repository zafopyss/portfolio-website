import * as THREE from 'three';
import { seeded, STAGE } from './stage';

// The Mont Blanc massif behind the lake city: a few ridge rows of relief
// geometry, lit from the upper left, hazed toward the sky pixel beneath each
// fragment and clipped to the painted skyline so the hills and towers stay in
// front. Everything is in artwork space, y down, z toward the camera.
type Peak = { x: number; height: number; width: number };
type Ridge = { peaks: Peak[]; floor: number; z: number; haze: number; seed: number; jag: number };

const FOOT = { left: 700, right: 1260, bottom: 680, taper: 90 };
const SUMMIT = 468;
const SNOWLINE = 0.55;
const SCAN = { top: 404, bottom: 700 };
const CELL = 3;
const COLUMN = 2;
const ROWS = 32;

const RIDGES: Ridge[] = [
  {
    seed: 21,
    floor: 600,
    z: -3,
    haze: 0.84,
    jag: 4,
    peaks: [
      { x: 775, height: 92, width: 95 },
      { x: 1205, height: 96, width: 75 },
    ],
  },
  {
    seed: 22,
    floor: 600,
    z: -2,
    haze: 0.72,
    jag: 9,
    peaks: [
      { x: 962, height: 66, width: 178 },
      { x: 941, height: 58, width: 70 },
      { x: 908, height: 11, width: 20 },
      { x: 864, height: 24, width: 40 },
      { x: 806, height: 18, width: 52 },
      { x: 1008, height: 30, width: 14 },
      { x: 1031, height: 44, width: 9 },
      { x: 1050, height: 36, width: 12 },
      { x: 1079, height: 48, width: 8 },
      { x: 1097, height: 26, width: 16 },
      { x: 1126, height: 40, width: 11 },
      { x: 1155, height: 22, width: 14 },
      { x: 1180, height: 14, width: 18 },
    ],
  },
  {
    seed: 23,
    floor: 600,
    z: -1,
    haze: 0.7,
    jag: 4,
    peaks: [
      { x: 860, height: 58, width: 80 },
      { x: 1085, height: 52, width: 70 },
    ],
  },
];

const VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vPos;
  void main() {
    vNormal = normal;
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D backdrop;
  uniform sampler2D skyline;
  uniform vec2 stage;
  uniform vec3 light;
  uniform vec3 rock;
  uniform vec3 snow;
  uniform vec3 sun;
  uniform vec3 ambient;
  uniform float haze;
  uniform float floorY;
  uniform float summitY;
  uniform float snowline;
  uniform float cell;
  uniform float seconds;
  varying vec3 vNormal;
  varying vec2 vPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float grain(vec2 p) {
    vec2 i = floor(p);
    vec2 f = p - i;
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    float cut = texture2D(skyline, vec2((floor(vPos.x) + 0.5) / stage.x, 0.5)).r;
    if (vPos.y >= cut) discard;

    vec2 block = floor(vPos / cell);
    float dither = hash(block) - 0.5;
    vec3 n = normalize(vNormal);

    float diffuse = max(dot(n, light), 0.0);
    float bands = floor(diffuse * 5.0 + dither * 0.6) / 5.0;

    float altitude = (floorY - vPos.y) / (floorY - summitY);
    float patches = grain(block * 0.12) + 0.4 * grain(block * 0.45) - 0.7;
    float cover = 0.9 * (altitude - snowline) + 0.12 * patches + 0.45 * max(-n.y, 0.0) - 0.55 * abs(n.x) + 0.6 * smoothstep(0.6, 1.0, altitude);
    float snowy = smoothstep(-0.04, 0.04, cover + dither * 0.05);

    // Haze is mixed after the sRGB transfer, like paint, so dark rock fades
    // as gently as snow instead of punching through the sky.
    vec3 lit = sRGBTransferOETF(vec4(mix(rock, snow, snowy) * (ambient + 0.65 * sun * bands), 1.0)).rgb;
    vec3 sky = sRGBTransferOETF(texture2D(backdrop, vec2(vPos.x / stage.x, 1.0 - vPos.y / stage.y))).rgb;
    float drift = 0.02 * sin(seconds * 0.07 + vPos.x * 0.011);
    float fog = clamp(haze + 0.2 * (1.0 - altitude) + drift, 0.0, 0.97);
    gl_FragColor = vec4(mix(lit, sky, fog), 1.0);
  }
`;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const fade = (t: number) => t * t * (3 - 2 * t);

function lattice(seed: number) {
  const random = seeded(seed);
  const table = Float32Array.from({ length: 256 }, () => random());
  return (i: number, j: number) => table[(i * 73 + j * 151) & 255];
}

function noise(at: (i: number, j: number) => number) {
  return (x: number, y: number) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const u = fade(x - i);
    const v = fade(y - j);
    const top = at(i, j) + (at(i + 1, j) - at(i, j)) * u;
    const bottom = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * u;
    return top + (bottom - top) * v - 0.5;
  };
}

function fbm(sample: (x: number, y: number) => number, octaves: number) {
  return (x: number, y: number) => {
    let sum = 0;
    let amplitude = 1;
    let total = 0;
    for (let o = 0; o < octaves; o++) {
      sum += amplitude * sample(x, y);
      total += amplitude;
      x = x * 2.03 + 7.1;
      y = y * 2.03 + 3.7;
      amplitude *= 0.5;
    }
    return sum / total;
  };
}

const gaussian = (x: number, peak: Peak) => Math.exp(-(((x - peak.x) / peak.width) ** 2));
const envelope = (x: number) => fade(clamp01((x - FOOT.left) / FOOT.taper)) * fade(clamp01((FOOT.right - x) / FOOT.taper));

// Screen y of the silhouette and relief depth of the face beneath it. Spurs
// run down from every peak and widen as they descend, so the light from the
// left picks out one flank of each aiguille and shadows the other.
function shape(ridge: Ridge) {
  const rough = fbm(noise(lattice(ridge.seed)), 4);
  const top = (x: number) => {
    const elevation = envelope(x) * ridge.peaks.reduce((sum, peak) => sum + peak.height * gaussian(x, peak), 0);
    const teeth = rough(x / 22, 0.5) * ridge.jag * 2 * clamp01(elevation / 40);
    return ridge.floor - elevation - teeth;
  };
  const depth = (x: number, y: number) => {
    let z = -(ridge.floor - y) * 0.55;
    for (const peak of ridge.peaks) {
      const descent = clamp01((y - top(peak.x)) / (ridge.floor - top(peak.x)));
      const width = peak.width * (0.7 + 1.6 * descent);
      z += peak.width * 1.1 * Math.exp(-(((x - peak.x) / width) ** 2));
    }
    return z + 30 * rough(x / 70, y / 40);
  };
  const normal = (x: number, y: number) => {
    const dx = (depth(x + 1, y) - depth(x - 1, y)) / 2;
    const dy = (depth(x, y + 1) - depth(x, y - 1)) / 2;
    return new THREE.Vector3(-dx, -dy, 1).normalize();
  };
  return { top, depth, normal };
}

function heightfield(ridge: Ridge) {
  const { top, depth, normal } = shape(ridge);
  const columns = Math.ceil((FOOT.right - FOOT.left) / COLUMN) + 1;
  const positions: number[] = [];
  const normals: number[] = [];
  const index: number[] = [];
  for (let c = 0; c < columns; c++) {
    const x = FOOT.left + c * COLUMN;
    const crest = top(x);
    for (let r = 0; r <= ROWS; r++) {
      const y = crest + ((FOOT.bottom - crest) * r) / ROWS;
      // Relief only feeds the normals; scaled down so it stays inside the
      // camera's +-100 depth range.
      positions.push(x, y, depth(x, y) * 0.1);
      const n = normal(x, y);
      normals.push(n.x, n.y, n.z);
    }
  }
  const stride = ROWS + 1;
  for (let c = 0; c < columns - 1; c++) {
    for (let r = 0; r < ROWS; r++) {
      const a = c * stride + r;
      const b = a + stride;
      index.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(index);
  return geometry;
}

// Sky is a smooth saturated blue; anything duller, darker or less blue below
// the scan start is hill, tower or foliage. The cut sits a pixel above the
// first such pixel so the painted edge never shows a halo.
function isSky(r: number, g: number, b: number, y: number) {
  return b >= 232 && r <= 175 && g >= 168 + 0.12 * (y - 380) && b - r >= 0.4 * b;
}

function skylineTexture(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = STAGE.width;
  canvas.height = STAGE.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.drawImage(image, 0, 0, STAGE.width, STAGE.height);
  const band = ctx.getImageData(0, SCAN.top, STAGE.width, SCAN.bottom - SCAN.top).data;
  const cut = new Float32Array(STAGE.width).fill(SCAN.bottom);
  for (let x = 0; x < STAGE.width; x++) {
    for (let y = SCAN.top; y < SCAN.bottom; y++) {
      const i = ((y - SCAN.top) * STAGE.width + x) * 4;
      if (!isSky(band[i], band[i + 1], band[i + 2], y)) {
        cut[x] = y - 1;
        break;
      }
    }
  }
  const texture = new THREE.DataTexture(cut, STAGE.width, 1, THREE.RedFormat, THREE.FloatType);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createMountain(backdrop: THREE.Texture) {
  const object = new THREE.Group();
  const skyline = skylineTexture(backdrop.image as HTMLImageElement);
  const materials = RIDGES.map(
    (ridge) =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          backdrop: { value: backdrop },
          skyline: { value: skyline },
          stage: { value: new THREE.Vector2(STAGE.width, STAGE.height) },
          light: { value: new THREE.Vector3(-0.75, -0.4, 0.5).normalize() },
          rock: { value: new THREE.Color('#3d5583') },
          snow: { value: new THREE.Color('#f6f7fb') },
          sun: { value: new THREE.Color('#ffeed8') },
          ambient: { value: new THREE.Color('#9db2dc') },
          haze: { value: ridge.haze },
          floorY: { value: ridge.floor },
          summitY: { value: SUMMIT },
          snowline: { value: SNOWLINE },
          cell: { value: CELL },
          seconds: { value: 0 },
        },
      }),
  );
  const geometries = RIDGES.map(heightfield);
  RIDGES.forEach((ridge, i) => {
    const mesh = new THREE.Mesh(geometries[i], materials[i]);
    mesh.position.z = ridge.z;
    mesh.renderOrder = 1;
    mesh.frustumCulled = false;
    object.add(mesh);
  });
  return {
    object,
    update(seconds: number) {
      for (const m of materials) m.uniforms.seconds.value = seconds;
    },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      skyline.dispose();
    },
  };
}
