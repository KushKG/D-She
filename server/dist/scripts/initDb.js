"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
const initializeDb = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/d-she');
        console.log('Connected to MongoDB');
        // Check if admin user exists
        const adminExists = await User_1.User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        // Create admin user
        const admin = new User_1.User({
            username: 'admin',
            password: 'admin123', // Change this in production
        });
        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};
initializeDb();
