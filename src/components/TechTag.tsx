import { useState, type MouseEvent } from 'react';
import * as icons from 'simple-icons';

type Brand = { path: string; hex: string };

// Stack labels to simple-icons entries. Missing ones get a plain tag.
const BRANDS: Record<string, Brand> = {
  Django: icons.siDjango,
  PostgreSQL: icons.siPostgresql,
  Keycloak: icons.siKeycloak,
  MinIO: icons.siMinio,
  Docker: icons.siDocker,
  FastAPI: icons.siFastapi,
  'Next.js': icons.siNextdotjs,
  Celery: icons.siCelery,
  Redis: icons.siRedis,
  k3s: icons.siK3s,
  Traefik: icons.siTraefikproxy,
  Grafana: icons.siGrafana,
  Tailscale: icons.siTailscale,
  Python: icons.siPython,
  TypeScript: icons.siTypescript,
  React: icons.siReact,
  Kubernetes: icons.siKubernetes,
};

// Dark brand colours vanish on the light theme. Lift them along their own hue
// rather than replacing them with grey, so Django stays green.
function accent(hex: string) {
  const channels = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lightness = (Math.max(...channels) + Math.min(...channels)) / 2;
  if (lightness >= 0.3) return `#${hex}`;
  const scale = 0.34 / Math.max(lightness, 0.04);
  return `#${channels.map((c) => Math.round(Math.min(1, c * scale) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export default function TechTag({ name }: { name: string }) {
  const brand = BRANDS[name];
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);
  const color = brand ? accent(brand.hex) : '#5b5f6b';

  const track = (event: MouseEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <li
      className="tech-tag"
      style={{ ['--brand' as string]: color, ['--spot-x' as string]: `${spot?.x ?? 0}px`, ['--spot-y' as string]: `${spot?.y ?? 0}px` }}
      onMouseMove={track}
      onMouseLeave={() => setSpot(null)}
    >
      {brand && (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="tech-tag-icon">
          <path d={brand.path} />
        </svg>
      )}
      <span>{name}</span>
    </li>
  );
}
