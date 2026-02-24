"use client"

import { useProducts } from "@/hooks/useProduct"
import type { Product } from "@/types/product"

interface SimilarProductsProps {
    currentProduct: Product
    limit?: number
}

export function SimilarProducts({ currentProduct, limit = 4 }: SimilarProductsProps) {
    const { products, isLoading } = useProducts({
        category: typeof currentProduct.category === "string" ? currentProduct.category : currentProduct.category._id,
        limit: limit + 1,
    })

    const similarProducts = products?.filter((p: Product) => p._id !== currentProduct._id).slice(0, limit)

    if (isLoading || !similarProducts || similarProducts.length === 0) {
        return null
    }

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {similarProducts.map((product) => (
                    <a
                        key={product._id}
                        href={`/shop/products/${product.slug}`}
                        className="group rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">
                                {typeof product.brand === "string" ? product.brand : product.brand?.name}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                Contact for price
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}
