"use client"

import type React from "react"

import { useState, useMemo, useEffect, useCallback } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import { SearchInputStable } from "@/components/search-input-stable"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts, getCategories } from "@/lib/api"
import type { FilterState, ProductCategory, Product } from "@/lib/types"

// Extended filter state to allow for category IDs from the API
interface ExtendedFilterState extends Omit<FilterState, 'category'> {
  category: string;
}

export default function CatalogPage() {
  const [filters, setFilters] = useState<ExtendedFilterState>({
    category: "all",
    priceRange: [0, 10000], // Default values that will be updated after products are loaded
    inStockOnly: false,
    searchQuery: "",
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{id: string, name: string, count: number}[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const productsData = await getProducts()
        setProducts(productsData)
        
        // Calculate min and max prices from actual products
        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price)
          const minPrice = Math.floor(Math.min(...prices) / 100) * 100 // Round down to nearest 100
          const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100 // Round up to nearest 100
          
          // Update filters with dynamic price range
          setFilters(prev => ({
            ...prev,
            priceRange: [minPrice, maxPrice]
          }))
        }
        
        const categoriesData = await getCategories()
        // Map server category names to client category types
        const categoryMapping: Record<string, ProductCategory> = {
          'Букеты': 'bouquets',
          'Розы': 'roses',
          'Тюльпаны': 'tulips',
          'Орхидеи': 'orchids',
          'Аксессуары': 'accessories'
        }
        
        const formattedCategories = [
          { id: "all", name: "Все товары", count: productsData.length },
          ...categoriesData.map(cat => ({
            id: cat._id,
            name: cat.name,
            count: productsData.filter(p => p.category === categoryMapping[cat.name]).length
          }))
        ]
        setCategories(formattedCategories)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Memoize the filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    // If no products loaded yet or categories not loaded, return all products
    if (products.length === 0 || categories.length === 0) return products;
    
    return products.filter((product) => {
      // Category filter
      if (filters.category !== "all") {
        const category = categories.find(c => c.id === filters.category)
        // Get the category name from the server and map it to client category type
        const categoryMapping: Record<string, ProductCategory> = {
          'Букеты': 'bouquets',
          'Розы': 'roses',
          'Тюльпаны': 'tulips',
          'Орхидеи': 'orchids',
          'Аксессуары': 'accessories'
        }
        if (category) {
          const mappedCategoryName = categoryMapping[category.name]
          if (mappedCategoryName && product.category !== mappedCategoryName) {
            return false
          }
        }
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStockOnly && product.inStock === 0) {
        return false
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesDescription = product.description.toLowerCase().includes(query)
        const matchesTags = product.tags?.some((tag) => tag.toLowerCase().includes(query))
        return matchesName || matchesDescription || matchesTags
      }

      return true
    })
  }, [filters, products, categories])

  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId }))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: [value[0], value[1]] }))
  }

  const handleStockToggle = () => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
  }

  // Handle search from the SearchInputStable component
  // Use useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    setFilters(prev => {
      // Only update if the value actually changed
      if (prev.searchQuery === query) return prev
      return { ...prev, searchQuery: query }
    })
  }, [])

  const resetFilters = () => {
    // Get min and max prices from current products
    let minPrice = 0
    let maxPrice = 10000
    
    if (products.length > 0) {
      const prices = products.map(p => p.price)
      minPrice = Math.floor(Math.min(...prices) / 100) * 100
      maxPrice = Math.ceil(Math.max(...prices) / 100) * 100
    }
    
    setFilters({
      category: "all",
      priceRange: [minPrice, maxPrice],
      inStockOnly: false,
      searchQuery: "",
    })
  }

  const FilterSidebar = useMemo(() => (
    <aside className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide">Поиск</h3>
        <SearchInputStable
          placeholder="Найти букет..."
          onSearch={handleSearch}
          disabled={loading}
          value={filters.searchQuery}
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide">Категории</h3>
        <div className="space-y-2">
          {loading ? (
            // Skeleton categories during loading
            Array(5).fill(0).map((_, index) => (
              <div 
                key={index}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md"
              >
                <Skeleton className="h-5 w-24 bg-muted" />
                <Skeleton className="h-5 w-8 bg-muted rounded-full" />
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-light transition-colors ${
                  filters.category === cat.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat.name}</span>
                <Badge variant="outline" className="text-xs">
                  {cat.count}
                </Badge>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium tracking-wide">Цена</h3>
        <div className="px-2">
          {loading ? (
            <>
              <Skeleton className="h-5 w-full mb-4 bg-muted" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 bg-muted" />
                <Skeleton className="h-5 w-16 bg-muted" />
              </div>
            </>
          ) : (
            <>
              <Slider
                min={products.length > 0 ? Math.floor(Math.min(...products.map(p => p.price)) / 100) * 100 : 0}
                max={products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 10000}
                step={100}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                className="mb-4"
                disabled={loading}
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.priceRange[0].toLocaleString("ru-RU")} ₽</span>
                <span>{filters.priceRange[1].toLocaleString("ru-RU")} ₽</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide">Наличие</h3>
        {loading ? (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 bg-muted" />
            <Skeleton className="h-5 w-32 bg-muted" />
          </div>
        ) : (
          <label className="flex items-center space-x-3 cursor-pointer">
            <Checkbox checked={filters.inStockOnly} onCheckedChange={handleStockToggle} disabled={loading} />
            <span className="text-sm font-light text-foreground/80">Только в наличии</span>
          </label>
        )}
      </div>

      {/* Reset Filters */}
      <Button variant="outline" onClick={resetFilters} className="w-full bg-transparent" disabled={loading}>
        Сбросить фильтры
      </Button>
    </aside>
  ), [filters, categories, loading, handleSearch, handleCategoryChange, handlePriceRangeChange, handleStockToggle, resetFilters, products])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-balance">
                Изысканные букеты для особенных моментов
              </h1>
              <p className="text-lg font-light text-muted-foreground text-pretty">
                Премиальные цветочные композиции с доставкой по Находке
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                {FilterSidebar}
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full mb-6"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </Button>

              {mobileFiltersOpen && (
                <div className="mb-8 p-6 border border-border rounded-lg bg-card">
                  {FilterSidebar}
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Найдено товаров: <span className="font-medium text-foreground">{filteredProducts.length}</span>
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">Товары не найдены</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
