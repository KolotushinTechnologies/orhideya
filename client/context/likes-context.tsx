"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LikesContextType {
  likedProducts: Record<string, number>
  toggleLike: (productId: string) => void
  getLikeCount: (productId: string) => number
  isLiked: (productId: string) => boolean
}

const LikesContext = createContext<LikesContextType | undefined>(undefined)

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<Record<string, number>>({})
  const [userIdentifier, setUserIdentifier] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Generate a simple user identifier based on IP hash or random value
  useEffect(() => {
    const generateUserIdentifier = async () => {
      try {
        // Try to get a consistent identifier from an IP service
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        const ipHash = btoa(data.ip).substring(0, 10) // Simple "hash" of the IP
        setUserIdentifier(ipHash)
      } catch (error) {
        // Fallback to a random identifier if the service is unavailable
        const randomId = Math.random().toString(36).substring(2, 12)
        setUserIdentifier(randomId)
      }
    }

    generateUserIdentifier()
  }, [])

  // Load liked products from localStorage on initial render
  useEffect(() => {
    if (!userIdentifier) return

    const storedLikes = localStorage.getItem(`likes_${userIdentifier}`)
    if (storedLikes) {
      try {
        setLikedProducts(JSON.parse(storedLikes))
      } catch (error) {
        console.error("Failed to parse stored likes:", error)
        setLikedProducts({})
      }
    }
    setIsInitialized(true)
  }, [userIdentifier])

  // Save liked products to localStorage whenever they change
  useEffect(() => {
    if (!userIdentifier || !isInitialized) return
    
    localStorage.setItem(`likes_${userIdentifier}`, JSON.stringify(likedProducts))
  }, [likedProducts, userIdentifier, isInitialized])

  // Toggle like for a product
  const toggleLike = (productId: string) => {
    setLikedProducts((prev) => {
      const newLikes = { ...prev }
      
      if (isLiked(productId)) {
        // If already liked by this user, remove the like
        delete newLikes[productId]
      } else {
        // If not liked by this user, add a like
        newLikes[productId] = (newLikes[productId] || 0) + 1
      }
      
      return newLikes
    })
  }

  // Get like count for a product
  const getLikeCount = (productId: string) => {
    return likedProducts[productId] || 0
  }

  // Check if a product is liked by the current user
  const isLiked = (productId: string) => {
    return !!likedProducts[productId]
  }

  return (
    <LikesContext.Provider value={{ likedProducts, toggleLike, getLikeCount, isLiked }}>
      {children}
    </LikesContext.Provider>
  )
}

export function useLikes() {
  const context = useContext(LikesContext)
  if (context === undefined) {
    throw new Error("useLikes must be used within a LikesProvider")
  }
  return context
}
