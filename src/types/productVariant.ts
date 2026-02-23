export interface ProductVariant {
    _id: string
    product: string
    sku: string
    costPrice: number
    price: number
    salePrice?: number
    stock: number
    lowStockThreshold: number
    lowStockNotified: boolean
    attributes: Record<string, string>
    isActive: boolean
    createdAt: string
    updatedAt: string
}
