import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Product } from '../models/Product';
import { auth } from '../middleware/auth';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Get all products (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { style, search } = req.query;
    let query: any = {};

    if (style) {
      query.style = style;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product (protected route)
router.post('/', auth, upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const { name, description, price, measurements, fit, style, tags } = req.body;
    const files = req.files as Express.Multer.File[];
    const images = files.map((file) => file.path);
    
    const product = new Product({
      name,
      description,
      price,
      images,
      measurements: JSON.parse(measurements),
      fit,
      style,
      tags: JSON.parse(tags),
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product (protected route)
router.put('/:id', auth, upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const { name, description, price, measurements, fit, style, tags } = req.body;
    const updateData: any = {
      name,
      description,
      price,
      measurements: JSON.parse(measurements),
      fit,
      style,
      tags: JSON.parse(tags),
    };

    const files = req.files as Express.Multer.File[];
    
    if (files && files.length > 0) {
      updateData.images = files.map((file) => file.path);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (protected route)
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router; 