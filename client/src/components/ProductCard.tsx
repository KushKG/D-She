import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    style: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={`http://localhost:5000/${product.images[0]}`}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.style}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard; 