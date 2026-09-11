import { useEffect, useRef, useState } from 'react';
import type { Scene } from '../scene/createScene';

export default function Backdrop() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let scene: Scene | null = null;
    let cancelled = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;

    const applyPause = () => scene?.setPaused(reduced.matches || !visible || document.hidden);

    const observer = new ResizeObserver(([entry]) => {
      scene?.resize(entry.contentRect.width, entry.contentRect.height);
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      applyPause();
    });

    import('../scene/createScene')
      .then(({ createScene }) => createScene(host))
      .then((created) => {
        if (cancelled) {
          created.dispose();
          return;
        }
        scene = created;
        const { width, height } = host.getBoundingClientRect();
        scene.resize(width, height);
        applyPause();
        observer.observe(host);
        intersection.observe(host);
        setReady(true);
      })
      .catch((error) => console.error('hero scene failed, keeping the poster', error));

    reduced.addEventListener('change', applyPause);
    document.addEventListener('visibilitychange', applyPause);
    return () => {
      cancelled = true;
      reduced.removeEventListener('change', applyPause);
      document.removeEventListener('visibilitychange', applyPause);
      observer.disconnect();
      intersection.disconnect();
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className="backdrop" aria-hidden="true">
      <img
        className="backdrop-poster"
        src="/art/backdrop.webp"
        alt=""
        width={1672}
        height={941}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        style={{ opacity: ready ? 0 : 1 }}
      />
    </div>
  );
}
