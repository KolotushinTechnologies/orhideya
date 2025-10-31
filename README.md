# Orhideya - Flower Shop Application

This project consists of three main components:
1. **Server** - Backend API built with Express and MongoDB
2. **Client** - Frontend e-commerce store built with Next.js
3. **CRM Client** - Admin panel for managing products and categories built with React

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Project Structure

```
orhideya/
├── server/         # Backend API
├── client/         # Frontend e-commerce store
└── crm-client/     # Admin panel
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/KolotushinTechnologies/orhideya.git
cd orhideya
```

### 2. Set up the server

```bash
cd server

# Install dependencies
npm install

# Copy images from client directories to server uploads folder
npm run copy-images

# Seed the database with initial data
npm run seed

# Create admin user
npm run seed-admin

# Start the development server
npm run dev
```

The server will run on http://localhost:5000

### 3. Set up the client (e-commerce store)

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The client will run on http://localhost:3000

### 4. Set up the CRM client (admin panel)

```bash
cd crm-client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The CRM client will run on http://localhost:5173

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/tag/:tagId` - Get products by tag

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Tags

- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get single tag
- `POST /api/tags` - Create new tag (admin only)
- `PUT /api/tags/:id` - Update tag (admin only)
- `DELETE /api/tags/:id` - Delete tag (admin only)

### File Upload

- `POST /api/upload` - Upload file (admin only)

## Admin Access

After running the seed scripts, you can log in to the CRM client with:

- Email: admin@example.com
- Password: admin123

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
UPLOAD_DIR=uploads
```

## License

This project is licensed under the MIT License.
