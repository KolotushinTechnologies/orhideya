import { use } from "react"
import ProductClient from "./product-client"

// Import the metadata from a separate file
export { generateMetadata } from "./metadata"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  return <ProductClient id={id} />
}
