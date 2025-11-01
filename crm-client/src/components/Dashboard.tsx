"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "./Sidebar"
import DashboardHome from "./DashboardHome"
import ProductsPage from "./ProductsPage"
import CategoriesPage from "./CategoriesPage"
import type { Product, Category } from "../App"
import { getProducts, getProduct, getCategories, createProduct, updateProduct, deleteProduct, createCategory, deleteCategory, findOrCreateTags } from "../api"
import { useAuth } from "../context/AuthContext"

interface DashboardProps {
  onLogout?: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const { logout: authLogout } = useAuth()
  // Define page types
  type PageType = "dashboard" | "products" | "categories";
  
  // Get initial page from URL hash
  const getInitialPage = (): PageType => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'products' || hash === 'categories') {
        return hash;
      }
    }
    return "dashboard";
  };
  
  const [currentPage, setCurrentPage] = useState<PageType>(getInitialPage())
  
  // Update URL hash when page changes
  const updateHash = useCallback((page: PageType) => {
    if (typeof window !== 'undefined') {
      if (page === 'dashboard') {
        window.history.pushState(null, '', '#');
      } else {
        window.history.pushState(null, '', `#${page}`);
      }
    }
  }, []);
  
  // Handle page navigation
  const handlePageChange = useCallback((page: PageType) => {
    setCurrentPage(page);
    updateHash(page);
  }, [updateHash]);
  
  // Handle browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getInitialPage());
    };
    
    window.addEventListener('popstate', handleHashChange);
    
    return () => {
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleLogout = () => {
    // Call the logout function from the auth context
    authLogout()
    
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout()
    }
  }

  const addProduct = async (product: Omit<Product, "id" | "createdAt"> & { id?: string }) => {
    try {
      setLoading(true)
      
      // Process tags - convert tag names to tag IDs
      const tagIds = await findOrCreateTags(product.tags)
      
      // Convert to server format
      const serverProduct = {
        name: product.name,
        description: product.description || `Красивый ${product.name}`,  // Use description from form or default
        price: product.price,
        category: categories.find(c => c.name === product.category)?.id || "",
        inStock: product.inStock,  // Use the value from the form
        featured: false,
        tags: tagIds,
        images: product.images || (product.image ? [product.image] : [])
      }
      
      console.log('Product data:', serverProduct);
      
      let updatedProduct: Product;
      
      // If product has an ID, update it, otherwise create a new one
      if (product.id) {
        updatedProduct = await updateProduct(product.id, serverProduct)
        
        // Fetch the updated product again to get populated data
        const refreshedProduct = await getProduct(product.id)
        if (refreshedProduct) {
          updatedProduct = refreshedProduct
        }
        
        // Update the product in the list
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p))
      } else {
        // Create new product
        const createdProduct = await createProduct(serverProduct)
        
        // Fetch the created product again to get populated data (category and tags)
        const refreshedProduct = await getProduct(createdProduct.id)
        updatedProduct = refreshedProduct || createdProduct
        
        // Add new product at the beginning of the list
        setProducts([updatedProduct, ...products])
      }
    } catch (err) {
      console.error("Error adding product:", err)
      setError("Ошибка при добавлении товара")
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id: string) => {
    try {
      setLoading(true)
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting product:", err)
      setError("Ошибка при удалении товара")
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      setLoading(true)
      const newCategory = await createCategory(category)
      setCategories([...categories, newCategory])
    } catch (err) {
      console.error("Error adding category:", err)
      setError("Ошибка при добавлении категории")
    } finally {
      setLoading(false)
    }
  }

  const removeCategory = async (id: string) => {
    try {
      setLoading(true)
      await deleteCategory(id)
      setCategories(categories.filter((c) => c.id !== id))
    } catch (err) {
      console.error("Error deleting category:", err)
      setError("Ошибка при удалении категории")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar currentPage={currentPage} onNavigate={handlePageChange} onLogout={handleLogout} />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          padding: "2rem",
          background: "var(--color-bg-light)",
          minHeight: "100vh",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)" }}>Загрузка...</p>
          </div>
        ) : error ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <p style={{ fontSize: "1.125rem", color: "#ef4444" }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer"
              }}
            >
              Обновить страницу
            </button>
          </div>
        ) : (
          <>
            {currentPage === "dashboard" && <DashboardHome products={products} categories={categories} />}
            {currentPage === "products" && (
              <ProductsPage
                products={products}
                categories={categories}
                onAddProduct={addProduct}
                onDeleteProduct={removeProduct}
              />
            )}
            {currentPage === "categories" && (
              <CategoriesPage categories={categories} onAddCategory={addCategory} onDeleteCategory={removeCategory} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
