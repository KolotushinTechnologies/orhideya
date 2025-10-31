"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ModalPortalProps {
  children: React.ReactNode
  isOpen: boolean
}

export default function ModalPortal({ children, isOpen }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Disable scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  // Create a portal to render the modal outside of the component hierarchy
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      {children}
    </div>,
    document.body
  )
}
