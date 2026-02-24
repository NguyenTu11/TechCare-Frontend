"use client"

import { useState, useMemo } from "react"
import { useAdminProducts, useAdminProductMutation } from "@/hooks/useAdminProducts"

export default function AdminProductsPage() {
    const [page, setPage] = useState(1)
    const [deleting, setDeleting] = useState<string | null>(null)

    const params = useMemo(() => ({ page, limit: 10 }), [page])
    const { products, pagination, isLoading: loading, error, refetch } = useAdminProducts(params)
    const { remove } = useAdminProductMutation()

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product?")) return
        setDeleting(id)
        const ok = await remove(id)
        setDeleting(null)
        if (ok) refetch(params)
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Products</h1>
                <a href="/admin/products/create" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">Create Product</a>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
            ) : products.length === 0 ? (
                <p className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">No products found</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Rating</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Active</th>
                                    <th className="px-4 py-3 text-right font-semibold text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <a href={`/admin/products/${p._id}`} className="font-medium text-text-primary-light dark:text-text-primary-dark truncate max-w-xs hover:text-primary-600 dark:hover:text-primary-400 block">{p.name}</a>
                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{p.slug}</p>
                                        </td>
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">{p.avgRating?.toFixed(1) ?? "\u2014"}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block h-2 w-2 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <a href={`/admin/products/${p._id}`} className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
                                                    Edit
                                                </a>
                                                <button type="button" onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors">
                                                    {deleting === p._id ? "..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark">Prev</button>
                            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{page} / {pagination.totalPages}</span>
                            <button type="button" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark">Next</button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
