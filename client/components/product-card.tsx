"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PrefetchLink } from "./prefetch-link"
import { useLikes } from "@/context/likes-context"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isLiked, toggleLike, getLikeCount } = useLikes()
  const [imageError, setImageError] = useState(false)
  const likeCount = getLikeCount(product.id)

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Здравствуйте! Хочу заказать: ${product.name} (${product.price.toLocaleString("ru-RU")} ₽)`,
    )
    window.open(`https://wa.me/79147195502?text=${message}`, "_blank")
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <PrefetchLink href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageError ? "/placeholder.svg?height=400&width=400" : product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Хит продаж</Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleLike(product.id)
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <div className="relative">
              <Heart className={`h-4 w-4 ${isLiked(product.id) ? "fill-red-500 text-red-500" : "text-foreground/60"}`} />
              {likeCount > 0 && (
                <span className="absolute -bottom-2 -right-2 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 w-4">
                  {likeCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </PrefetchLink>

      <CardContent className="pt-4">
        <PrefetchLink href={`/product/${product.id}`}>
          <h3 className="text-lg font-medium tracking-wide mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </PrefetchLink>
        <p className="text-sm font-light text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          {product.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light">{product.price.toLocaleString("ru-RU")} ₽</span>
        </div>

        {product.inStock > 0 ? (
          <p className="text-xs text-muted-foreground mt-2">В наличии: {product.inStock} шт.</p>
        ) : (
          <p className="text-xs text-destructive mt-2">Нет в наличии</p>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button onClick={handleWhatsAppOrder} disabled={product.inStock === 0} className="flex-1">
          <ShoppingCart className="h-4 w-4" />
          Заказать
        </Button>
        <Button variant="outline" asChild>
          <PrefetchLink href={`/product/${product.id}`}>Подробнее</PrefetchLink>
        </Button>
      </CardFooter>
    </Card>
  )
}
