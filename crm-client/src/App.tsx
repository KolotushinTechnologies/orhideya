"use client"

import { useState, useEffect } from "react"
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard"
import { AuthProvider, useAuth } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  tags: string[]
  inStock: number
  description: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>(
    isAuthenticated ? 'dashboard' : 'login'
  )

  // Update view when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('dashboard')
    } else {
      setCurrentView('login')
    }
  }, [isAuthenticated])

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Загрузка...</div>
      </div>
    )
  }

  return (
    <>
      {currentView === 'login' ? (
        <LoginPage onLogin={() => setCurrentView('dashboard')} />
      ) : (
        <ProtectedRoute requiredRole="admin">
          <Dashboard onLogout={() => setCurrentView('login')} />
        </ProtectedRoute>
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
