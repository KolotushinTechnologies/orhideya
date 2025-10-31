"use client"

import Link from "next/link"
import { Menu, Phone, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-3xl font-light tracking-wider text-primary transition-colors group-hover:text-accent">
              Орхидея
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-light tracking-wide text-foreground/80 transition-colors hover:text-primary"
            >
              Каталог
            </Link>
            <Link
              href="/delivery"
              className="text-sm font-light tracking-wide text-foreground/80 transition-colors hover:text-primary"
            >
              Доставка
            </Link>
            <Link
              href="/about"
              className="text-sm font-light tracking-wide text-foreground/80 transition-colors hover:text-primary"
            >
              О нас
            </Link>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://wa.me/79147195502"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm font-light text-foreground/80 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              <span>+7 914 719 55 02</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in-up">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-light tracking-wide text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link
                href="/delivery"
                className="text-sm font-light tracking-wide text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Доставка
              </Link>
              <Link
                href="/about"
                className="text-sm font-light tracking-wide text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                О нас
              </Link>
              <a
                href="https://wa.me/79147195502"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm font-light text-foreground/80 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>+7 914 719 55 02</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
