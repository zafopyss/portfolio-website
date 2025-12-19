import { sectionTargets } from '@data/sections';
import { Contacts } from '@enums/ContactsEnum';
import { useSectionNavigation } from '@hooks/SectionNavigationContext';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import personmodel from '../../../assets/person_model.svg';

type HeaderProps = {
  logo?: string;
};

export default function Header({ logo = personmodel }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { activeHash, goToSection } = useSectionNavigation();
  const navLinks = sectionTargets;
  const getModalDelay = (index: number, offset = 0) => ({ animationDelay: `${offset + index * 80}ms` });

  const openModal = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setIsClosing(false);
    setOpen(true);
  };

  const closeModal = () => {
    if (!open && !isClosing) return;
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    setOpen(false);
    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsClosing(false);
      closeTimer.current = null;
    }, 360);
  };

  const handleBurgerClick = () => {
    if (open && !isClosing) {
      closeModal();
      return;
    }
    openModal();
  };

  const shouldRenderModal = open || isClosing;
  const shouldPreventScroll = shouldRenderModal;
  const overlayAnimationClass = isClosing ? 'modal-overlay-leave' : 'modal-overlay-appear';

  useEffect(() => {
    const fadeDistance = 160;
    const handler = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY <= 20);
      setScrollProgress(Math.min(Math.max(scrollY / fadeDistance, 0), 1));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault();
    closeModal();
    goToSection(hash);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!shouldPreventScroll) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldPreventScroll]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-3/4 mx-auto md:static px-5 sm:px-20 sm:py-8 py-4">
      <div className="hidden md:flex items-center justify-end px-3 lg:pr-0 lg:pl-8 py-4">
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

        {/* mobile */}
      <div
        className={`md:hidden mb-2 fixed inset-x-0 top-0 z-[9999] transition-colors duration-300 ${
          isAtTop ? '' : ''
        } pointer-events-none`}
      >
        <div className="px-3 py-3 flex items-center justify-between pointer-events-auto">
          <div
            className={`flex-1 flex items-center gap-3 transition-all duration-200 ${
              isAtTop && !open
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none -translate-y-1'
            }`}
          >
            <a
              href={Contacts.EmailAdressWithTo}
              aria-label={`Envoyer un mail à ${Contacts.Email}`}
              className="text-sm font-medium text-white/70 transition"
            >
              {Contacts.Email}
            </a>
          </div>
          <button
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="group relative inline-flex p-2 focus-visible:outline-none z-50"
            onClick={handleBurgerClick}
          >
            <div className="z-41 flex flex-col cursor-pointer justify-between w-6 h-6 transform transition-all duration-300 origin-center overflow-hidden">
              <span
                className={`bg-silver h-[2px] md:h-[1.5px] w-10 transform transition-all origin-left ${
                  open ? 'rotate-[42deg] duration-300' : 'duration-300'
                }`}
              />
              <span
                className={`bg-silver h-[2px] md:h-[1.5px] w-1/2 rounded transform transition-all ${
                  open ? '-translate-x-10 opacity-0 duration-300' : 'opacity-100 duration-300'
                }`}
              />
              <span
                className={`bg-silver h-[2px] md:h-[1.5px] w-10 transform transition-all origin-left ${
                  open ? '-rotate-[42deg] duration-300' : 'duration-300'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* modal for navigation links on mobile */}
      {shouldRenderModal && (
        <div className={`md:hidden fixed inset-0 z-40 flex items-center justify-center bg-theme-background/90 backdrop-blur-sm px-6 py-10 ${overlayAnimationClass}`}>
          <div className="w-full max-w-xl text-center relative">
            <div className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <a
                  key={link.hash}
                  href={link.hash}
                  aria-label={link.label}
                  className={`text-3xl font-semibold text-white transition hover:text-blue-python ${
                    isClosing ? 'modal-item-leave' : 'animate-modal-item'
                  }`}
                  style={getModalDelay(index, 100)}
                  onClick={(event) => handleNavClick(event, link.hash)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className={`mt-12 border-t border-white/20 pt-6 text-sm text-white/80 ${isClosing ? 'modal-item-leave' : 'animate-modal-item'}`}>
              <div className="flex flex-col gap-2">
                <a
                  href={Contacts.GitHub}
                  target="_blank"
                  rel="noreferrer"
                  className={`hover:text-blue-python ${isClosing ? 'modal-item-leave' : 'animate-modal-item'}`}
                  style={getModalDelay(0, 350)}
                >
                  GitHub
                </a>
                <a
                  href={Contacts.LinkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className={`hover:text-blue-python ${isClosing ? 'modal-item-leave' : 'animate-modal-item'}`}
                  style={getModalDelay(1, 360)}
                >
                  LinkedIn
                </a>
                <a
                  href={Contacts.EmailAdressWithTo}
                  className={`hover:text-blue-python ${isClosing ? 'modal-item-leave' : 'animate-modal-item'}`}
                  style={getModalDelay(2, 420)}
                >
                  Mail
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
