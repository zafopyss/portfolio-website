import GradientText from '@components/design/GradientText';
import { useCallback, useEffect, useRef, useState } from 'react';
import montagne from '../assets/851-jma-montagne.jpeg';

const personalCopy = [
  "Depuis début 2025, je travaille chez Mantu en tant que développeur full-stack Python, avec un focus sur des architectures back-end robustes et maintenables.",
  "J’interviens sur la conception et l’évolution d’applications Django en clean architecture, en lien étroit avec les enjeux produit.",
  "Mes principaux centres d’intérêt techniques sont la résolution de problèmes complexes, la qualité du code et la création d'architectures évolutives.",
  "J’attache une importance particulière à la simplicité des solutions, à la maintenabilité et à l’expérience utilisateur."
];

const profileFacts = [
  { label: 'Métier', value: 'Full Stack Developer — React & Python' },
];

export default function AboutSection() {
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isCvModalClosing, setIsCvModalClosing] = useState(false);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const cvFrenchUrl = '/resume/20260201_CVFR_%20WALTER_Eliot.pdf';
  const cvEnglishUrl = '/resume/20260201_CVEN_%20WALTER_Eliot.pdf';
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCvModal = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    document.body.setAttribute('data-cv-modal-open', 'true');
    setIsCvModalClosing(false);
    setIsCvModalOpen(true);
  }, []);

  const closeCvModal = useCallback(() => {
    if (!isCvModalOpen || isCvModalClosing) return;
    document.body.removeAttribute('data-cv-modal-open');
    setIsCvModalClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsCvModalOpen(false);
      setIsCvModalClosing(false);
      closeTimer.current = null;
    }, 380);
  }, [isCvModalClosing, isCvModalOpen]);

  useEffect(() => {
    return () => {
      document.body.removeAttribute('data-cv-modal-open');
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  const shouldRenderModal = isCvModalOpen || isCvModalClosing;
  const shouldPreventScroll = shouldRenderModal;
  const overlayAnimationClass = isCvModalClosing ? 'modal-overlay-leave' : 'modal-overlay-appear';
  const panelAnimationClass = isCvModalClosing ? 'modal-item-leave' : 'animate-modal-item';

  useEffect(() => {
    if (!shouldPreventScroll) return undefined;

    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCvModal();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [closeCvModal, shouldPreventScroll]);

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
            <button
              type="button"
              aria-label="Choisir la langue du CV"
              onClick={openCvModal}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-blue-python hover:text-blue-python"
            >
              Consulter mon CV
            </button>
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

      {shouldRenderModal && (
        <div
          className={`fixed inset-0 z-[10000] flex min-h-dvh w-screen items-center justify-center bg-black-particule/85 backdrop-blur-sm px-6 ${overlayAnimationClass}`}
          onClick={closeCvModal}
          aria-hidden="true"
        >
          <div
            ref={modalPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-language-title"
            className={`w-full max-w-md border rounded-2xl border-white/20 bg-neutral-900/90 p-6 text-white shadow-2xl ${panelAnimationClass}`}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="cv-language-title" className="text-xl font-semibold">
              Choisir la langue du CV
            </h3>
            <p className="mt-2 text-sm text-slate-200">Souhaitez-vous la version française ou anglaise ?</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={cvFrenchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition hover:border-blue-python hover:text-blue-python"
              >
                Français
              </a>
              <a
                href={cvEnglishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition hover:border-blue-python hover:text-blue-python"
              >
                English
              </a>
            </div>

            <button
              type="button"
              onClick={closeCvModal}
              className="mt-4 text-sm text-slate-300 transition hover:text-white"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
