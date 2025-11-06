"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, X, Upload, AlertTriangle, Edit } from "lucide-react"
import type { Product, Category } from "../App"
import ModalPortal from "./ModalPortal"
import MultipleImageUploader from "./MultipleImageUploader"

interface ProductsPageProps {
  products: Product[]
  categories: Category[]
  onAddProduct: (product: Omit<Product, "id" | "createdAt"> & { id?: string }) => void
  onDeleteProduct: (id: string) => void
}

export default function ProductsPage({ products, categories, onAddProduct, onDeleteProduct }: ProductsPageProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: "", // For editing
    name: "",
    price: "",
    images: [] as string[],
    category: "",
    tags: "",
    inStock: "10", // Default stock
    description: "", // Description field
    featured: false, // Featured status
  })
  
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12
  
  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, endIndex)
  
  // Reset to page 1 when products change
  const [prevProductsLength, setPrevProductsLength] = useState(products.length)
  if (products.length !== prevProductsLength) {
    setPrevProductsLength(products.length)
    setCurrentPage(1)
  }
  
  const handleImagesUploaded = (imagePaths: string[]) => {
    setFormData({ ...formData, images: imagePaths })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        image: formData.images.length > 0 ? formData.images[0] : "https://api.orhideyanhk.ru/vibrant-flower-bouquet.png",
        images: formData.images,
        category: formData.category,
        inStock: Number(formData.inStock),
        description: formData.description,
        featured: formData.featured,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }
      
      if (isEditMode && formData.id) {
        // Pass the ID for editing
        onAddProduct({
          ...productData,
          id: formData.id
        })
      } else {
        onAddProduct(productData)
      }

    setFormData({ id: "", name: "", price: "", images: [], category: "", tags: "", inStock: "10", description: "", featured: false })
    setIsEditMode(false)
    setShowModal(false)
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "var(--color-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Товары
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-text-secondary)",
            }}
          >
            Управление товарами вашего магазина
          </p>
        </div>

        <button
          onClick={() => {
            // Reset form data when opening the modal for adding a new product
            setFormData({ id: "", name: "", price: "", images: [], category: "", tags: "", inStock: "10", description: "", featured: false })
            setIsEditMode(false)
            setShowModal(true)
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: "0.9375rem",
            fontWeight: "600",
            boxShadow: "0 4px 6px -1px rgb(16 185 129 / 0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(16 185 129 / 0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(16 185 129 / 0.3)"
          }}
        >
          <Plus size={20} />
          Добавить товар
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {currentProducts.map((product) => (
          <div
            key={product.id}
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--color-border)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-md)"
              e.currentTarget.style.transform = "translateY(-4px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-sm)"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
                <div style={{ position: "relative" }}>
              <img
                src={product.image || "https://api.orhideyanhk.ru/placeholder.svg"}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    // Set form data for editing
                    setFormData({
                      id: product.id,
                      name: product.name,
                      price: product.price.toString(),
                      images: product.images || [product.image],
                      category: product.category,
                      tags: product.tags.join(", "),
                      inStock: product.inStock.toString(),
                      description: product.description || "",
                      featured: false, // Will be set from product data when we add it to Product type
                    })
                    setIsEditMode(true)
                    setShowModal(true)
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(59, 130, 246, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3b82f6"
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.9)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    setProductToDelete(product.id)
                    setShowDeleteConfirmation(true)
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ef4444"
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {product.name}
              </h3>

              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--color-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                ₽{product.price.toLocaleString()}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    background: "#3b82f615",
                    color: "#3b82f6",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    fontWeight: "500",
                  }}
                >
                  {product.category}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.375rem",
                }}
              >
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "0.125rem 0.5rem",
                      background: "var(--color-bg-light)",
                      color: "var(--color-text-secondary)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              background: currentPage === 1 ? "var(--color-bg-light)" : "var(--color-bg-card)",
              color: currentPage === 1 ? "var(--color-text-secondary)" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            Предыдущая
          </button>
          
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: "40px",
                  height: "40px",
                  background: currentPage === page 
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                    : "var(--color-bg-card)",
                  color: currentPage === page ? "white" : "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: currentPage === page ? "600" : "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = "var(--color-bg-light)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = "var(--color-bg-card)"
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              background: currentPage === totalPages ? "var(--color-bg-light)" : "var(--color-bg-card)",
              color: currentPage === totalPages ? "var(--color-text-secondary)" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            Следующая
          </button>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <ModalPortal isOpen={showDeleteConfirmation}>
          <div
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "#fef2f2",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <AlertTriangle size={28} color="#ef4444" />
              </div>
              
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                Подтверждение удаления
              </h3>
              
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "1.5rem",
                }}
              >
                Вы действительно хотите удалить этот товар? Это действие нельзя отменить.
              </p>
              
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  width: "100%",
                }}
              >
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "var(--color-bg-light)",
                    color: "var(--color-text-primary)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.9375rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Отмена
                </button>
                
                <button
                  onClick={() => {
                    if (productToDelete) {
                      onDeleteProduct(productToDelete)
                      setProductToDelete(null)
                    }
                    setShowDeleteConfirmation(false)
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.9375rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
      </ModalPortal>

      {/* Модальное окно добавления товара */}
      <ModalPortal isOpen={showModal}>
          <div
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
                <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                }}
              >
                {isEditMode ? "Редактировать товар" : "Добавить товар"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormData({ id: "", name: "", price: "", images: [], category: "", tags: "", inStock: "10", description: "", featured: false })
                  setIsEditMode(false)
                }}
                style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-light)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Название товара
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Букет роз"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#ffffff",
                      color: "#1e293b",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Цена (₽)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500"
                    required
                    min="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#ffffff",
                      color: "#1e293b",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Изображения товара
                  </label>
                  <MultipleImageUploader 
                    onImagesUploaded={handleImagesUploaded}
                    initialImages={formData.images}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Категория
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#ffffff",
                      color: "#1e293b",
                    }}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Количество в наличии
                  </label>
                  <input
                    type="number"
                    value={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.value })}
                    placeholder="10"
                    min="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#ffffff",
                      color: "#1e293b",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Описание товара
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Красивый букет из свежих цветов..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#ffffff",
                      color: "#1e293b",
                      minHeight: "100px",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Теги (через запятую)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="розы, красный, романтика"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      background: "#ffffff",
                      color: "#1e293b",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span>Хит продаж</span>
                  </label>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      marginTop: "0.25rem",
                      marginLeft: "1.625rem",
                    }}
                  >
                    Товар будет отмечен как "Хит продаж" на сайте
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setFormData({ id: "", name: "", price: "", images: [], category: "", tags: "", inStock: "10", description: "", featured: false })
                      setIsEditMode(false)
                    }}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      background: "transparent",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      fontWeight: "600",
                      transition: "all 0.2s",
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9375rem",
                      fontWeight: "600",
                      boxShadow: "0 4px 6px -1px rgb(16 185 129 / 0.3)",
                      transition: "all 0.2s",
                    }}
                  >
                    {isEditMode ? "Сохранить" : "Добавить"}
                  </button>
                </div>
              </div>
            </form>
          </div>
      </ModalPortal>
    </div>
  )
}
