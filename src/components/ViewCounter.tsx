import { useEffect, useState } from 'react';
import { useLocale } from '../content/useLocale';

const SESSION_KEY = 'viewed';

async function fetchViews(): Promise<number | null> {
  let counted = false;
  try {
    counted = sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    /* storage unavailable */
  }
  const response = await fetch('/api/views', { method: counted ? 'GET' : 'POST' });
  if (!response.ok) return null;
  const { views } = (await response.json()) as { views: number };
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* storage unavailable */
  }
  return views;
}

export default function ViewCounter() {
  const { content, locale } = useLocale();
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchViews()
      .then((count) => {
        if (!cancelled) setViews(count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (views === null) return null;
  return <span className="tabular-nums">{content.footer.views(views.toLocaleString(locale))}</span>;
}
