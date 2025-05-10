import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  measurements: {
    chest: number;
    waist: number;
    length: number;
  };
  fit: 'Relaxed' | 'Normal' | 'Fitted';
  style: 'Indian' | 'Western' | 'Indo Western';
  tags: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="mt-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {error || 'Product not found'}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image gallery */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex].startsWith('http') ? product.images[selectedImageIndex] : `${API_URL}/${product.images[selectedImageIndex]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image.startsWith('http') ? image : `${API_URL}/${image}`}
                  alt={`${product.name} - Image ${index + 1}`}
                  className={`w-20 h-20 object-cover cursor-pointer ${
                    selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Measurements</h3>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Chest</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">{product.measurements.chest}"</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Waist</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">{product.measurements.waist}"</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Length</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">{product.measurements.length}"</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Fit</h3>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {product.fit}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm text-gray-600">Quantity</h3>
              </div>

              <div className="mt-2 flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-md"
                >
                  -
                </button>
                <span className="mx-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 