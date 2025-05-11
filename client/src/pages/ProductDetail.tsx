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
  material: string;
}

interface InterestForm {
  name: string;
  email: string;
  phone: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [formData, setFormData] = useState<InterestForm>({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId: id,
          productName: product?.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit interest');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '' });
      setShowInterestForm(false);
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
              <h3 className="text-sm font-medium text-gray-900">Material</h3>
              <div className="mt-2">
                <p className="text-base text-gray-700">{product.material}</p>
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
              <div className="text-sm text-gray-500">
                <p>Shipping fee: $10</p>
                <p>Returns accepted within 3 days of delivery</p>
              </div>
            </div>

            <div className="mt-10">
              {!showInterestForm ? (
                <button
                  type="button"
                  onClick={() => setShowInterestForm(true)}
                  className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Interested?
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInterestForm(false)}
                      className="flex-1 bg-gray-100 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                  {submitStatus === 'success' && (
                    <p className="text-green-600 text-sm">Thank you for your interest! We'll contact you soon.</p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 