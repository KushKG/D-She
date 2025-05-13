import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';

const styleOptions = ['Indo Western', 'Western', 'Indian'];
const fitOptions = ['Relaxed', 'Normal', 'Fitted'];

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    style: 'Indo Western',
    material: '',
    favorite: false,
    measurements: {
      chest: '',
      waist: '',
      length: ''
    },
    fit: 'Normal',
    images: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            style: data.style || 'Indo Western',
            material: data.material || '',
            favorite: !!data.favorite,
            measurements: {
              chest: data.measurements?.chest?.toString() || '',
              waist: data.measurements?.waist?.toString() || '',
              length: data.measurements?.length?.toString() || ''
            },
            fit: data.fit || 'Normal',
            images: data.images || [],
          });
        } else {
          setError('Failed to fetch product');
        }
      } catch (err) {
        setError('An error occurred while fetching product');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

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
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const requestBody = {
        ...formData,
        price: Number(formData.price),
        measurements: JSON.stringify({
          chest: Number(formData.measurements.chest),
          waist: Number(formData.measurements.waist),
          length: Number(formData.measurements.length)
        }),
        tags: JSON.stringify([]), // Send empty tags array as JSON string
      };
      console.log('Sending update request:', requestBody);

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (response.ok) {
        setSuccess('Product updated successfully!');
        setTimeout(() => navigate('/admin'), 1200);
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('An error occurred while updating product');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8 mt-8 sm:mt-12">
      <h2 className="text-xl sm:text-2xl font-bold text-earth-800 mb-4 sm:mb-6 font-proxima">Edit Product</h2>
      {error && <div className="mb-4 text-red-600 font-proxima text-xs sm:text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-600 font-proxima text-xs sm:text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input w-full min-h-[44px] text-xs sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input w-full text-xs sm:text-sm"
            rows={3}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input w-full min-h-[44px] text-xs sm:text-sm"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Style</label>
            <select
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="input w-full min-h-[44px] text-xs sm:text-sm"
              required
            >
              {styleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Material</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="input w-full min-h-[44px] text-xs sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Fit</label>
          <select
            name="fit"
            value={formData.fit}
            onChange={handleChange}
            className="input w-full min-h-[44px] text-xs sm:text-sm"
            required
          >
            {fitOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-earth-700 mb-1 font-proxima">Measurements (inches)</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="block text-xs text-earth-600 mb-1">Chest</label>
              <input
                type="number"
                name="measurements.chest"
                value={formData.measurements.chest}
                onChange={handleChange}
                className="input w-full min-h-[44px] text-xs sm:text-sm"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-earth-600 mb-1">Waist</label>
              <input
                type="number"
                name="measurements.waist"
                value={formData.measurements.waist}
                onChange={handleChange}
                className="input w-full min-h-[44px] text-xs sm:text-sm"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-earth-600 mb-1">Length</label>
              <input
                type="number"
                name="measurements.length"
                value={formData.measurements.length}
                onChange={handleChange}
                className="input w-full min-h-[44px] text-xs sm:text-sm"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="favorite"
            checked={formData.favorite}
            onChange={handleChange}
            id="favorite"
            className="form-checkbox h-5 w-5 text-yellow-500"
          />
          <label htmlFor="favorite" className="text-xs sm:text-sm font-medium text-earth-700 font-proxima">Mark as Handpicked Favorite</label>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary font-proxima w-full min-h-[44px] text-xs sm:text-sm">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 