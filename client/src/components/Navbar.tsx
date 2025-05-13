import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navTabs = [
    { path: '/all-dresses', label: 'All Dresses' },
    { path: '/indo-western', label: 'Indo Western' },
    { path: '/western', label: 'Western' },
    { path: '/indian', label: 'Indian' },
    // { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-earth-300 border-b-2 border-earth-500 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col items-start">
            <Link to="/" className="text-2xl font-bold tracking-wide text-earth-800 font-proxima">
              D-SHE
            </Link>
            <span className="text-xs text-earth-700 font-proxima mt-1">A collection of cool, cute, and casual outfits.</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex space-x-6 lg:space-x-10">
            {navTabs.map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`text-base font-semibold px-4 py-2 uppercase tracking-wider font-proxima transition-colors duration-200 border-b-2 ${
                  isActive(tab.path)
                    ? 'text-earth-700 border-earth-600 bg-earth-100'
                    : 'text-earth-800 border-transparent hover:text-earth-600 hover:bg-earth-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Open menu"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-earth-600"
              onClick={e => {
                e.stopPropagation();
                setMenuOpen(open => !open);
              }}
            >
              <svg
                className="h-7 w-7 text-earth-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div ref={menuRef} className="md:hidden absolute left-0 right-0 top-20 bg-earth-300 border-b-2 border-earth-500 shadow-lg z-50 animate-fade-in-down">
            <div className="flex flex-col py-4 space-y-2 px-4">
              {navTabs.map(tab => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`text-base font-semibold px-3 py-2 rounded uppercase tracking-wider font-proxima transition-colors duration-200 border-l-4 ${
                    isActive(tab.path)
                      ? 'text-earth-700 border-earth-600 bg-earth-100'
                      : 'text-earth-800 border-transparent hover:text-earth-600 hover:bg-earth-200'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
