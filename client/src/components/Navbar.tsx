import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navTabs = [
    { path: '/all-dresses', label: 'All Dresses' },
    { path: '/indo-western', label: 'Indo Western' },
    { path: '/western', label: 'Western' },
    { path: '/indian', label: 'Indian' },
    { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-earth-300 border-b-2 border-earth-500 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col items-start">
            <Link to="/" className="text-2xl font-normal tracking-wide text-earth-800 font-proxima">
              D-SHE
            </Link>
            <span className="text-s text-earth-700 font-proxima">A collection of cool, cute, and casual outfits.</span>
          </div>
          <div className="hidden md:flex space-x-8">
            {navTabs.map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`text-base font-normal px-4 py-2 uppercase tracking-wide font-proxima transition-colors duration-200 border-b-2 ${
                  isActive(tab.path)
                    ? 'text-earth-700 border-earth-600 font-semibold bg-earth-100'
                    : 'text-earth-800 border-transparent hover:text-earth-600 hover:bg-earth-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-base font-normal text-earth-800 hover:text-earth-600 uppercase tracking-wide font-proxima">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 