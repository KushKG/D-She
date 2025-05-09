import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            D-She
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600">
              Products
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-primary-600">
              Admin
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 