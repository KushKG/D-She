import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Product } from '../models/Product';
import { auth } from '../middleware/auth';

const router = express.Router();

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Helper function to upload image to S3
const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const key = `d-she/${Date.now()}-${file.originalname}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET || '',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  
  // Return the S3 URL
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// Helper function to delete image from S3
const deleteFromS3 = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the key from the S3 URL
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || '',
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};

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
    
    // Upload images to S3
    const imageUrls = await Promise.all(
      files.map(file => uploadToS3(file))
    );
    
    const product = new Product({
      name,
      description,
      price,
      images: imageUrls,
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
      // Upload new images to S3
      const imageUrls = await Promise.all(
        files.map(file => uploadToS3(file))
      );
      updateData.images = imageUrls;
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all images from S3
    await Promise.all(
      product.images.map(imageUrl => deleteFromS3(imageUrl))
    );

    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router; 