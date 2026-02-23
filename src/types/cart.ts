export interface CartItemVariant {
    _id: string
    sku: string
    price: number
    salePrice?: number
    stock: number
    isActive: boolean
    product: {
        _id: string
        name: string
        slug: string
        thumbnail?: string
    }
}

export interface CartItem {
    variant: CartItemVariant
    sku: string
    price: number
    salePrice?: number
    quantity: number
    attributes: Record<string, string>
}

export interface Cart {
    _id: string
    user: string
    items: CartItem[]
    createdAt: string
    updatedAt: string
}
