import { useLocale } from '../content/useLocale';
import type { WorkItem } from '../content/types';
import Arrow from './Arrow';
import Reveal from './Reveal';
import TechTag from './TechTag';

function Item({ item }: { item: WorkItem }) {
  const Wrapper = item.href ? 'a' : 'div';
  return (
    <Reveal>
      <Wrapper
        href={item.href}
        target={item.href ? '_blank' : undefined}
        rel={item.href ? 'noreferrer' : undefined}
        className="work-item"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="eyebrow text-muted">{item.kind}</span>
          {item.period && <span className="text-sm text-muted">{item.period}</span>}
        </div>
        <div className="mb-1 mt-2 flex items-baseline gap-3">
          <h3 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.03em]">{item.title}</h3>
          {item.href && <Arrow className="text-xl" />}
        </div>
        {item.org && <p className="mb-3 text-muted">{item.org}</p>}
        <p className="max-w-[62ch] leading-relaxed">{item.summary}</p>
        {item.bullets.length > 0 && (
          <ul className="mt-3 max-w-[62ch] space-y-2 text-[0.95rem] leading-relaxed text-muted">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-current" />
                {bullet}
              </li>
            ))}
          </ul>
        )}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Stack">
          {item.stack.map((tech) => (
            <TechTag key={tech} name={tech} />
          ))}
        </ul>
      </Wrapper>
    </Reveal>
  );
}

export default function Work() {
  const { work } = useLocale().content;
  return (
    <section id="work" className="section grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-[8%]" aria-labelledby="work-heading">
      <Reveal className="lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow mb-7">{work.eyebrow}</p>
        <h2 id="work-heading" className="heading-xl whitespace-pre-line">
          {work.title}
        </h2>
        <p className="mt-6 max-w-[40ch] leading-relaxed text-muted">{work.intro}</p>
      </Reveal>
      <div className="divide-y divide-line">
        {work.items.map((item) => (
          <Item key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
