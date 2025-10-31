import type { Product, Category } from "./App";

// Use the CORS proxy instead of directly accessing the API server
const API_URL = "http://localhost:8080/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

interface ServerProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    color: string;
  };
  images: string[];
  inStock: number;
  featured: boolean;
  tags: { _id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

interface ServerCategory {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Headers with auth token
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Common fetch options
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  };
};

// Convert server product to client product
export const mapServerProductToClient = (product: ServerProduct): Product => {
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.images.length > 0 
      ? (product.images[0].startsWith('/') 
          ? `http://localhost:8080${product.images[0]}` 
          : `${API_URL}/uploads/${product.images[0]}`)
      : "http://localhost:8080/vibrant-flower-bouquet.png",
    category: product.category.name,
    tags: product.tags.map(tag => tag.name),
    createdAt: new Date(product.createdAt),
  };
};

// Convert server category to client category
export const mapServerCategoryToClient = (category: ServerCategory): Category => {
  return {
    id: category._id,
    name: category.name,
    color: category.color,
  };
};

// Login
export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, getFetchOptions({
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }));
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Set the auth token in the API module
    setAuthToken(data.token);
    
    // Return the token for the auth context
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout
export const logout = () => {
  setAuthToken(null);
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`, getFetchOptions());
    
    const data: ApiResponse<ServerProduct[]> = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch products');
    }
    
    return data.data.map(mapServerProductToClient);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get single product
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, getFetchOptions());
    
    const data: ApiResponse<ServerProduct> = await response.json();
    
    if (!data.success) {
      throw new Error(`Failed to fetch product with id ${id}`);
    }
    
    return mapServerProductToClient(data.data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

// Create product
export const createProduct = async (product: {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  featured?: boolean;
  tags?: string[];
  images?: string[];
}): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products`, getFetchOptions({
      method: 'POST',
      body: JSON.stringify(product),
    }));
    
    const data: ApiResponse<ServerProduct> = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to create product');
    }
    
    return mapServerProductToClient(data.data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, getFetchOptions({
      method: 'DELETE',
    }));
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Failed to delete product with id ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`, getFetchOptions());
    
    const data: ApiResponse<ServerCategory[]> = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch categories');
    }
    
    return data.data.map(mapServerCategoryToClient);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Create category
export const createCategory = async (category: {
  name: string;
  color: string;
}): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/categories`, getFetchOptions({
      method: 'POST',
      body: JSON.stringify(category),
    }));
    
    const data: ApiResponse<ServerCategory> = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to create category');
    }
    
    return mapServerCategoryToClient(data.data);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, getFetchOptions({
      method: 'DELETE',
    }));
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Failed to delete category with id ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

// Upload image
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // For FormData, we don't set Content-Type as the browser will set it with the boundary
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to upload image');
    }
    
    return data.data.path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
