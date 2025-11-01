import type { Product, ProductCategory } from "./types";

// Use the CORS proxy instead of directly accessing the API server
const API_URL = "http://localhost:8080/api";

export interface ApiResponse<T> {
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

export interface ServerProduct {
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

export interface ServerCategory {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Convert server product to client product
export const mapServerProductToClient = (product: ServerProduct): Product => {
  // Map server category name to client category type
  const categoryMapping: Record<string, ProductCategory> = {
    'Букеты': 'bouquets',
    'Розы': 'roses',
    'Тюльпаны': 'tulips',
    'Орхидеи': 'orchids',
    'Аксессуары': 'accessories'
  };
  
  // Use the mapping or default to the first category if not found
  const mappedCategory = categoryMapping[product.category.name] || 'bouquets';
  
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: mappedCategory,
    images: product.images.map(image => image.startsWith('/') ? `http://localhost:8080${image}` : `${API_URL}/uploads/${image}`),
    inStock: product.inStock,
    featured: product.featured,
    tags: product.tags.map(tag => tag.name),
  };
};

// Common fetch options
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };
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
        throw new Error("Failed to fetch products");
      }
      
      allProducts = [...allProducts, ...data.data];
      
      // Check if there are more pages
      hasMore = data.pagination?.next !== undefined;
      page++;
    }
    
    console.log(`Loaded ${allProducts.length} products total`);
    return allProducts.map(mapServerProductToClient);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/featured`, getFetchOptions());
    const data: ApiResponse<ServerProduct[]> = await response.json();
    
    if (!data.success) {
      throw new Error("Failed to fetch featured products");
    }
    
    return data.data.map(mapServerProductToClient);
  } catch (error) {
    console.error("Error fetching featured products:", error);
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

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${categoryId}`, getFetchOptions());
    const data: ApiResponse<ServerProduct[]> = await response.json();
    
    if (!data.success) {
      throw new Error(`Failed to fetch products for category ${categoryId}`);
    }
    
    return data.data.map(mapServerProductToClient);
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
};

// Get all categories
export const getCategories = async (): Promise<ServerCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`, getFetchOptions());
    const data: ApiResponse<ServerCategory[]> = await response.json();
    
    if (!data.success) {
      throw new Error("Failed to fetch categories");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
