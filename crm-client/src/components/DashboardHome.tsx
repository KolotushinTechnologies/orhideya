"use client"

import { Package, Tag, TrendingUp, TrendingDown } from "lucide-react"
import type { Product, Category } from "../App"

interface DashboardHomeProps {
  products: Product[]
  categories: Category[]
}

export default function DashboardHome({ products, categories }: DashboardHomeProps) {
  const totalProducts = products.length
  const totalCategories = categories.length
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  const stats = [
    {
      label: "Всего товаров",
      value: totalProducts,
      change: "+12.5%",
      isPositive: true,
      color: "#10b981",
      icon: Package,
    },
    {
      label: "Категорий",
      value: totalCategories,
      change: "+8.2%",
      isPositive: true,
      color: "#3b82f6",
      icon: Tag,
    },
    {
      label: "Общая стоимость",
      value: `₽${totalValue.toLocaleString()}`,
      change: "-2.4%",
      isPositive: false,
      color: "#f59e0b",
      icon: Package,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "var(--color-text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Дашборд
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-text-secondary)",
          }}
        >
          Обзор ключевых показателей вашего магазина
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown

          return (
            <div
              key={index}
              style={{
                background: "var(--color-bg-card)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--color-border)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-sm)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {stat.label}
                </p>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={stat.color} />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {stat.value}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: stat.isPositive ? "#10b981" : "#ef4444",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  <TrendIcon size={16} />
                  {stat.change}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "var(--color-text-primary)",
            marginBottom: "1.5rem",
          }}
        >
          Последние товары
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <img
                src={product.image || "http://localhost:8080/placeholder.svg"}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "1rem" }}>
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: "600",
                    color: "var(--color-text-primary)",
                    marginBottom: "0.5rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: "var(--color-primary)",
                  }}
                >
                  ₽{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
