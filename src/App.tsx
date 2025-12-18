import ContactSidebar from '@components/interface/ContactSidebar';
import SectionSidebar from '@components/interface/SectionSidebar';
import { SectionNavigationProvider } from '@hooks/SectionNavigationContext';
import { useEffect } from 'react';
import { Header } from './components';
import { AboutMeSection, ContactSection, ExperienceSection, ProjectsSection } from './sections';
type LenisType = import('lenis').default;

function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(min-width: 1024px)');
    let lenisInstance: LenisType | null = null;
    let frameId: number | null = null;

    const animate = (time: number) => {
      lenisInstance?.raf(time);
      frameId = requestAnimationFrame(animate);
    };

    const startLenis = async () => {
      if (!media.matches || lenisInstance) return;
      const { default: LoadedLenis } = await import('lenis');
      if (!media.matches) return;
      lenisInstance = new LoadedLenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      frameId = requestAnimationFrame(animate);
    };

    const stopLenis = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
    };

    const handleChange = () => (media.matches ? startLenis() : stopLenis());

    handleChange();
    media.addEventListener('change', handleChange);
    return () => {
      media.removeEventListener('change', handleChange);
      stopLenis();
    };
  }, []);

  return (
    <SectionNavigationProvider>
      <div className="relative mx-5 mt-3 md:px-6 lg:px-20 md:mt-4 flex flex-col gap-6">
        <ContactSidebar />
        <SectionSidebar />
        {/* <CursorTrail /> */}
        <Header />

        <AboutMeSection />
        <div style={{ height: '50px' }}></div>
        <div className="mx:auto sm:mx-60 py-12 border-t border-white/20 text-center text-xs text-white/60" style={{ height: '20px' }}></div>

        <ExperienceSection />
        <div className="mx:auto sm:mx-60 py-12 border-t border-white/20 text-center text-xs text-white/60" style={{ height: '20px' }}></div>

        {/* <div className="mb-15">
          <TechSection />
        </div> */}

        <ProjectsSection />
        <div className="mx:auto sm:mx-60 sm:py-2gi border-t border-white/20 text-center text-xs text-white/60"></div>

        <ContactSection />

        <footer className="mx:auto sm:mx-60 py-12 border-t border-white/20 text-center text-xs text-white/60">
          Handcrafted by Walter Eliot — © 2025.
        </footer>

        {/* <ScrollToTop /> */}
      </div>
    </SectionNavigationProvider>
  );
}

export default App;
