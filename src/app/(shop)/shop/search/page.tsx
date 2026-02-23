"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSearch } from "@/hooks/useSearch"

function SearchContent() {
    const searchParams = useSearchParams()
    const initialQ = searchParams.get("q") ?? ""
    const [query, setQuery] = useState(initialQ)
    const { results, pagination, isLoading, search } = useSearch()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) search({ q: query.trim() })
    }

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Search</h1>
            <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                <button type="submit" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">Search</button>
            </form>

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((p) => (
                        <Link key={p._id} href={`/shop/products/${p.slug}`} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-4 hover:shadow-lg transition-all">
                            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark line-clamp-2">{p.name}</h3>
                        </Link>
                    ))}
                </div>
            ) : initialQ ? (
                <p className="text-center text-text-secondary-light dark:text-text-secondary-dark py-12">No results found</p>
            ) : null}
        </div>
    )
}

export default function SearchPage() {
    return <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>}><SearchContent /></Suspense>
}
