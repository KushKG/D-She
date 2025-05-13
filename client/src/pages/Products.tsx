import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  style: string;
  description: string;
  favorite?: boolean;
}

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Derive selected style from URL path
  const getSelectedStyle = () => {
    const path = location.pathname.split('/')[1];
    if (path && path !== 'all-dresses') {
      return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return 'All Dresses';
  };
  const selectedStyle = getSelectedStyle();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedStyle === 'All Dresses'
          ? `${API_URL}/products`
          : `${API_URL}/products?style=${selectedStyle}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchProducts();
  }, [selectedStyle]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-8 pb-20">
      {error && (
        <div className="text-red-600 text-center mb-4 font-proxima text-sm sm:text-base">{error}</div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-earth-500 font-proxima text-base sm:text-lg">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`} className="group block focus:outline-none">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden">
                <div className="w-full aspect-[3/4] bg-earth-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.images[0]?.startsWith('http') ? product.images[0] : `${API_URL}/${product.images[0]}` || 'https://placehold.co/400x500'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  />
                  {product.favorite && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow font-proxima">
                      ★ Favorite
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-earth-800 font-proxima truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-earth-500 font-proxima truncate">{product.style}</p>
                  <p className="text-sm sm:text-base font-bold text-earth-700 font-proxima">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;