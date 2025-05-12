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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="text-red-600 text-center mb-4 font-proxima">{error}</div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`} className="group block focus:outline-none">
              <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden">
                <img
                  src={product.images[0]?.startsWith('http') ? product.images[0] : `${API_URL}/${product.images[0]}` || 'https://placehold.co/400x500'}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                />
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-sm font-normal text-gray-900 font-proxima">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 font-proxima">{product.style}</p>
                <p className="text-sm font-normal text-gray-900 font-proxima">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;