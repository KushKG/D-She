# D-She E-commerce Platform

A modern e-commerce platform for women's fashion, built with React, Node.js, and MongoDB.

## Features

- User authentication and authorization
- Product management with image uploads
- Shopping cart functionality
- Responsive design
- Admin dashboard for product management

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- File Storage: Local storage (uploads directory)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd d-she
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
d-she/
├── client/             # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
├── server/             # Backend Node.js application
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   └── uploads/        # Product image uploads
└── README.md
```

## License

MIT 