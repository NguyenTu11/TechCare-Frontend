import type { Product } from "./product"

export interface WishlistItem {
    product: string | Product
    addedAt: string
}

export interface Wishlist {
    _id: string
    user: string
    items: WishlistItem[]
    createdAt: string
    updatedAt: string
}
