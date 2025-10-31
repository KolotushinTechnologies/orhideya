import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide">Товар не найден</h1>
          <p className="text-lg font-light text-muted-foreground">
            К сожалению, запрашиваемый товар не существует или был удален
          </p>
          <Button asChild size="lg">
            <Link href="/">Вернуться к каталогу</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
