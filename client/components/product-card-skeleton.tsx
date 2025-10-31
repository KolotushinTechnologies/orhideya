"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="pt-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
        
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full mb-1 bg-muted" />
        <Skeleton className="h-4 w-4/5 mb-3 bg-muted" />

        {/* Tags skeleton */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Skeleton className="h-5 w-16 bg-muted" />
          <Skeleton className="h-5 w-20 bg-muted" />
          <Skeleton className="h-5 w-14 bg-muted" />
        </div>

        {/* Price skeleton */}
        <Skeleton className="h-8 w-1/3 mb-2 bg-muted" />
        
        {/* Stock skeleton */}
        <Skeleton className="h-4 w-1/4 mt-2 bg-muted" />
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        {/* Buttons skeleton */}
        <Skeleton className="h-10 flex-1 bg-muted" />
        <Skeleton className="h-10 w-24 bg-muted" />
      </CardFooter>
    </Card>
  )
}
