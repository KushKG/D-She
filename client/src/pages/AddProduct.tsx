import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    style: 'Western',
    material: '',
    measurements: {
      chest: '',
      waist: '',
      length: ''
    },
    fit: 'Normal',
    tags: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('style', formData.style);
      formDataToSend.append('material', formData.material);
      formDataToSend.append('measurements', JSON.stringify({
        chest: Number(formData.measurements.chest),
        waist: Number(formData.measurements.waist),
        length: Number(formData.measurements.length)
      }));
      formDataToSend.append('fit', formData.fit);
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      // Append each image file
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        navigate('/admin');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create product');
      }
    } catch (err) {
      setError('An error occurred while creating the product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('measurements.')) {
      const measurementField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 md:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Add New Product</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="style" className="block text-xs sm:text-sm font-medium text-gray-700">
            Style
          </label>
          <select
            id="style"
            name="style"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
            value={formData.style}
            onChange={handleChange}
          >
            <option value="Indian">Indian</option>
            <option value="Western">Western</option>
            <option value="Indo Western">Indo Western</option>
          </select>
        </div>

        <div>
          <label htmlFor="fit" className="block text-xs sm:text-sm font-medium text-gray-700">
            Fit
          </label>
          <select
            id="fit"
            name="fit"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
            value={formData.fit}
            onChange={handleChange}
          >
            <option value="Relaxed">Relaxed</option>
            <option value="Normal">Normal</option>
            <option value="Fitted">Fitted</option>
          </select>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-4">Measurements (in inches)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label htmlFor="chest" className="block text-xs sm:text-sm font-medium text-gray-700">
                Chest
              </label>
              <input
                type="number"
                id="chest"
                name="measurements.chest"
                required
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
                value={formData.measurements.chest}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="waist" className="block text-xs sm:text-sm font-medium text-gray-700">
                Waist
              </label>
              <input
                type="number"
                id="waist"
                name="measurements.waist"
                required
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
                value={formData.measurements.waist}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="length" className="block text-xs sm:text-sm font-medium text-gray-700">
                Length
              </label>
              <input
                type="number"
                id="length"
                name="measurements.length"
                required
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
                value={formData.measurements.length}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="material" className="block text-xs sm:text-sm font-medium text-gray-700">
            Material
          </label>
          <input
            type="text"
            id="material"
            name="material"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-xs sm:text-sm min-h-[44px]"
            value={formData.material}
            onChange={handleChange}
            placeholder="e.g., Cotton, Silk, Polyester"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {images.map((image, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-gray-200">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 text-xs shadow">×</button>
            </div>
          ))}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="block w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs sm:file:text-sm file:bg-earth-50 file:text-earth-700 hover:file:bg-earth-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-earth-600 text-white font-semibold rounded-md py-3 mt-2 hover:bg-earth-700 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2 min-h-[44px]"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct; 