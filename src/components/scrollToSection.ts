// Anchor links keep their href for middle-click and no-JS, but scrolling by
// hand leaves the hash out of the URL.
export function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}
