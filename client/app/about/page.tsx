import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Award, Users, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-balance">О нас</h1>
              <p className="text-lg font-light text-muted-foreground text-pretty">
                Создаем незабываемые моменты с помощью изысканных цветочных композиций
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Story */}
            <div className="space-y-6">
              <h2 className="text-3xl font-light tracking-wide text-center">Наша история</h2>
              <div className="space-y-4 text-base font-light text-foreground/80 leading-relaxed">
                <p>
                  Орхидея — это премиальный цветочный магазин, который был создан с любовью к прекрасному и желанием
                  дарить радость людям. Мы верим, что цветы — это не просто подарок, а способ выразить самые искренние
                  чувства и эмоции.
                </p>
                <p>
                  Наша команда флористов с многолетним опытом создает уникальные композиции, используя только свежие
                  цветы премиум-класса от лучших поставщиков. Каждый букет — это произведение искусства, созданное с
                  вниманием к деталям и любовью к своему делу.
                </p>
                <p>
                  Мы гордимся тем, что помогаем нашим клиентам создавать незабываемые моменты и дарить радость своим
                  близким. Ваше доверие — наша главная награда.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="space-y-8">
              <h2 className="text-3xl font-light tracking-wide text-center">Наши ценности</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <Heart className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium tracking-wide">Качество</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Используем только свежие цветы премиум-класса от проверенных поставщиков
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium tracking-wide">Мастерство</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Наши флористы — профессионалы с многолетним опытом создания уникальных композиций
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium tracking-wide">Забота</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Индивидуальный подход к каждому клиенту и внимание к деталям
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="space-y-8">
              <h2 className="text-3xl font-light tracking-wide text-center">Почему выбирают нас</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-base font-light text-foreground/80 leading-relaxed">
                        <span className="font-medium">Свежесть гарантирована:</span> Все цветы поступают напрямую от
                        поставщиков и проходят строгий контроль качества
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-base font-light text-foreground/80 leading-relaxed">
                        <span className="font-medium">Уникальные композиции:</span> Каждый букет создается индивидуально
                        с учетом ваших пожеланий
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-base font-light text-foreground/80 leading-relaxed">
                        <span className="font-medium">Быстрая доставка:</span> Доставим ваш заказ в течение 2-4 часов по
                        Находке
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-base font-light text-foreground/80 leading-relaxed">
                        <span className="font-medium">Элегантная упаковка:</span> Каждый букет упакован с особой заботой
                        и вниманием к деталям
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-base font-light text-foreground/80 leading-relaxed">
                        <span className="font-medium">Персональный подход:</span> Мы всегда готовы помочь с выбором и
                        ответить на все ваши вопросы
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center space-y-6 pt-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-wide">Готовы сделать заказ?</h2>
              <p className="text-base font-light text-muted-foreground">
                Свяжитесь с нами через WhatsApp, и мы поможем выбрать идеальный букет
              </p>
              <Button size="lg" asChild>
                <a href="https://wa.me/79147195502" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5" />
                  Связаться в WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
