"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Create new user
        const user = new User_1.User({ username, password });
        await user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '24h' });
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user
        const user = await User_1.User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '24h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.default = router;
