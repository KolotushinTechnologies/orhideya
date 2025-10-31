"use client"

import { useState } from "react"
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  tags: string[]
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
}

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>('login')

  return (
    <AuthProvider>
      {currentView === 'login' ? (
        <LoginPage onLogin={() => setCurrentView('dashboard')} />
      ) : (
        <ProtectedRoute requiredRole="admin">
          <Dashboard onLogout={() => setCurrentView('login')} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  )
}

export default App
