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
  favorite?: boolean;
}

const Home = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.filter((p: Product) => p.favorite));
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
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-20">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide text-earth-800 mb-12 text-center font-proxima uppercase letter-spacing-wider">
        Handpicked Favorites
      </h2>
      {error && (
        <div className="text-red-600 text-center mb-4 font-proxima">{error}</div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-earth-500 font-proxima text-lg">No favorites yet. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`} className="group block focus:outline-none">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden">
                <div className="w-full aspect-[3/4] bg-earth-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.images[0]?.startsWith('http') ? product.images[0] : `${API_URL}/${product.images[0]}` || 'https://placehold.co/400x500'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  />
                  {product.favorite && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow font-proxima">
                      ★ Favorite
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-earth-800 font-proxima truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-earth-500 font-proxima truncate">{product.style}</p>
                  <p className="text-base font-bold text-earth-700 font-proxima">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 