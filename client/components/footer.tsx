import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-light tracking-wider text-primary mb-4">Орхидея</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Премиальный цветочный магазин с изысканными букетами и композициями для особенных моментов
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-foreground mb-4">Навигация</h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-sm font-light text-muted-foreground transition-colors hover:text-primary">
                Каталог
              </Link>
              <Link
                href="/delivery"
                className="text-sm font-light text-muted-foreground transition-colors hover:text-primary"
              >
                Доставка
              </Link>
              <Link
                href="/about"
                className="text-sm font-light text-muted-foreground transition-colors hover:text-primary"
              >
                О нас
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-foreground mb-4">Контакты</h4>
            <div className="flex flex-col space-y-3">
              <a
                href="https://wa.me/79147195502"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm font-light text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>+7 914 719 55 02</span>
              </a>
              <div className="flex items-center space-x-2 text-sm font-light text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@orchid-shop.ru</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-light text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Москва, Россия</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm font-light text-muted-foreground">
            © {new Date().getFullYear()} Орхидея. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
