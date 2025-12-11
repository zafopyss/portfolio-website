import ContactSidebar from '@components/interface/ContactSidebar';
import SectionSidebar from '@components/interface/SectionSidebar';
import { SectionNavigationProvider } from '@hooks/SectionNavigationContext';
import Lenis from 'lenis';
import { useEffect } from 'react';
import { Header } from './components';
import { AboutSection, ContactSection, ExperienceSection, TechSection } from './sections';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <SectionNavigationProvider>
      <div className="relative mx-5 mt-3 md:px-6 lg:px-20 md:mt-4 flex flex-col gap-6">
        <ContactSidebar />
        <SectionSidebar />
        {/* <CursorTrail /> */}
        <Header />

        <AboutSection />
        <div style={{ height: '300px' }}></div>

        <ExperienceSection />
        <div style={{ height: '300px' }}></div>

        <div className="mb-15">
          <TechSection />
        </div>


        <ContactSection />


        <div className="text-center" style={{ height: '300px' }}>ending section to build</div>

        {/* <ScrollToTop /> */}
      </div>
    </SectionNavigationProvider>
  );
}

export default App;
