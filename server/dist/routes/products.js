"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const Product_1 = require("../models/Product");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Configure multer for image upload
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    },
});
// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const { style, search } = req.query;
        let query = {};
        if (style) {
            query.style = style;
        }
        if (search) {
            query.$text = { $search: search };
        }
        const products = await Product_1.Product.find(query);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});
// Get single product (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});
// Create product (protected route)
router.post('/', auth_1.auth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, measurements, fit, style, tags } = req.body;
        const files = req.files;
        const images = files.map((file) => file.path);
        const product = new Product_1.Product({
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
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});
// Update product (protected route)
router.put('/:id', auth_1.auth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, measurements, fit, style, tags } = req.body;
        const updateData = {
            name,
            description,
            price,
            measurements: JSON.parse(measurements),
            fit,
            style,
            tags: JSON.parse(tags),
        };
        const files = req.files;
        if (files && files.length > 0) {
            updateData.images = files.map((file) => file.path);
        }
        const product = await Product_1.Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});
// Delete product (protected route)
router.delete('/:id', auth_1.auth, async (req, res) => {
    try {
        const product = await Product_1.Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.default = router;
