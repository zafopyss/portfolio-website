import ContactSidebar from '@components/interface/ContactSidebar';
import SectionSidebar from '@components/interface/SectionSidebar';
import About from '@pages/About';
import Home from '@pages/Home';
import { Link, Route, Routes } from 'react-router-dom';
import { Header } from './components';
import { AboutSection, ExperienceSection, TechSection } from './sections';

function App() {
  return (
    <div className="relative px-3 mt-3 md:px-6 lg:px-20 md:mt-4 flex flex-col gap-6">
      <ContactSidebar />
      <SectionSidebar />
      {/* <CursorTrail /> */}
      <Header />
      <ExperienceSection />

      <AboutSection />

      <div style={{ height: "1000px" }}></div>
      

      <div className="mb-15">
        <TechSection />
      </div>

      {/* <ScrollToTop /> */}

      <div>
        <h1>OTHERS PAGES</h1>
        <div>
          <nav className="flex mb-5 gap-2">
            <Link className="text-blue-400 underline" to="/">
              Home
            </Link>
            <Link className="text-blue-400 underline" to="/about">
              About
            </Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
