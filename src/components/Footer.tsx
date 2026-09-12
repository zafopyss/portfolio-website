import { useLocale } from '../content/useLocale';
import { links } from '../content/types';
import Arrow from './Arrow';
import Reveal from './Reveal';
import ViewCounter from './ViewCounter';
import { scrollToSection } from './scrollToSection';

// Both resumes stay on offer whichever language the page is in.
const RESUMES = ['fr', 'en'] as const;

export default function Footer() {
  const { footer } = useLocale().content;
  const external = [
    { label: 'GitHub', href: links.github },
    { label: 'LinkedIn', href: links.linkedin },
    { label: 'Email', href: `mailto:${links.email}` },
    ...RESUMES.map((code) => ({ label: `${footer.resume} ${code.toUpperCase()}`, href: links.resume[code] })),
    { label: footer.source, href: links.source },
  ];
  return (
    <footer className="section border-t border-line">
      <Reveal className="flex flex-col gap-4 pb-20">
        <p className="text-muted">{footer.prompt}</p>
        <a
          href={`mailto:${links.email}`}
          className="heading-xl flex w-fit items-baseline gap-3 transition-colors hover:text-link"
        >
          {footer.cta}
          <Arrow className="text-3xl" />
        </a>
      </Reveal>
      <div className="flex flex-col gap-6 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <span>Eliot Walter</span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {external.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-baseline gap-1 transition-colors hover:text-link">
                {link.label}
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6">
          <ViewCounter />
          <a href="#top" onClick={(event) => scrollToSection(event, 'top')} className="transition-colors hover:text-link">
            {footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
