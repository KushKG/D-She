import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('All Dresses');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = [
    { id: 'All Dresses', name: 'All Dresses' },
    { id: 'Indo Western', name: 'Indo Western' },
    { id: 'Indian', name: 'Indian' },
    { id: 'Western', name: 'Western' },
  ];

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

    fetchProducts();
  }, [selectedStyle]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{selectedStyle}</h1>
        <div className="flex space-x-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedStyle === style.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product._id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={product.images[0].startsWith('http') ? product.images[0] : `${API_URL}/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/products/${product._id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.style}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;