"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useProducts, useCategories, useBrands } from "@/hooks/useProduct"

function ProductCard({ product }: { product: import("@/types/product").Product }) {
    return (
        <Link
            href={`/shop/products/${product.slug}`}
            className="group rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-500/30 transition-all"
        >
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                        </svg>
                    </div>
                )}
                {product.avgRating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        {product.avgRating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {product.name}
                </h3>
                {product.reviewCount > 0 && (
                    <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {product.reviewCount} reviews
                    </p>
                )}
            </div>
        </Link>
    )
}

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const categoryFilter = searchParams.get("category") ?? undefined
    const brandFilter = searchParams.get("brand") ?? undefined

    const params = useMemo(
        () => ({ category: categoryFilter, brand: brandFilter, limit: 20 }),
        [categoryFilter, brandFilter]
    )

    const { products, pagination, isLoading, error, refetch } = useProducts(params)
    const { categories } = useCategories()
    const { brands } = useBrands()

    const [page, setPage] = useState(1)

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {categoryFilter ? `Category: ${categoryFilter}` : brandFilter ? `Brand: ${brandFilter}` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {pagination ? `${pagination.total} products found` : "Loading..."}
            </p>

            <div className="mt-8 flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5 space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                                Categories
                            </h3>
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href="/shop/products"
                                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!categoryFilter ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                    >
                                        All
                                    </Link>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat._id}>
                                        <Link
                                            href={`/shop/products?category=${cat.slug}`}
                                            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${categoryFilter === cat.slug ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                                Brands
                            </h3>
                            <ul className="space-y-1">
                                {brands.map((brand) => (
                                    <li key={brand._id}>
                                        <Link
                                            href={`/shop/products?brand=${brand.slug}`}
                                            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${brandFilter === brand.slug ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                        >
                                            {brand.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                                    <div className="aspect-square" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                                        <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                            <p className="text-text-secondary-light dark:text-text-secondary-dark">No products found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {products.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setPage(i + 1)
                                        refetch({ ...params, page: i + 1 })
                                    }}
                                    className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${page === i + 1
                                            ? "bg-primary-600 text-white shadow-md"
                                            : "border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
