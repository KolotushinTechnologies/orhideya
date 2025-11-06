import type { Product, Category } from "./App";

// Use the CORS proxy instead of directly accessing the API server
const API_URL = "https://api.orhideyanhk.ru/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
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

interface ServerTag {
  _id: string;
  name: string;
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
  let imageUrl = "https://api.orhideyanhk.ru/vibrant-flower-bouquet.png"; // Default image
  
  if (product.images && product.images.length > 0) {
    const imagePath = product.images[0];
    
    // Check if the image path is already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      imageUrl = imagePath;
    } 
    // Check if it's a path starting with /uploads
    else if (imagePath.startsWith('/uploads/')) {
      imageUrl = `https://api.orhideyanhk.ru${imagePath}`;
    }
    // Check if it's just a filename
    else if (!imagePath.includes('/')) {
      imageUrl = `https://api.orhideyanhk.ru/uploads/${imagePath}`;
    }
    // Otherwise, use as is
    else {
      imageUrl = imagePath;
    }
  }
  
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    image: imageUrl,
    images: product.images || [imageUrl],
    category: product.category.name,
    tags: product.tags.map(tag => tag.name),
    inStock: product.inStock || 0,
    description: product.description || "",
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
    let allProducts: ServerProduct[] = [];
    let page = 1;
    let hasMore = true;
    
    // Fetch all pages
    while (hasMore) {
      const response = await fetch(`${API_URL}/products?page=${page}&limit=100`, getFetchOptions());
      const data: ApiResponse<ServerProduct[]> = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch products');
      }
      
      allProducts = [...allProducts, ...data.data];
      
      // Check if there are more pages
      hasMore = data.pagination?.next !== undefined;
      page++;
    }
    
    console.log(`CRM: Loaded ${allProducts.length} products total`);
    return allProducts.map(mapServerProductToClient);
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
    
    console.log('Server response for created product:', data.data);
    const mappedProduct = mapServerProductToClient(data.data);
    console.log('Mapped product:', mappedProduct);
    
    return mappedProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (
  id: string,
  product: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    inStock?: number;
    featured?: boolean;
    tags?: string[];
    images?: string[];
  }
): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, getFetchOptions({
      method: 'PUT',
      body: JSON.stringify(product),
    }));
    
    const data: ApiResponse<ServerProduct> = await response.json();
    
    if (!data.success) {
      throw new Error(`Failed to update product with id ${id}`);
    }
    
    return mapServerProductToClient(data.data);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
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

// Get all tags
export const getTags = async (): Promise<ServerTag[]> => {
  try {
    const response = await fetch(`${API_URL}/tags`, getFetchOptions());
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch tags');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

// Create tag
export const createTag = async (name: string): Promise<ServerTag> => {
  try {
    const response = await fetch(`${API_URL}/tags`, getFetchOptions({
      method: 'POST',
      body: JSON.stringify({ name }),
    }));
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to create tag');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

// Find or create tags by names
export const findOrCreateTags = async (tagNames: string[]): Promise<string[]> => {
  try {
    // Get all existing tags
    const existingTags = await getTags();
    
    // Map of tag names to IDs
    const tagMap = new Map(existingTags.map(tag => [tag.name.toLowerCase(), tag._id]));
    
    // Array to store tag IDs
    const tagIds: string[] = [];
    
    // Process each tag name
    for (const name of tagNames) {
      const trimmedName = name.trim();
      if (!trimmedName) continue;
      
      const lowerName = trimmedName.toLowerCase();
      
      // If tag exists, use its ID
      if (tagMap.has(lowerName)) {
        tagIds.push(tagMap.get(lowerName)!);
      } else {
        // Otherwise create a new tag
        const newTag = await createTag(trimmedName);
        tagIds.push(newTag._id);
      }
    }
    
    return tagIds;
  } catch (error) {
    console.error('Error processing tags:', error);
    throw error;
  }
};

// Upload image
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
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
    
    console.log('Upload response:', data);
    
    // Make sure we return the filePath from the response
    // This should be a path like /uploads/image-filename.jpg
    if (data.data && data.data.filePath) {
      // Ensure the path starts with /uploads/
      if (!data.data.filePath.startsWith('/uploads/')) {
        return `/uploads/${data.data.filePath.split('/').pop()}`;
      }
      return data.data.filePath;
    } else {
      throw new Error('Invalid image path in server response');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
