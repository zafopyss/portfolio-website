import { sectionTargets } from '@data/sections';
import { Contacts } from '@enums/ContactsEnum';
import { useSectionNavigation } from '@hooks/SectionNavigationContext';
import { MouseEvent, useEffect, useState } from 'react';
import personmodel from '../../../assets/person_model.svg';

type HeaderProps = {
  logo?: string;
};

export default function Header({ logo = personmodel }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { activeHash, goToSection } = useSectionNavigation();
  const navLinks = sectionTargets;

  useEffect(() => {
    const handler = () => setIsAtTop(window.scrollY <= 20);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault();
    setOpen(false);
    goToSection(hash);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden md:flex items-center justify-between px-3 lg:px-8 py-4 bg-black/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-11 h-11" />
          <a
            href={Contacts.EmailAdressWithTo}
            aria-label={`Envoyer un mail à ${Contacts.Email}`}
            className="text-sm font-medium text-white/70 transition hover:text-blue-python"
          >
            {Contacts.Email}
          </a>
        </div>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.hash}
              href={link.hash}
              className={`group relative inline-block text-md font-medium focus-visible:outline-none transition text-white/70 hover:text-blue-python`}
              onClick={(event) => handleNavClick(event, link.hash)}
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-python transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </div>

      <div
        className={`md:hidden transition-colors duration-300 ${
          isAtTop ? 'bg-black/90 backdrop-blur' : 'bg-transparent'
        }`}
      >
        <div className="px-3 py-3 flex items-center justify-between">
          <div
            className={`flex-1 flex items-center gap-3 transition-all duration-300 ${
              isAtTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img src={logo} alt="logo" className="w-11 h-11" />
            <a
              href={Contacts.EmailAdressWithTo}
              aria-label={`Envoyer un mail à ${Contacts.Email}`}
              className="text-sm font-medium text-white/70 transition hover:text-blue-python"
            >
              {Contacts.Email}
            </a>
          </div>
          <button
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="group relative inline-flex p-2 focus-visible:outline-none"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="flex flex-col cursor-pointer justify-between w-6 h-6 transform transition-all duration-300 origin-center overflow-hidden">
              <span
                className={`bg-blue-python h-[2px] md:h-[1.5px] w-10 transform transition-all origin-left ${
                  open ? 'rotate-[42deg] duration-300' : 'duration-300'
                }`}
              />
              <span
                className={`bg-blue-python h-[2px] md:h-[1.5px] w-1/2 rounded transform transition-all ${
                  open ? '-translate-x-10 opacity-0 duration-300' : 'opacity-100 duration-300'
                }`}
              />
              <span
                className={`bg-blue-python h-[2px] md:h-[1.5px] w-10 transform transition-all origin-left ${
                  open ? '-rotate-[42deg] duration-300' : 'duration-300'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-sm flex items-start justify-center p-6">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-black/80 p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Fermer le menu"
              className="absolute right-4 top-4 text-sm uppercase tracking-[0.4em] text-white/50"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.hash}
                  href={link.hash}
                  aria-label={link.label}
                  className="text-2xl font-semibold text-white hover:text-blue-python transition"
                  onClick={(event) => handleNavClick(event, link.hash)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4 flex flex-col gap-2 text-sm text-white/80">
              <a href={Contacts.GitHub} target="_blank" rel="noreferrer" className="hover:text-blue-python">
                GitHub
              </a>
              <a href={Contacts.LinkedIn} target="_blank" rel="noreferrer" className="hover:text-blue-python">
                LinkedIn
              </a>
              <a href={Contacts.EmailAdressWithTo} className="hover:text-blue-python">
                Envoyer un mail
              </a>
              <a
                href={Contacts.EmailAdressWithTo}
                className="mt-3 text-xs uppercase tracking-[0.4em] text-white/60"
              >
                {Contacts.Email}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
