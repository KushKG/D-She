import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const initAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not set in environment variables');
      console.log('\nPlease set MONGODB_URI in your environment variables:');
      console.log('For local development: mongodb://localhost:27017/d-she');
      console.log('For production: Your MongoDB Atlas connection string');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      password: 'admin123', // This will be hashed by the User model's pre-save hook
      isAdmin: true
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nPlease change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
};

initAdmin(); 