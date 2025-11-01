"use client"

import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 animate-spin" style={{ animationDuration: '2s' }}>
          <Image
            src="/logo.svg"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-lg font-light text-muted-foreground animate-pulse">Загрузка...</p>
      </div>
    </div>
  )
}
