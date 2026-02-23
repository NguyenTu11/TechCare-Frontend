"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useComparison } from "@/hooks/useComparison"
import type { Category } from "@/types/category"
import type { Brand } from "@/types/brand"

const getCategoryName = (cat: string | Category) => (typeof cat === "object" ? cat.name : cat)
const getBrandName = (brand: string | Brand) => (typeof brand === "object" ? brand.name : brand)

export default function ComparisonPage() {
    const searchParams = useSearchParams()
    const [inputValue, setInputValue] = useState("")
    const [productIds, setProductIds] = useState<string[]>([])
    const stableIds = useMemo(() => productIds, [JSON.stringify(productIds)])
    const { products, isLoading, error } = useComparison(stableIds)

    useEffect(() => {
        const ids = searchParams.get("ids")
        if (ids) {
            const parsed = ids.split(",").filter(Boolean)
            if (parsed.length >= 2) setProductIds(parsed)
        }
    }, [searchParams])

    const handleAdd = () => {
        const id = inputValue.trim()
        if (!id || productIds.includes(id) || productIds.length >= 4) return
        setProductIds((prev) => [...prev, id])
        setInputValue("")
    }

    const handleRemove = (id: string) => {
        setProductIds((prev) => prev.filter((p) => p !== id))
    }

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Compare Products</h1>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6 mb-8">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    Enter product IDs to compare (2-4 products). You can also use URL params: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">?ids=id1,id2,id3</code>
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Paste product ID..."
                        className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!inputValue.trim() || productIds.length >= 4}
                        className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        Add
                    </button>
                </div>
                {productIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {productIds.map((id) => (
                            <span key={id} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-300">
                                {id.slice(-8)}
                                <button onClick={() => handleRemove(id)} className="hover:text-red-500 transition-colors">&times;</button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="flex min-h-[30vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
                </div>
            )}

            {error && <p className="text-sm text-red-500 text-center mb-6">{error}</p>}

            {!isLoading && products.length === 0 && productIds.length < 2 && (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <svg className="mx-auto h-12 w-12 text-text-secondary-light dark:text-text-secondary-dark mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">Add at least 2 product IDs to compare</p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Compare specifications, prices, and features side by side</p>
                </div>
            )}

            {!isLoading && products.length >= 2 && (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider w-36">Attribute</th>
                                    {products.map((p) => (
                                        <th key={p._id} className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                {p.thumbnail ? (
                                                    <img src={p.thumbnail} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg text-gray-400">{p.name.charAt(0)}</div>
                                                )}
                                                <span className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark">{p.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                <Row label="Category" values={products.map((p) => getCategoryName(p.category))} />
                                <Row label="Brand" values={products.map((p) => getBrandName(p.brand))} />
                                <Row label="Rating" values={products.map((p) => p.avgRating ? p.avgRating.toFixed(1) + " / 5" : "N/A")} />
                                <Row label="Reviews" values={products.map((p) => String(p.reviewCount ?? 0))} />
                                <Row label="Featured" values={products.map((p) => p.isFeatured ? "Yes" : "No")} />
                                <Row label="Description" values={products.map((p) => {
                                    const d = p.description ?? ""
                                    return d.length > 120 ? d.slice(0, 120) + "..." : d
                                })} />
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

function Row({ label, values }: { label: string; values: string[] }) {
    return (
        <tr>
            <td className="px-6 py-3 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">{label}</td>
            {values.map((v, i) => (
                <td key={i} className="px-6 py-3 text-center text-text-primary-light dark:text-text-primary-dark">{v}</td>
            ))}
        </tr>
    )
}
