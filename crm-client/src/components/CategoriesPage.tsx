"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, X, AlertTriangle } from "lucide-react"
import type { Category } from "../App"
import ModalPortal from "./ModalPortal"

interface CategoriesPageProps {
  categories: Category[]
  onAddCategory: (category: Omit<Category, "id">) => void
  onDeleteCategory: (id: string) => void
}

const colorOptions = [
  { value: "#10b981", label: "Зеленый" },
  { value: "#3b82f6", label: "Синий" },
  { value: "#f59e0b", label: "Оранжевый" },
  { value: "#8b5cf6", label: "Фиолетовый" },
  { value: "#ef4444", label: "Красный" },
  { value: "#ec4899", label: "Розовый" },
  { value: "#14b8a6", label: "Бирюзовый" },
]

export default function CategoriesPage({ categories, onAddCategory, onDeleteCategory }: CategoriesPageProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "#10b981",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddCategory(formData)
    setFormData({ name: "", color: "#10b981" })
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
            Категории
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-text-secondary)",
            }}
          >
            Управление категориями товаров
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
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
          Добавить категорию
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--color-border)",
              transition: "all 0.2s",
              position: "relative",
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
            <button
              onClick={() => {
                setCategoryToDelete(category.id)
                setShowDeleteConfirmation(true)
              }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                width: "32px",
                height: "32px",
                background: "transparent",
                color: "var(--color-text-secondary)",
                border: "none",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ef444415"
                e.currentTarget.style.color = "#ef4444"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "var(--color-text-secondary)"
              }}
            >
              <Trash2 size={16} />
            </button>

            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "var(--radius-lg)",
                background: `${category.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: category.color,
                }}
              />
            </div>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              {category.name}
            </h3>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
              }}
            >
              Цвет: {category.color}
            </p>
          </div>
        ))}
      </div>

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
                Вы действительно хотите удалить эту категорию? Это действие нельзя отменить.
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
                    if (categoryToDelete) {
                      onDeleteCategory(categoryToDelete)
                      setCategoryToDelete(null)
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

      {/* Модальное окно добавления категории */}
      <ModalPortal isOpen={showModal}>
          <div
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "450px",
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
                Добавить категорию
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
                    Название категории
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Букеты"
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
                    Цвет
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.75rem",
                    }}
                  >
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: option.value })}
                        style={{
                          padding: "0.75rem",
                          background: formData.color === option.value ? `${option.value}15` : "transparent",
                          border: `2px solid ${formData.color === option.value ? option.value : "var(--color-border)"}`,
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: option.value,
                          }}
                        />
                      </button>
                    ))}
                  </div>
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
                    onClick={() => setShowModal(false)}
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
                    Добавить
                  </button>
                </div>
              </div>
            </form>
          </div>
      </ModalPortal>
    </div>
  )
}
