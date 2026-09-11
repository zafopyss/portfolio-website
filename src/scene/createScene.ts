import * as THREE from 'three';
import { createDog } from './dog';
import { createEditor } from './editor';
import { createMountain } from './mountain';
import * as paint from './paint';
import * as plants from './plants';
import { place, seeded, smoothstep, STAGE, TAU } from './stage';

const LOOP_SECONDS = 96;
const FRAME_INTERVAL = 1000 / 30;

const CLOUD_LAYERS = [
  { spacing: 836, width: 270, y: 277, offset: 50, order: 1, opacity: 0.65 },
  { spacing: 836, width: 155, y: 325, offset: 455, order: 1, opacity: 0.55 },
  { spacing: 1672, width: 790, y: 30, offset: 65, order: 2, opacity: 0.98 },
  { spacing: 1672, width: 400, y: 95, offset: 1110, order: 2, opacity: 0.9 },
];

const ART = {
  backdrop: '/art/backdrop.webp',
  cloud: '/art/cloud.webp',
  branches: '/art/branches.webp',
  canopy: '/art/canopy.webp',
};

const VINE_ORIGIN = { x: 1412, y: 232 };
const CUP = { x: 1496, y: 662 };
// Centre of the pot's base, on the sunlit ledge of the stone pillar.
const WALL_POT = { x: 1041, y: 789, scale: 0.82 };
// Inner corners of the laptop screen, clockwise from top-left.
const SCREEN = [
  [1312, 601],
  [1403, 599],
  [1383, 680],
  [1290, 672],
] as const;
const DOG_AT = { x: 1118, ground: 938, scale: 0.85 };
const LAKE = { x: 540, y: 700, width: 400, height: 70 };

