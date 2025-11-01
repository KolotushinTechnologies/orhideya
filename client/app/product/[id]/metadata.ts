import { Metadata } from "next"
import { getProduct } from "@/lib/api"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }): Promise<Metadata> {
  try {
    // Handle both Promise and non-Promise params
    const resolvedParams = 'then' in params ? await params : params
    const product = await getProduct(resolvedParams.id)
    
    if (!product) {
      return {
        title: "Товар не найден | Орхидея",
        description: "Запрашиваемый товар не найден в нашем каталоге",
      }
    }
    
    return {
      title: `${product.name} | Орхидея`,
      description: product.description,
      keywords: product.tags?.join(", ") || "",
    }
  } catch (error) {
    return {
      title: "Ошибка загрузки товара | Орхидея",
      description: "Произошла ошибка при загрузке информации о товаре",
    }
  }
}
