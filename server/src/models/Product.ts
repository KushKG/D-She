import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
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

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [{
    type: String,
    required: true,
  }],
  measurements: {
    chest: {
      type: Number,
      required: true,
      min: 0,
    },
    waist: {
      type: Number,
      required: true,
      min: 0,
    },
    length: {
      type: Number,
      required: true,
      min: 0,
    }
  },
  fit: {
    type: String,
    required: true,
    enum: ['Relaxed', 'Normal', 'Fitted'],
    default: 'Normal'
  },
  style: {
    type: String,
    required: true,
    enum: ['Indian', 'Western', 'Indo Western'],
    default: 'Western'
  },
  tags: [{
    type: String,
    trim: true,
  }],
  material: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema); 