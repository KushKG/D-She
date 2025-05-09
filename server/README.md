# D-She Backend Server

This is the backend server for the D-She boutique dress storefront application. It provides a RESTful API for managing products and user authentication.

## Features

- RESTful API endpoints for product management
- JWT-based authentication
- Image upload support
- MongoDB database integration
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/d-she
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. Initialize the database with an admin user:
   ```bash
   npm run init-db
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Deployment

The server can be deployed to platforms like Render or Railway:

1. Push your code to GitHub
2. Create a new service on Render/Railway
3. Connect your repository
4. Configure environment variables
5. Set the build command: `npm run build`
6. Set the start command: `npm start`

## Security

- All routes except product listing and details require authentication
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- File uploads are restricted to image files only
- Environment variables are used for sensitive data

## License

MIT 