import { useLocale } from '../content/useLocale';
import { links } from '../content/types';
import Arrow from './Arrow';

export default function Header() {
  const { content, locale, toggle } = useLocale();
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-[90px] items-center justify-between border-b border-white/15 px-[5%] text-white">
      <a href="/" className="text-[1.6rem] font-semibold tracking-[-0.06em] sm:text-[1.9rem]" aria-label="Eliot Walter">
        eliot<span className="font-normal">walter</span>
        <span className="text-accent">.</span>
      </a>
      <nav className="lang-fade flex items-center gap-5 text-sm" aria-label="Navigation">
        <button
          type="button"
          onClick={toggle}
          className="rounded-full border border-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white hover:text-white"
          aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
        >
          {content.header.switchTo}
        </button>
        <a href={`mailto:${links.email}`} className="btn btn-light">
          {content.header.contact}
          <Arrow />
        </a>
      </nav>
    </header>
  );
}
