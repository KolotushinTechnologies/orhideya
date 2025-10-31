"use client"

import { useState, use, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Heart, Share2, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getProduct, getProducts } from "@/lib/api"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState<boolean[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const productData = await getProduct(id)
        
        if (!productData) {
          notFound()
        }
        
        setProduct(productData)
        
        // Get related products
        const allProducts = await getProducts()
        const related = allProducts
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 3)
        
        setRelatedProducts(related)
      } catch (error) {
        console.error("Error fetching product:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Загрузка товара...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Здравствуйте! Хочу заказать: ${product.name} (${product.price.toLocaleString("ru-RU")} ₽)`,
    )
    window.open(`https://wa.me/79147195502?text=${message}`, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Ссылка скопирована в буфер обмена")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Назад к каталогу
            </Link>
          </Button>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={
                    imageError[selectedImage] ? "/placeholder.svg?height=800&width=800" : product.images[selectedImage]
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  onError={() => {
                    const newErrors = [...imageError]
                    newErrors[selectedImage] = true
                    setImageError(newErrors)
                  }}
                />
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Хит продаж</Badge>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg bg-muted transition-all ${
                        selectedImage === index ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imageError[index] ? "/placeholder.svg?height=200&width=200" : image}
                        alt={`${product.name} - изображение ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => {
                          const newErrors = [...imageError]
                          newErrors[index] = true
                          setImageError(newErrors)
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-balance">{product.name}</h1>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {product.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-light">{product.price.toLocaleString("ru-RU")} ₽</span>
              </div>

              {product.inStock > 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>В наличии: {product.inStock} шт.</span>
                </div>
              ) : (
                <div className="text-sm text-destructive">Нет в наличии</div>
              )}

              <p className="text-base font-light text-foreground/80 leading-relaxed">{product.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleWhatsAppOrder} disabled={product.inStock === 0} size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5" />
                  Заказать в WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Product Features */}
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium tracking-wide mb-4">Информация о товаре</h3>
                  <ul className="space-y-3 text-sm font-light text-foreground/80">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Свежие цветы премиум-класса</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Бесплатная доставка по Москве</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Элегантная упаковка в подарок</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Открытка с персональным поздравлением</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-light tracking-wide mb-8">Похожие товары</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                    <Card className="group overflow-hidden transition-all hover:shadow-lg">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Image
                          src={relatedProduct.images[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-medium tracking-wide mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-xl font-light">{relatedProduct.price.toLocaleString("ru-RU")} ₽</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
