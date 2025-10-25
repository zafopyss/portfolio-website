import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, Greeting, CounterApp } from './components';
import Home from '@pages/Home';
import About from '@pages/About';
import { Link, Route, Routes } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo}  />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test hs
        </p>
      </div>
      <p className="text-3xl text-amber-50">
        Click on the Vite and React logos to learn more
      </p>

      <Greeting name="Alice" className={"underline"} />
      <Greeting name="Bob" />

      <Button label="Click Me" onClick={() => alert('Button clicked!')} />
      <div>

      <CounterApp />
 
      </div>
      <div>
        <h1>OTHERS PAGES</h1>
        <div>
      <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
          <Link to="/about">About</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
    </div>
      </div>

    </>

  )
}

export default App
