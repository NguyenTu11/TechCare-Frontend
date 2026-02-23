import type { Category } from "./category"
import type { Brand } from "./brand"

export interface Product {
    _id: string
    name: string
    slug: string
    description: string
    category: string | Category
    brand: string | Brand
    thumbnail?: string
    images?: string[]
    tags?: string[]
    isFeatured: boolean
    isActive: boolean
    avgRating: number
    reviewCount: number
    createdAt: string
    updatedAt: string
}
