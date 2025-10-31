"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ProductDetailSkeleton() {
  return (
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
            <Skeleton className="h-full w-full" />
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4 mb-4 bg-muted" />
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Skeleton className="h-6 w-20 bg-muted" />
              <Skeleton className="h-6 w-24 bg-muted" />
              <Skeleton className="h-6 w-16 bg-muted" />
            </div>
          </div>

          <Skeleton className="h-10 w-1/3 bg-muted" />

          <Skeleton className="h-5 w-1/4 bg-muted" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-4/5 bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1 bg-muted" />
            <Skeleton className="h-12 w-12 bg-muted" />
            <Skeleton className="h-12 w-12 bg-muted" />
          </div>

          {/* Product Features */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <Skeleton className="h-5 w-1/3 mb-4 bg-muted" />
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 bg-muted" />
                  <Skeleton className="h-4 w-2/3 bg-muted" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 bg-muted" />
                  <Skeleton className="h-4 w-4/5 bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <Skeleton className="h-8 w-48 mb-8 bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                <Skeleton className="h-6 w-1/3 bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
