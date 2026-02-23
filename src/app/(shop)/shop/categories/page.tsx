"use client"

import Link from "next/link"
import { useCategories } from "@/hooks/useProduct"

export default function CategoriesPage() {
    const { categories, isLoading } = useCategories()

    if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Categories</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <Link key={cat._id} href={`/shop/products?category=${cat.slug}`} className="group flex flex-col items-center justify-center rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-8 hover:border-primary-500/50 hover:shadow-lg transition-all">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                        </div>
                        <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{cat.name}</span>
                        {cat.description && <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center line-clamp-2">{cat.description}</p>}
                    </Link>
                ))}
            </div>
        </div>
    )
}
