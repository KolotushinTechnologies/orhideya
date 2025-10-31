"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import DashboardHome from "./DashboardHome"
import ProductsPage from "./ProductsPage"
import CategoriesPage from "./CategoriesPage"
import type { Product, Category } from "../App"
import { getProducts, getCategories, createProduct, deleteProduct, createCategory, deleteCategory } from "../api"
import { useAuth } from "../context/AuthContext"

interface DashboardProps {
  onLogout?: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const { logout: authLogout } = useAuth()
  const [currentPage, setCurrentPage] = useState<"dashboard" | "products" | "categories">("dashboard")
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

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      setLoading(true)
      
      // Convert to server format
      const serverProduct = {
        name: product.name,
        description: `Красивый ${product.name}`,  // Default description
        price: product.price,
        category: categories.find(c => c.name === product.category)?.id || "",
        inStock: 10,  // Default stock
        featured: false,
        tags: product.tags,
        images: [product.image]
      }
      
      const newProduct = await createProduct(serverProduct)
      setProducts([...products, newProduct])
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
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
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
