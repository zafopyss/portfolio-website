import ContactSidebar from '@components/interface/ContactSidebar';
import SectionSidebar from '@components/interface/SectionSidebar';
import { Particles } from '@components/ui/shadcn-io/particles';
import { WavyBackground } from '@components/ui/shadcn-io/wavy-background';
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
      <div className="flex flex-col bg-black-particule/80 ">
        <Header />
        <div className="relative overflow-hidden gap-6 px-5 py-6 sm:px-22 sm:py-4">
          <Particles
            className="absolute inset-0 h-full w-full"
            quantity={90}
            staticity={90}
            ease={60}
            color="#D0C9C4"
          />
          <div className="relative z-10 flex flex-col ">
            <ContactSidebar />
            <SectionSidebar />
            {/* <CursorTrail /> */}

            <AboutMeSection />
            <div style={{ height: '50px' }}></div>
          </div>
        </div>


        <div className="lg:px-20 flex flex-col gap-6 bg-gradient-to-b from-[var(--color-black-particule)]/80 to-[var(--color-black-gradient)]/60">
          <div
            className="mx:auto sm:mx-60 py-12 text-center text-xs text-white/60"
            style={{ height: '20px' }}
          ></div>
          <ExperienceSection />
          <div className="mx:auto sm:mx-60 py-12 text-center text-xs text-white/60" style={{ height: '20px' }}></div>


          <ProjectsSection />
          <div className="mx:auto sm:mx-60 text-center text-xs text-white/60"></div>
        </div>
        <WavyBackground 
        backgroundFill="#0e0e13b3"
        colors={["#4F8DF9", "#D0C9C4"]}
        waveWidth={30}
        blur={7}
        speed="slow"
        waveOpacity={0.45}
        containerClassName="h-full w-full"
        className="">
          <ContactSection />

          <footer className="mx:auto sm:mx-60 py-12 sm:border-t sm:border-white/20 text-center text-xs text-white/60">
            Handcrafted by Walter Eliot — © 2025.
          </footer>
      </WavyBackground>  
      </div>
      {/* to delete */}
          {/* <ScrollToTop /> */}

          {/* <div className="mb-15">
            <TechSection />
          </div> */}
    </SectionNavigationProvider>
  );
}

export default App;
