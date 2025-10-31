"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { getProducts, getCategories } from "@/lib/api"
import type { FilterState, ProductCategory, Product } from "@/lib/types"

// Extended filter state to allow for category IDs from the API
interface ExtendedFilterState extends Omit<FilterState, 'category'> {
  category: string;
}

export default function CatalogPage() {
  const [filters, setFilters] = useState<ExtendedFilterState>({
    category: "all",
    priceRange: [2000, 8000],
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

  // Filter products based on current filters
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
  }

  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [2000, 8000],
      inStockOnly: false,
      searchQuery: "",
    })
  }

  const FilterSidebar = () => (
    <aside className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide">Поиск</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Найти букет..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide">Категории</h3>
        <div className="space-y-2">
              {categories.map((cat) => (
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
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium tracking-wide">Цена</h3>
        <div className="px-2">
          <Slider
            min={2000}
            max={8000}
            step={100}
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.priceRange[0].toLocaleString("ru-RU")} ₽</span>
            <span>{filters.priceRange[1].toLocaleString("ru-RU")} ₽</span>
          </div>
        </div>
      </div>

      {/* Stock Availability */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide">Наличие</h3>
        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox checked={filters.inStockOnly} onCheckedChange={handleStockToggle} />
          <span className="text-sm font-light text-foreground/80">Только в наличии</span>
        </label>
      </div>

      {/* Reset Filters */}
      <Button variant="outline" onClick={resetFilters} className="w-full bg-transparent">
        Сбросить фильтры
      </Button>
    </aside>
  )

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
                Премиальные цветочные композиции с доставкой по Москве
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
                <FilterSidebar />
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
                  <FilterSidebar />
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
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">Загрузка товаров...</p>
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
