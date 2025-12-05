import { useEffect, useState } from 'react';

type ScrollToTopProps = {
  threshold?: number; // show button after this many px scrolled
  className?: string;
  ariaLabel?: string;
};

export default function ScrollToTop({
  threshold = 0,
  className = '',
  ariaLabel = 'Scroll to top',
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return;
      setVisible(window.pageYOffset > threshold);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg
        bg-blue-python text-white w-12 h-12 p-2 hover:scale-105 transform transition-transform duration-150 ${className}`}
    >
      {/* simple arrow up */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L4 10h5v8h6v-8h5L12 2z"/>
    </svg>
    </button>
  );
}
