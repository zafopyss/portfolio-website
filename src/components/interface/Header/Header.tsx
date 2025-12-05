import { useState } from 'react';
import { Link } from 'react-router-dom';
import personmodel from '../../../assets/person_model.svg';

type NavLink = { to: string; label: string };

type HeaderProps = {
  logo?: string;
  links?: NavLink[];
};

// Maybe TODO = refacto
export default function Header({ logo = personmodel, links }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const defaultLinks: NavLink[] = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/#technologies', label: 'Technologies' },
  ];
  const navLinks = links ?? defaultLinks;

  return (
    <header className="w-full py-4">
      <div className="mx-3 md:mx-6 lg:mx-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="logo" className="w-8 h-8" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium hover:text-blue-400 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>


      {/* Mobile to refacto */}
        {/* <div className="md:hidden">
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-neutral-800"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div> */}
      </div>

      {/* {open && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-700">
          <div className="flex flex-col p-3 gap-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="p-2 rounded-md hover:bg-neutral-800" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )} */}
    </header>
  );
}
