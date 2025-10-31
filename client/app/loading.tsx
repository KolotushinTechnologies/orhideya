"use client"

import { Flower2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-2 border-primary animate-spin absolute"></div>
          <div className="h-16 w-16 rounded-full border-b-2 border-primary animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="h-16 w-16 flex items-center justify-center">
            <Flower2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <p className="text-lg font-light text-muted-foreground animate-pulse">Загрузка...</p>
      </div>
    </div>
  )
}
