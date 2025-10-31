"use client"

import { useState } from "react"
import { LayoutDashboard, Package, Tag, LogOut, Flower2, AlertTriangle } from "lucide-react"
import ModalPortal from "./ModalPortal"

interface SidebarProps {
  currentPage: "dashboard" | "products" | "categories"
  onNavigate: (page: "dashboard" | "products" | "categories") => void
  onLogout: () => void
}

export default function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  
  const menuItems = [
    { id: "dashboard" as const, label: "Дашборд", icon: LayoutDashboard },
    { id: "products" as const, label: "Товары", icon: Package },
    { id: "categories" as const, label: "Категории", icon: Tag },
  ]

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 6px -1px rgb(0 0 0 / 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid var(--color-border-dark)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Flower2 size={24} color="white" />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: "700",
              color: "var(--color-text-white)",
              lineHeight: "1.2",
            }}
          >
            Орхидея Админ
          </h2>
          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-text-light)",
              opacity: 0.7,
            }}
          >
            от KolTech Pro 1n
          </p>
        </div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <a
              key={item.id}
              href={item.id === "dashboard" ? "#" : `#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1rem",
                background: isActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
                color: isActive ? "#10b981" : "var(--color-text-light)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9375rem",
                fontWeight: isActive ? "600" : "500",
                textAlign: "left",
                transition: "all 0.2s",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                }
              }}
            >
              <Icon size={20} />
              {item.label}
            </a>
          )
        })}
      </nav>

      <button
        onClick={() => setShowLogoutConfirmation(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.875rem 1rem",
          background: "transparent",
          color: "var(--color-text-light)",
          border: "1px solid var(--color-border-dark)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.9375rem",
          fontWeight: "500",
          transition: "all 0.2s",
          marginTop: "auto",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"
          e.currentTarget.style.borderColor = "#ef4444"
          e.currentTarget.style.color = "#ef4444"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent"
          e.currentTarget.style.borderColor = "var(--color-border-dark)"
          e.currentTarget.style.color = "var(--color-text-light)"
        }}
      >
        <LogOut size={20} />
        Выход
      </button>

      {/* Диалог подтверждения выхода */}
      <ModalPortal isOpen={showLogoutConfirmation}>
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
                Подтверждение выхода
              </h3>
              
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "1.5rem",
                }}
              >
                Вы действительно хотите выйти из системы?
              </p>
              
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  width: "100%",
                }}
              >
                <button
                  onClick={() => setShowLogoutConfirmation(false)}
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
                    onLogout();
                    setShowLogoutConfirmation(false);
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
                  Выйти
                </button>
              </div>
            </div>
          </div>
      </ModalPortal>
    </aside>
  )
}
