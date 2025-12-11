import { sectionTargets } from '@data/sections';
import { scrollToSection } from '@utils/scrollToSection';
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type SectionNavigationContextValue = {
  activeHash: string;
  goToSection: (hash: string) => void;
};

const SectionNavigationContext = createContext<SectionNavigationContextValue | undefined>(undefined);

export function SectionNavigationProvider({ children }: { children: ReactNode }) {
  const initialHash = typeof window !== 'undefined' && window.location.hash ? window.location.hash : sectionTargets[0].hash;
  const [activeHash, setActiveHash] = useState<string>(initialHash);

  useEffect(() => {
    const computeActiveHash = () => {
      if (typeof window === 'undefined') return;
      const referencePoint = window.scrollY + window.innerHeight * 0.35;
      let candidateHash = sectionTargets[0].hash;

      for (const section of sectionTargets) {
        const element = document.querySelector<HTMLElement>(section.hash);
        if (!element) continue;
        const threshold = element.offsetTop - 80;
        if (referencePoint >= threshold) {
          candidateHash = section.hash;
        }
      }

      setActiveHash((prevHash) => {
        if (prevHash !== candidateHash) {
          window.history.replaceState(null, '', candidateHash);
          return candidateHash;
        }
        return prevHash;
      });
    };

    computeActiveHash();
    window.addEventListener('scroll', computeActiveHash, { passive: true });
    window.addEventListener('resize', computeActiveHash);

    return () => {
      window.removeEventListener('scroll', computeActiveHash);
      window.removeEventListener('resize', computeActiveHash);
    };
  }, []);

  const goToSection = useCallback((hash: string) => {
    scrollToSection(hash);
    setActiveHash(hash);
  }, []);

  const contextValue = useMemo(() => ({ activeHash, goToSection }), [activeHash, goToSection]);

  return <SectionNavigationContext.Provider value={contextValue}>{children}</SectionNavigationContext.Provider>;
}

export function useSectionNavigation() {
  const context = useContext(SectionNavigationContext);
  if (!context) {
    throw new Error('useSectionNavigation must be used within SectionNavigationProvider');
  }
  return context;
}
