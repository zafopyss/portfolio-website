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

// Dark brand colours vanish on the light theme, so lift them a little.
function accent(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.2 ? '#5b5f6b' : `#${hex}`;
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
