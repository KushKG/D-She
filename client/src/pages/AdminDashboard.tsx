import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  style: string;
  material: string;
  description: string;
  favorite: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (err) {
      setLoginError('Login failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const toggleFavorite = async (productId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/favorite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ favorite: !currentFavorite }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products => products.map(p => p._id === productId ? updatedProduct : p));
      } else {
        setError('Failed to update favorite status');
      }
    } catch (err) {
      setError('An error occurred while updating favorite status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-4 font-proxima">Admin Login</h2>
          {loginError && <div className="text-red-600 text-center mb-2 font-proxima">{loginError}</div>}
          <div>
            <label className="block text-sm font-medium mb-1 font-proxima">Username</label>
            <input
              type="text"
              name="username"
              value={loginForm.username}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 font-proxima">Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full font-proxima">Login</button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
      </div>
    );
  }

  if (isAuthenticated && !isLoading) {
    return (
      <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-earth-800">Products</h1>
            <p className="mt-2 text-sm text-earth-700">
              A list of all dresses in your store including their name, price, style, and material.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => navigate('/admin/products/new')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-earth-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-earth-700 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2 sm:w-auto"
            >
              Add product
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-earth-200">
                  <thead className="bg-earth-100">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-earth-700 sm:pl-6">Product</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-earth-700">Price</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-earth-700">Style</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-earth-700">Material</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-200 bg-white">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-earth-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-earth-700">
                          ${product.price}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-earth-700">
                          {product.style}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-earth-700">
                          {product.material}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium flex items-center justify-end space-x-2">
                          <button
                            onClick={() => toggleFavorite(product._id, product.favorite)}
                            className={`mr-2 text-2xl focus:outline-none ${product.favorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                            title={product.favorite ? 'Unfavorite' : 'Mark as favorite'}
                          >
                            {product.favorite ? '★' : '☆'}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                            className="text-earth-600 hover:text-earth-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!window.confirm('Are you sure you want to delete this product?')) return;
                              try {
                                const response = await fetch(`${API_URL}/products/${product._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                  },
                                });
                                if (response.ok) {
                                  setProducts(products.filter(p => p._id !== product._id));
                                } else {
                                  setError('Failed to delete product');
                                }
                              } catch (err) {
                                setError('An error occurred while deleting the product');
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-8 bottom-8">
          <button
            onClick={handleLogout}
            className="btn btn-secondary font-proxima"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-4 font-proxima">Admin Login</h2>
        {loginError && <div className="text-red-600 text-center mb-2 font-proxima">{loginError}</div>}
        <div>
          <label className="block text-sm font-medium mb-1 font-proxima">Username</label>
          <input
            type="text"
            name="username"
            value={loginForm.username}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 font-proxima">Password</label>
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full font-proxima">Login</button>
      </form>
    </div>
  );
};

export default AdminDashboard; 