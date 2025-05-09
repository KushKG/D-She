import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '24h' }
    );

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key') as any;
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: { ...user.toObject(), isAdmin: decoded.isAdmin } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router; 