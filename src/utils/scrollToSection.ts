export function scrollToSection(hash: string) {
  if (!hash || typeof document === 'undefined') {
    return;
  }

  const targetSelector = hash.startsWith('#') ? hash : `#${hash}`;
  const targetElement = document.querySelector<HTMLElement>(targetSelector);
  if (!targetElement) {
    return;
  }

  targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', targetSelector);
  }
}
