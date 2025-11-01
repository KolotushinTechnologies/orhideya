"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

const API_URL = "http://localhost:8080/api"

interface LikesContextType {
  likedProducts: Set<string>
  likeCounts: Record<string, number>
  toggleLike: (productId: string) => Promise<void>
  getLikeCount: (productId: string) => number
  isLiked: (productId: string) => boolean
  loading: boolean
}

const LikesContext = createContext<LikesContextType | undefined>(undefined)

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  // Load user likes and all like counts on mount
  useEffect(() => {
    const loadLikes = async () => {
      try {
        // Load user's liked products (by IP)
        const userLikesResponse = await fetch(`${API_URL}/likes/user`)
        const userLikesData = await userLikesResponse.json()
        
        if (userLikesData.success) {
          setLikedProducts(new Set(userLikesData.data))
        }

        // Load all like counts
        const countsResponse = await fetch(`${API_URL}/likes/counts`)
        const countsData = await countsResponse.json()
        
        if (countsData.success) {
          setLikeCounts(countsData.data)
        }
      } catch (error) {
        console.error("Error loading likes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLikes()
  }, [])

  // Toggle like for a product with optimistic update
  const toggleLike = async (productId: string) => {
    const wasLiked = likedProducts.has(productId)
    const currentCount = likeCounts[productId] || 0
    
    // Optimistic update - update UI immediately
    setLikedProducts(prev => {
      const newSet = new Set(prev)
      if (wasLiked) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
    
    setLikeCounts(prev => ({
      ...prev,
      [productId]: wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
    }))

    try {
      // Send request to server
      const response = await fetch(`${API_URL}/products/${productId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        // Update with actual server data
        setLikedProducts(prev => {
          const newSet = new Set(prev)
          if (data.data.liked) {
            newSet.add(productId)
          } else {
            newSet.delete(productId)
          }
          return newSet
        })

        setLikeCounts(prev => ({
          ...prev,
          [productId]: data.data.likeCount,
        }))
      } else {
        // Revert optimistic update on error
        setLikedProducts(prev => {
          const newSet = new Set(prev)
          if (wasLiked) {
            newSet.add(productId)
          } else {
            newSet.delete(productId)
          }
          return newSet
        })
        
        setLikeCounts(prev => ({
          ...prev,
          [productId]: currentCount,
        }))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      
      // Revert optimistic update on error
      setLikedProducts(prev => {
        const newSet = new Set(prev)
        if (wasLiked) {
          newSet.add(productId)
        } else {
          newSet.delete(productId)
        }
        return newSet
      })
      
      setLikeCounts(prev => ({
        ...prev,
        [productId]: currentCount,
      }))
    }
  }

  // Get like count for a product
  const getLikeCount = (productId: string) => {
    return likeCounts[productId] || 0
  }

  // Check if a product is liked by the current user
  const isLiked = (productId: string) => {
    return likedProducts.has(productId)
  }

  return (
    <LikesContext.Provider value={{ likedProducts, likeCounts, toggleLike, getLikeCount, isLiked, loading }}>
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
