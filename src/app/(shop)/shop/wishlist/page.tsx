"use client"

import Link from "next/link"
import { useWishlist } from "@/hooks/useWishlist"
import type { Product } from "@/types/product"

export default function WishlistPage() {
    const { wishlist, isLoading, removeItem } = useWishlist()
    const items = wishlist?.items ?? []

    if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Wishlist</h1>
            {items.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">Your wishlist is empty</p>
                    <Link href="/shop/products" className="text-sm font-medium text-primary-600 hover:underline">Discover products →</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => {
                        const product = (typeof item.product === "object" ? item.product : null) as Product | null
                        const productId = typeof item.product === "string" ? item.product : item.product._id
                        return (
                            <div key={productId} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden">
                                <Link href={product?.slug ? `/shop/products/${product.slug}` : "#"}>
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                        {product?.thumbnail ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" /> : <span className="text-2xl">{product?.name?.charAt(0) ?? "?"}</span>}
                                    </div>
                                </Link>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">{product?.name ?? "Product"}</h3>
                                    </div>
                                    <button onClick={() => removeItem(productId)} className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Remove">✕</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
