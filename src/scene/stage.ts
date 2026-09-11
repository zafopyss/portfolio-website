// Everything in the hero lives in the artwork's pixel space, y pointing down.
export const STAGE = { width: 1672, height: 941 } as const;

export type Placement = { scale: number; x: number; y: number };

// Artwork x pinned to the hero's right edge. Wide screens keep the desk and
// tree; phones slide left so the copy sits over sky and skyline. The crop is
// pinned to the ground so the dog and the pot stay in frame on wide screens:
// whatever overflows is sky, never terrace.
const focusX = (viewportWidth: number) => (viewportWidth < 640 ? 980 : STAGE.width);

export function place(width: number, height: number): Placement {
  const scale = Math.max(width / STAGE.width, height / STAGE.height);
  const x = Math.min(0, Math.max(width - STAGE.width * scale, width - focusX(width) * scale));
  const y = height - STAGE.height * scale;
  return { scale, x, y };
}

export const smoothstep = (value: number) => {
  const a = Math.max(0, Math.min(1, value));
  return a * a * (3 - 2 * a);
};

export const TAU = Math.PI * 2;

// Deterministic PRNG so every visitor sees the same garden.
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
