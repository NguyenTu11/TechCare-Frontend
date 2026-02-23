"use client"

import { useState } from "react"
import { useAdminBrands, useAdminBrandMutation } from "@/hooks/useAdminBrands"

export default function AdminBrandsPage() {
    const { brands, isLoading: loading, error, refetch } = useAdminBrands()
    const { create, remove, isLoading: mutating } = useAdminBrandMutation()
    const [name, setName] = useState("")
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        const fd = new FormData()
        fd.append("name", name.trim())
        const result = await create(fd)
        if (result) {
            setName("")
            refetch()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this brand?")) return
        setDeleting(id)
        const ok = await remove(id)
        setDeleting(null)
        if (ok) refetch()
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Brands</h1>

            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleCreate} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Add Brand</h2>
                <div className="grid sm:grid-cols-1 gap-3">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brand name" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                </div>
                <button type="submit" disabled={mutating || !name.trim()} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    {mutating ? "Creating..." : "Create"}
                </button>
            </form>

            {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
            ) : brands.length === 0 ? (
                <p className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">No brands</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map((b) => (
                        <div key={b._id} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-4 flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{b.name}</p>
                                <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-1 font-mono">{b.slug}</p>
                            </div>
                            <button type="button" onClick={() => handleDelete(b._id)} disabled={deleting === b._id} className="ml-2 text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors shrink-0">
                                {deleting === b._id ? "..." : "Delete"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