export type Scene = {
  resize: (width: number, height: number) => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

type Actor = (seconds: number) => void;

export async function createScene(host: HTMLElement): Promise<Scene> {
  const loader = new THREE.TextureLoader();
  const textures = Object.fromEntries(
    await Promise.all(
      Object.entries(ART).map(async ([key, url]) => {
        const texture = await loader.loadAsync(url);
        texture.colorSpace = THREE.SRGBColorSpace;
        return [key, texture] as const;
      }),
    ),
  ) as Record<keyof typeof ART, THREE.Texture>;

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, STAGE.width, 0, STAGE.height, -100, 100);
  camera.position.z = 10;

  const disposables: { dispose(): void }[] = [];
  const actors: Actor[] = [];

  function material(texture: THREE.Texture, opacity = 1) {
    const m = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    disposables.push(m);
    return m;
  }

  // Top-left anchored quad in artwork space (PlaneGeometry's +Y row becomes y = 0).
  function quad(texture: THREE.Texture, width: number, height: number, order: number, segmentsX = 1, segmentsY = 1) {
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + width / 2, height / 2 - p.getY(i), 0);
    disposables.push(geometry);
    const mesh = new THREE.Mesh(geometry, material(texture));
    mesh.renderOrder = order;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  }

  // Quad whose origin sits on `pivot` (sprite pixels, default centre) so
  // rotation and scale turn around that point.
  function billboard(sprite: paint.Sprite, order: number, scale = 1, pivot = { x: sprite.width / 2, y: sprite.height / 2 }) {
    const geometry = new THREE.PlaneGeometry(sprite.width, sprite.height);
    const p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.setXYZ(i, (p.getX(i) + sprite.width / 2 - pivot.x) * scale, (sprite.height / 2 - p.getY(i) - pivot.y) * scale, 0);
    }
    disposables.push(geometry, sprite.texture);
    const mesh = new THREE.Mesh(geometry, material(sprite.texture));
    mesh.renderOrder = order;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  }

  quad(textures.backdrop, STAGE.width, STAGE.height, 0);

  // Mont Blanc behind the city, built in three.js and clipped to the sky.
  const mountain = createMountain(textures.backdrop);
  scene.add(mountain.object);
  disposables.push(mountain);
  actors.push((seconds) => mountain.update(seconds));

  const cloudImage = textures.cloud.image as { width: number; height: number };
  const cloudRatio = cloudImage.width / cloudImage.height;
  const clouds: { mesh: THREE.Mesh; start: number; spacing: number }[] = [];
  for (const layer of CLOUD_LAYERS) {
    for (let i = -2; i <= Math.ceil(STAGE.width / layer.spacing) + 1; i++) {
      const mesh = quad(textures.cloud, layer.width, layer.width / cloudRatio, layer.order);
      (mesh.material as THREE.MeshBasicMaterial).opacity = layer.opacity;
      mesh.position.y = layer.y;
      clouds.push({ mesh, start: i * layer.spacing + layer.offset, spacing: layer.spacing });
    }
  }
  actors.push((seconds) => {
    const t = seconds % LOOP_SECONDS;
    for (const cloud of clouds) cloud.mesh.position.x = cloud.start + (t * cloud.spacing) / LOOP_SECONDS;
  });

  const branches = quad(textures.branches, 492, 560, 3);
  branches.position.set(1180, 0, 0);

  const canopy = quad(textures.canopy, 792, 500, 4, 24, 14);
  canopy.position.set(880, 0, 0);
  const rest = Float32Array.from(canopy.geometry.attributes.position.array);
  const weights = Array.from({ length: rest.length / 3 }, (_, i) => {
    const x = rest[i * 3] + 880;
    const y = rest[i * 3 + 1];
    return smoothstep(Math.hypot((x - 1575) * 0.9, y - 410) / 570);
  });
  actors.push((seconds) => {
    const p = canopy.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = rest[i * 3];
      const y = rest[i * 3 + 1];
      const flexibility = weights[i];
      const gust = 6.4 * Math.sin((TAU * seconds) / 8) + 2.4 * Math.sin((TAU * seconds) / 12 + x * 0.003);
      const ripple = 1.3 * Math.sin((TAU * seconds) / 3 + x * 0.055 + y * 0.041);
      p.setXYZ(
        i,
        x + flexibility * (gust + ripple),
        y + flexibility * (2.2 * Math.sin((TAU * seconds) / 8 + 0.5) + 0.65 * Math.sin((TAU * seconds) / 4 + x * 0.04)),
        0,
      );
    }
    p.needsUpdate = true;
  });

  // Passionflower vine climbing the trunk.
  const vineSprite = paint.vine();
  const vineMesh = quad(vineSprite.texture, paint.VINE.width, paint.VINE.height, 5);
  vineMesh.position.set(VINE_ORIGIN.x, VINE_ORIGIN.y, 0);
  disposables.push(vineSprite.texture);
  const flowerSprite = paint.passionflower();
  const flowers = [0.12, 0.34, 0.58, 0.8, 0.95].map((t, i) => {
    const p = paint.vinePoint(t);
    const mesh = billboard(flowerSprite, 6, 0.8 + (i % 2) * 0.25);
    mesh.position.set(VINE_ORIGIN.x + p.x + (i % 2 ? -18 : 20), VINE_ORIGIN.y + p.y - 4, 0);
    return { mesh, phase: i * 1.3 };
  });
  actors.push((seconds) => {
    for (const flower of flowers) {
      flower.mesh.rotation.z = 0.07 * Math.sin(seconds * 1.1 + flower.phase);
      const breath = 1 + 0.025 * Math.sin(seconds * 0.9 + flower.phase);
      flower.mesh.scale.set(breath, breath, 1);
    }
  });

  // Alpine plants in the bushes and along the terrace.
  const clusters = [
    { x: 60, y: 800, seed: 18, scale: 1.2 },
    { x: 175, y: 870, seed: 11, scale: 1.15 },
    { x: 290, y: 830, seed: 19, scale: 1.1 },
    { x: 400, y: 895, seed: 12, scale: 1.05 },
    { x: 560, y: 905, seed: 13, scale: 0.95 },
    { x: 760, y: 880, seed: 14, scale: 1 },
    { x: 1560, y: 900, seed: 17, scale: 1 },
  ].map((c, i) => {
    const mesh = billboard(plants.bed(c.seed), 8, c.scale);
    mesh.position.set(c.x, c.y, 0);
    return { mesh, phase: i * 0.9 };
  });
  actors.push((seconds) => {
    for (const cluster of clusters) cluster.mesh.rotation.z = 0.02 * Math.sin(seconds * 0.8 + cluster.phase);
  });

  // A flock crossing the sky now and then.
  const birdSprite = paint.bird();
  const birds = Array.from({ length: 6 }, (_, i) => ({
    mesh: billboard(birdSprite, 2, 0.7 + (i % 3) * 0.12),
    offset: [0, 40, 75, 120, 150, 195][i],
    lift: [0, -18, -30, -12, -40, -22][i],
    phase: i * 0.7,
  }));
  const FLOCK_SPAN = STAGE.width + 900;
  actors.push((seconds) => {
    const base = ((seconds * 38) % (FLOCK_SPAN * 2)) - 300;
    for (const bird of birds) {
      const x = base + bird.offset;
      const y = 235 + bird.lift + 22 * Math.sin(seconds * 0.35 + bird.phase);
      bird.mesh.position.set(x, y, 0);
      bird.mesh.scale.y = 0.25 + 0.75 * Math.abs(Math.sin(seconds * 6 + bird.phase));
      bird.mesh.visible = x > -100 && x < STAGE.width + 100;
    }
  });

  // The laptop is writing Django.
  const editor = createEditor();
  const screenGeometry = new THREE.BufferGeometry();
  screenGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(SCREEN.flatMap(([x, y]) => [x, y, 0]), 3),
  );
  screenGeometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
  screenGeometry.setIndex([0, 1, 2, 0, 2, 3]);
  disposables.push(screenGeometry, editor.texture);
  const screen = new THREE.Mesh(screenGeometry, material(editor.texture, 0.92));
  screen.renderOrder = 6;
  screen.frustumCulled = false;
  scene.add(screen);
  actors.push((seconds) => editor.update(seconds));

  // A stoneware pot of nasturtiums on the pillar, coffee on the desk.
  const cupShadow = billboard(paint.shadow(), 5, 1);
  cupShadow.position.set(CUP.x + 36, CUP.y + 42, 0);
  // paint.pot() draws its bowl around x = 33 with the base ellipse at y = 74.
  // Sun is upper left, so the pot throws its shadow down and to the right.
  const potShadow = billboard(paint.shadow(), 6, WALL_POT.scale * 1.15);
  potShadow.position.set(WALL_POT.x + 9, WALL_POT.y + 3, 0);
  const potMesh = billboard(paint.pot(), 7, WALL_POT.scale, { x: 33, y: 74 });
  potMesh.position.set(WALL_POT.x, WALL_POT.y, 0);
  const blooms = billboard(plants.nasturtium(), 8, WALL_POT.scale, plants.NASTURTIUM.crown);
  blooms.position.set(WALL_POT.x, WALL_POT.y - 68 * WALL_POT.scale, 0);
  actors.push((seconds) => {
    blooms.rotation.z = 0.012 * Math.sin(seconds * 0.6);
  });
  const cupMesh = billboard(paint.coffeeCup(), 6, 1, { x: 0, y: 0 });
  cupMesh.position.set(CUP.x, CUP.y, 0);
  const STEAM = { x: CUP.x + 26, y: CUP.y + 6 };

  // The greyhound, lying in front of the stool.
  const dog = createDog();
  dog.group.position.set(DOG_AT.x, DOG_AT.ground, 0);
  dog.group.scale.setScalar(DOG_AT.scale);
  scene.add(dog.group);
  disposables.push(dog);
  actors.push((seconds) => dog.update(seconds));

  // Steam from the coffee.
  const puffSprite = paint.puff();
  const puffs = Array.from({ length: 4 }, (_, i) => ({ mesh: billboard(puffSprite, 7), phase: i / 4 }));
  actors.push((seconds) => {
    for (const p of puffs) {
      const life = (seconds / 3.2 + p.phase) % 1;
      p.mesh.position.set(STEAM.x + 7 * Math.sin(seconds * 1.4 + p.phase * 7), STEAM.y - 85 * life, 0);
      const grow = 0.5 + life * 1.1;
      p.mesh.scale.set(grow, grow, 1);
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(life * Math.PI) * 0.85;
    }
  });

  // Petals and oak leaves coming down from the canopy. Each one tumbles: the
  // sideways scale is the cosine of its own spin, so it reads as turning
  // edge-on rather than skidding around flat.
  const random = seeded(3);
  const fallingSprites = [
    paint.petal('#efd2f5'),
    paint.petal('#ffd2e4'),
    paint.petal('#f7e2c0'),
    paint.oakLeaf(0.25),
    paint.oakLeaf(0.7),
  ];
  const falling = Array.from({ length: 12 }, (_, i) => {
    const mesh = billboard(fallingSprites[i % fallingSprites.length], 7, 0.75 + random() * 0.45);
    return {
      mesh,
      x: 1140 + random() * 510,
      drop: random(),
      vy: 15 + random() * 13,
      vx: -5 - random() * 13,
      tumble: 0.9 + random() * 1.6,
      lean: (random() - 0.5) * 1.4,
      sway: random() * TAU,
      swayWidth: 14 + random() * 16,
      scale: 0.75 + random() * 0.45,
    };
  });
  actors.push((seconds) => {
    for (const p of falling) {
      const cycle = (STAGE.height + 80) / p.vy;
      const age = ((seconds + p.drop * cycle) % cycle);
      const y = -40 + age * p.vy;
      const phase = seconds * p.tumble + p.sway;
      p.mesh.position.set(p.x + age * p.vx + p.swayWidth * Math.sin(phase * 0.55), y, 0);
      p.mesh.rotation.z = p.lean + 0.35 * Math.sin(phase * 0.8);
      p.mesh.scale.set(p.scale * Math.cos(phase), p.scale, 1);
      p.mesh.visible = y < STAGE.height + 20;
    }
  });

  // Sun catching the lake.
  const sparkleSprite = paint.sparkle();
  const sparkles = Array.from({ length: 10 }, () => ({
    mesh: billboard(sparkleSprite, 1),
    x: LAKE.x + random() * LAKE.width,
    y: LAKE.y + random() * LAKE.height,
    phase: random() * TAU,
    speed: 1.2 + random() * 1.4,
  }));
  actors.push((seconds) => {
    for (const s of sparkles) {
      s.mesh.position.set(s.x, s.y, 0);
      const glow = Math.max(0, Math.sin(seconds * s.speed + s.phase)) ** 3;
      (s.mesh.material as THREE.MeshBasicMaterial).opacity = glow * 0.85;
    }
  });

  let frame = 0;
  let last = 0;
  let time = 0;
  let paused = false;

  function paint_(seconds: number) {
    for (const actor of actors) actor(seconds);
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    frame = 0;
    if (paused) return;
    if (!last) last = now;
    if (now - last >= FRAME_INTERVAL) {
      time += Math.min((now - last) / 1000, 0.15);
      last = now;
      paint_(time);
    }
    frame = requestAnimationFrame(tick);
  }

  function resume() {
    cancelAnimationFrame(frame);
    last = 0;
    if (!paused) frame = requestAnimationFrame(tick);
  }

  paint_(0);

  return {
    resize(width, height) {
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const { scale, x, y } = place(width, height);
      camera.left = -x / scale;
      camera.right = camera.left + width / scale;
      camera.top = -y / scale;
      camera.bottom = camera.top + height / scale;
      camera.updateProjectionMatrix();
      paint_(time);
    },
    setPaused(next) {
      paused = next;
      resume();
    },
    dispose() {
      cancelAnimationFrame(frame);
      for (const d of disposables) d.dispose();
      for (const t of Object.values(textures)) t.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
