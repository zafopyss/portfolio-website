import { sectionTargets } from '@data/sections';
import { useSectionNavigation } from '@hooks/SectionNavigationContext';
import { MouseEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import personmodel from '../../../assets/person_model.svg';

export default function SectionSidebar() {
  const { activeHash, goToSection } = useSectionNavigation();
  const [showScrollHint, setShowScrollHint] = useState(true);
  const activeIndex = sectionTargets.findIndex((section) => section.hash === activeHash);
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handle = () => {
      setShowScrollHint(window.scrollY <= 20);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const indicatorClasses = (active: boolean) =>
    `block h-[3px] origin-left rounded-full transition-all duration-300 ${
      active
        ? 'w-9 bg-blue-python'
        : 'w-6 bg-white/60 group-hover:w-7.5'
    }`;

  return (
    <aside className="hidden lg:flex fixed left-6 top-0 bottom-0 z-40 flex-col items-center">
      <Link
        to="/"
        aria-label="Home"
        className="mt-8 inline-flex rounded-full bg-white/80 p-2 shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:bg-neutral-800"
        onClick={handleLogoClick}
      >
        <img src={personmodel} alt="logo" className="w-15 h-15" />
      </Link>

      <div className="fixed flex-1 flex flex-col items-start top-[45%]">
        {sectionTargets.map((section, index) => (
            <a
                key={section.hash}
              href={section.hash}
              aria-label={`Go to ${section.label}`}
              className="group focus-visible:outline-none"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                goToSection(section.hash);
              }}
            >
            <div className="flex h-5 w-10 items-center">
              <span className={indicatorClasses(activeIndex === index)} />
              <span className="sr-only">{section.label}</span>
            </div>
          </a>
        ))}
      </div>
      <div
        className={`fixed bottom-[0%] mt-2 flex flex-col items-center gap-y-15 text-md uppercase text-white transition-all duration-1200 ${
          showScrollHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-80'
        }`}
      >
        <span className="rotate-90 whitespace-nowrap">scroll down</span>
        <span className="h-30 w-[1px] bg-white/90" />
      </div>

    </aside>
  );
}
