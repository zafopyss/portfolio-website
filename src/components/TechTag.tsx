import type { MouseEvent } from 'react';
import * as icons from 'simple-icons';
import { azureDevOps, loki, type Brand } from './brandIcons';

// Stack labels to their marks. Missing ones get a plain tag.
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
  Loki: loki,
  'Azure DevOps': azureDevOps,
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
  const color = brand ? accent(brand.hex) : '#5b5f6b';

  // Write the spotlight straight to the style attribute: React state here would
  // re-render the tag on every mousemove and starve the hover transition.
  const track = (event: MouseEvent<HTMLLIElement>) => {
    const tag = event.currentTarget;
    const rect = tag.getBoundingClientRect();
    tag.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    tag.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <li
      className="tech-tag"
      style={{ ['--brand' as string]: color }}
      onMouseMove={track}
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
