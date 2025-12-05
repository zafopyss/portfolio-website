import About from '@pages/About';
import Home from '@pages/Home';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { GradientTitle, Header, ScrollToTop } from './components';
import { TechSection } from "./sections";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='px-3 mt-3 md:px-6 lg:px-20 md:mt-4 flex flex-col gap-4'>
      {/* <CursorTrail /> */}
      <Header />
      <h1>Vite + React</h1>
      <GradientTitle text="Welcome to My App" className='text-center' />

      <div className='mb-15'>
          <TechSection />
      </div>





      <ScrollToTop />
      <div>
        <h1>OTHERS PAGES</h1>
        <div>
          <nav className='flex mb-5 gap-1'>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </div >


  )
}

export default App
