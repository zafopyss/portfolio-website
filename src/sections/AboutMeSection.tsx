import ContactBubble from '@components/design/ContactBubble';
import GradientText from '@components/design/GradientText';
import { contacts } from '../data/contacts';

const personalCopy = [
  "Depuis début 2025, je travaille chez Mantu d' pour architecturer des expériences digitales qui tiennent autant au détail visuel qu'à la fiabilité du back-end.",
];

const profileFacts = [
  { label: 'Métier', value: 'Full Stack Developer — React & Node.js' },
];

const contactLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
};

export default function AboutSection() {
  return (
    <section className="p-10 ">
      <div>
      <h1 className='text-3xl mb-6'>Walter Eliot</h1>
      <GradientText
        as="h2"
        text="Full Stack Software Engineer"
        gradientStart="var(--color-silver)"
        gradientEnd="var(--color-blue-python)"
        sizeClass="text-5xl font-bold"
        className="text-center pb-8"
      />
        <div className='mb-8 text-sm text-slate-100 leading-relaxed'>

          {personalCopy.map((sentence) => (
            <p key={sentence}>{sentence}</p>
          ))}
        </div>


            <div className='mt-4 flex gap-4 items-center mb-4'>
              <a
              href="https://drive.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              download="Walter-Eliot-CV.pdf"
              aria-label="Télécharger mon CV"
              className="inline-flex items-center gap-3 bg-transparent rounded-full border border-white/20 px-4 py-4 text-sm font-medium hover:bg-white/10 transition"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-white"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Télécharger mon CV
              </a>
              {Object.entries(contacts).map(([key, contact]) => (
                <ContactBubble key={key} contact={contact} label={contactLabels[key] ?? key} />
              ))}
          </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4 ">
              test
        </div>

        <div className="space-y-8">
          <div className="grid gap-3">
            {profileFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-white/20 bg-black/50 p-4 text-sm"
                aria-label={`${fact.label}: ${fact.value}`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{fact.label}</p>
                <p className="text-base font-semibold text-white">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
