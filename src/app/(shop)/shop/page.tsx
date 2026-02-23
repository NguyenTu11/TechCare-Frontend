"use client"

import Link from "next/link"
import { useCategories, useBrands } from "@/hooks/useProduct"

export default function ShopHomePage() {
    const { categories, isLoading: catLoading } = useCategories()
    const { brands, isLoading: brandLoading } = useBrands()

    return (
        <div>
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Premium Tech,
                            <br />
                            <span className="text-primary-200">Protected.</span>
                        </h1>
                        <p className="mt-5 text-lg text-primary-100 max-w-lg">
                            Discover the latest electronics with comprehensive warranty and professional care services.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Link
                                href="/shop/products"
                                className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg hover:bg-gray-50 transition-all"
                            >
                                Browse Products
                                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/shop/categories"
                                className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all"
                            >
                                View Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            Shop by Category
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Find exactly what you need
                        </p>
                    </div>
                    <Link href="/shop/categories" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                        View all →
                    </Link>
                </div>
                {catLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.slice(0, 8).map((cat) => (
                            <Link
                                key={cat._id}
                                href={`/shop/products?category=${cat.slug}`}
                                className="group flex flex-col items-center justify-center rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5 transition-all"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-3 group-hover:scale-110 transition-transform">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark text-center">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        Top Brands
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Shop trusted brands
                    </p>
                </div>
                {brandLoading ? (
                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-16 w-32 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {brands.slice(0, 10).map((brand) => (
                            <Link
                                key={brand._id}
                                href={`/shop/products?brand=${brand.slug}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-5 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:border-primary-500/50 hover:shadow-md transition-all"
                            >
                                {brand.name}
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-950/30 dark:to-blue-950/30 border-y border-border-light dark:border-border-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        Warranty Protection Included
                    </h2>
                    <p className="mt-3 text-text-secondary-light dark:text-text-secondary-dark max-w-xl mx-auto">
                        Every purchase comes with comprehensive warranty coverage. Track, claim, and manage your warranties effortlessly.
                    </p>
                    <Link
                        href="/shop/warranties"
                        className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 transition-all"
                    >
                        View My Warranties
                    </Link>
                </div>
            </section>
        </div>
    )
}
