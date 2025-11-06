# Flower Shop API

A RESTful API for a flower shop e-commerce application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for products with advanced filtering, sorting, and pagination
- **Category & Tag Management**: Organize products with categories and tags
- **Image Upload**: Upload and manage product images
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Data Validation**: Input validation for all API endpoints
- **TypeScript**: Type-safe code with TypeScript
- **MongoDB**: NoSQL database with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/orchideya_dv
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
UPLOAD_DIR=uploads
```

## Running the Server

### Setup

```bash
# Copy images from client projects and seed the database
npm run setup

# Or run each step separately
npm run copy-images  # Copy images from client/public and client-crm/public to uploads directory
npm run seed         # Seed the database with initial data
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Documentation

### Authentication

#### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Get current user

```
GET /api/auth/me
```

Headers:
```
Authorization: Bearer <token>
```

### Products

#### Get all products

```
GET /api/products
```

Query parameters:
- `search`: Search products by name or description
- `select`: Select specific fields (comma-separated)
- `sort`: Sort by fields (comma-separated, prefix with - for descending)
- `page`: Page number
- `limit`: Number of items per page
- `category`: Filter by category ID
- `featured`: Filter by featured status (true/false)
- `price[gte]`: Price greater than or equal to
- `price[lte]`: Price less than or equal to
- `inStock[gt]`: In stock greater than

#### Get a single product

```
GET /api/products/:id
```

#### Create a new product

```
POST /api/products
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Red Roses Bouquet",
  "description": "Beautiful bouquet of red roses",
  "price": 4500,
  "category": "60d21b4667d0d8992e610c85",
  "images": ["/uploads/image-123456.jpg"],
  "inStock": 10,
  "featured": true,
  "tags": ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"]
}
```

#### Update a product

```
PUT /api/products/:id
```

Headers:
```
Authorization: Bearer <token>
```

Request body: (include only fields to update)
```json
{
  "price": 5000,
  "inStock": 15
}
```

#### Delete a product

```
DELETE /api/products/:id
```

Headers:
```
Authorization: Bearer <token>
```

#### Get featured products

```
GET /api/products/featured
```

Query parameters:
- `limit`: Number of featured products to return (default: 5)

#### Get products by category

```
GET /api/products/category/:categoryId
```

#### Get products by tag

```
GET /api/products/tag/:tagId
```

### Categories

#### Get all categories

```
GET /api/categories
```

#### Get a single category

```
GET /api/categories/:id
```

#### Create a new category

```
POST /api/categories
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Roses",
  "color": "#ff0000"
}
```

#### Update a category

```
PUT /api/categories/:id
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Premium Roses",
  "color": "#ff5555"
}
```

#### Delete a category

```
DELETE /api/categories/:id
```

Headers:
```
Authorization: Bearer <token>
```

### Tags

#### Get all tags

```
GET /api/tags
```

#### Get a single tag

```
GET /api/tags/:id
```

#### Create a new tag

```
POST /api/tags
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Premium"
}
```

#### Update a tag

```
PUT /api/tags/:id
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Luxury"
}
```

#### Delete a tag

```
DELETE /api/tags/:id
```

Headers:
```
Authorization: Bearer <token>
```

### File Upload

#### Upload a single image

```
POST /api/upload
```

Headers:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form data:
```
image: <file>
```

#### Upload multiple images

```
POST /api/upload/multiple
```

Headers:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form data:
```
images: <file1>
images: <file2>
...
```

## Error Handling

All errors are returned in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## License

MIT
