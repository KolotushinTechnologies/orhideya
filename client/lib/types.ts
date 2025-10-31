export type ProductCategory = "bouquets" | "roses" | "tulips" | "orchids" | "accessories"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  inStock: number
  featured?: boolean
  tags?: string[]
}

export interface FilterState {
  category: ProductCategory | "all"
  priceRange: [number, number]
  inStockOnly: boolean
  searchQuery: string
}
