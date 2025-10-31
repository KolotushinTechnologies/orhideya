"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { LinkProps } from "next/link"
import type { ReactNode } from "react"

interface PrefetchLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  prefetchDelay?: number
}

export function PrefetchLink({
  href,
  children,
  className,
  prefetchDelay = 200,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter()
  const [isPrefetching, setIsPrefetching] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    // Set a timer to delay prefetching
    const newTimer = setTimeout(() => {
      setIsPrefetching(true)
      // Prefetch the page
      router.prefetch(href.toString())
    }, prefetchDelay)
    
    setTimer(newTimer)
  }

  const handleMouseLeave = () => {
    // Clear the timer if the user moves the mouse away before prefetching starts
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [timer])

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  )
}
