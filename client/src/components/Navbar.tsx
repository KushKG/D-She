import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

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

  return (
    <nav className="bg-earth-300 border-b-2 border-earth-500 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col items-start">
            <Link to="/" className="text-2xl font-bold tracking-wide text-earth-800 font-proxima">
              D-SHE
            </Link>
            <span className="text-xs text-earth-700 font-proxima mt-1">A collection of cool, cute, and casual outfits.</span>
          </div>
          <div className="hidden md:flex space-x-10">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 