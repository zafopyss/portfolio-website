import { useLocale } from '../content/useLocale';
import Reveal from './Reveal';

export default function Now() {
  const { now } = useLocale().content;
  return (
    <section className="section grid gap-14 border-t border-line lg:grid-cols-[1fr_1.4fr] lg:gap-[8%]" aria-labelledby="now-heading">
      <Reveal>
        <p className="eyebrow mb-7">{now.eyebrow}</p>
        <h2 id="now-heading" className="heading-xl whitespace-pre-line">
          {now.title}
        </h2>
      </Reveal>
      <Reveal>
        <dl className="divide-y divide-line">
          {now.entries.map((entry) => (
            <div key={entry.label} className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
              <dt className="eyebrow text-muted">{entry.label}</dt>
              <dd className="text-[1.15rem] leading-relaxed">{entry.text}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
