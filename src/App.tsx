import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Now from './components/Now';
import Work from './components/Work';
import { LocaleProvider } from './content/locale';

export default function App() {
  return (
    <LocaleProvider>
      <div id="top" className="relative">
        <Header />
        <main>
          <Hero />
          <div className="lang-fade mx-auto max-w-[1520px] px-[5%]">
            <Work />
            <Now />
          </div>
        </main>
        <div className="lang-fade mx-auto max-w-[1520px] px-[5%]">
          <Footer />
        </div>
      </div>
    </LocaleProvider>
  );
}
