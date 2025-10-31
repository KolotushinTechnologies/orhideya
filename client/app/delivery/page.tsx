import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Package, Phone, Truck, CreditCard } from "lucide-react"

export default function DeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-balance">
                Доставка и оплата
              </h1>
              <p className="text-lg font-light text-muted-foreground text-pretty">
                Быстрая и бережная доставка ваших букетов по Находке
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Info */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium tracking-wide mb-2">Бесплатная доставка</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      При заказе от 3000 ₽ доставка по Находке бесплатная
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium tracking-wide mb-2">Быстрая доставка</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      Доставим ваш заказ в течение 2-4 часов после оформления
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium tracking-wide mb-2">Бережная упаковка</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      Каждый букет упакован с особой заботой для сохранения свежести
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Zones */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-light tracking-wide mb-8 text-center">Зоны доставки</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 pb-6 border-b border-border/40">
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-wide mb-2">В пределах города</h3>
                      <p className="text-sm font-light text-muted-foreground mb-3">
                        Бесплатная доставка при заказе от 3000 ₽
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Стоимость:</span>
                        <span className="font-medium">300 ₽</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span className="text-muted-foreground">Время доставки:</span>
                        <span className="font-medium">2-4 часа</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-6 border-b border-border/40">
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-wide mb-2">За пределы города (до 10 км)</h3>
                      <p className="text-sm font-light text-muted-foreground mb-3">Доставка в ближайшие пригороды</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Стоимость:</span>
                        <span className="font-medium">500 ₽</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span className="text-muted-foreground">Время доставки:</span>
                        <span className="font-medium">3-5 часов</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-wide mb-2">За пределы города (более 10 км)</h3>
                      <p className="text-sm font-light text-muted-foreground mb-3">
                        Доставка в отдаленные районы Приморского края
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Стоимость:</span>
                        <span className="font-medium">50 ₽/км</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span className="text-muted-foreground">Время доставки:</span>
                        <span className="font-medium">По согласованию</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-light tracking-wide mb-8 text-center">Способы оплаты</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-wide mb-2">Банковской картой</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Принимаем карты Visa, MasterCard, МИР. Оплата производится через защищенное соединение
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-wide mb-2">Наличными курьеру</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Вы можете оплатить заказ наличными при получении
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-wide mb-2">Картой курьеру</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Курьер принимает оплату банковской картой через мобильный терминал
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide">Остались вопросы?</h2>
            <p className="text-base font-light text-muted-foreground">
              Свяжитесь с нами через WhatsApp, и мы с радостью ответим на все ваши вопросы
            </p>
            <Button size="lg" asChild>
              <a href="https://wa.me/79147195502" target="_blank" rel="noopener noreferrer">
                <Phone className="h-5 w-5" />
                Связаться в WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
