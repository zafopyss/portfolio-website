import About from '@pages/About';
import Home from '@pages/Home';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Button, CounterApp, GradientTitle, Greeting, Header, ScrollToTop } from './components';
import { TechSection } from "./sections";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='px-3 mt-3 md:px-6 lg:px-20 md:mt-4 flex flex-col gap-4'>
      {/* <CursorTrail /> */}
      <Header />
      <h1>Vite + React</h1>
      <GradientTitle text="Welcome to My App" className='text-center' />
      <Greeting name="Alice" className={"underline"} />
      <Greeting name="Bob" />

      <Button label="Click Me" onClick={() => alert('Button clicked!')} />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div>

        <div className='mb-15'>
            <TechSection />
        </div>




        <CounterApp />

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
