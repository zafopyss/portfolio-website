import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import personmodel from '../../../assets/person_model.svg';

type NavLink = { to: string; label: string; hash?: string };

type HeaderProps = {
  logo?: string;
  links?: NavLink[];
};

export default function Header({ logo = personmodel, links }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const defaultLinks: NavLink[] = [
    { to: '/', label: 'Profile' },
    { to: '/', label: 'Experiences', hash: '#experiences' },
    { to: '/', label: 'Projects', hash: '#projects' },
    { to: '/', label: 'Contact', hash: '#contact' },
  ];
  const navLinks = links ?? defaultLinks;

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (!link.hash) return;
    event.preventDefault();
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const target = document.querySelector(link.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', link.hash);
    }
  };

  return (
    <header className="w-full py-4">
      {/* justify between */}
      <div className="px-3 md:px-6 lg:px-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <Link to="/" aria-label="Home">
            <img src={logo} alt="logo" className="w-10 h-10" />
          </Link>
          <a
            href={`${Contacts.EmailAdressWithTo}`}
            className="inline-block text-xs font-medium text-neutral-200 border-b-2 border-transparent hover:border-blue-400 hover:text-blue-400 transition-all duration-200 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={`Envoyer un mail à ${Contacts.Email}`}
          >
            {Contacts.Email}
          </a> */}
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={`${l.to}-${l.hash ?? 'nohash'}`}
              to={l.to}
              className="group relative inline-block text-md font-medium hover:text-blue-400 focus-visible:outline-none"
              onClick={(event) => handleNavClick(event, l)}
            >
              {l.label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-400 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
          {/* <Link
            to="/contact"
            aria-label="Contact me"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-400 text-sm font-medium text-neutral-900 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
          >
            Contact me
          </Link> */}


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
