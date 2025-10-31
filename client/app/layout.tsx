import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LikesProvider } from "@/context/likes-context"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Орхидея — Премиальный цветочный магазин",
  description: "Изысканные букеты и цветочные композиции с доставкой",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <LikesProvider>
          {children}
        </LikesProvider>
        <Analytics />
      </body>
    </html>
  )
}
