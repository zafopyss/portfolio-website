import GradientText from '@components/design/GradientText';
import montagne from '../assets/851-jma-montagne.jpeg';

const personalCopy = [
  "Depuis début 2025, je travaille chez Mantu en tant que développeur full-stack Python, avec un focus sur des architectures back-end robustes et maintenables.",
  "J’interviens sur la conception et l’évolution d’applications Django en clean architecture, en lien étroit avec les enjeux produit.",
  "Mes principaux centres d’intérêt techniques sont la résolution de problèmes complexes, la qualité du code et la création d'architectures évolutives.",
  "J’attache une importance particulière à la simplicité des solutions, à la maintenabilité et à l’expérience utilisateur."
];

const profileFacts = [
  { label: 'Métier', value: 'Full Stack Developer — React & Node.js' },
];

export default function AboutSection() {
  return (
    <section
      id="profile"
      className="scroll-mt-24 px-5 sm:py-12 lg:px-15 lg:py-10"
    >
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="space-y-4 sm:space-y-8 text-white">
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-3xl">Walter Eliot</h1>
            <GradientText
              as="h2"
              text="Full Stack Software Engineer"
              gradientStart="var(--color-silver)"
              gradientEnd="var(--color-blue-python)"
              sizeClass="text-4xl sm:text-5xl font-bold"
              className="mt-2 pb-4"
            />
          </div>
          <div className="space-y-2 text-sm leading-relaxed text-slate-100 ">
            {personalCopy.map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://drive.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              download="Walter-Eliot-CV.pdf"
              aria-label="Télécharger mon CV"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-blue-python hover:text-blue-python"
            >
              Télécharger mon CV
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-[220px] sm:max-w-sm border border-white/20 bg-gradient-to-br from-neutral-900/90 to-neutral-900/30 shadow-2xl">
            <div
              className="absolute inset-0 translate-x-8 translate-y-10 sm:translate-x-20 sm:translate-y-22 bg-white/5 z-0 pointer-events-none"
            />
            <img
              src={montagne}
              alt="Illustration of Walter Eliot"
              className="relative h-full w-full z-10 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
