"use client"

import { useState } from "react"
import { useAdminWarranties, useAdminWarrantyMutation } from "@/hooks/useAdminWarranties"
import type { WarrantyStatus } from "@/types/warranty"

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    EXPIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    CLAIMED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    VOIDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const STATUSES: WarrantyStatus[] = ["ACTIVE", "EXPIRED", "CLAIMED", "VOIDED"]

export default function AdminWarrantiesPage() {
    const { warranties, isLoading, refetch } = useAdminWarranties()
    const { create, voidWarranty, isLoading: mutating } = useAdminWarrantyMutation()
    const [filter, setFilter] = useState<WarrantyStatus | "ALL">("ALL")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ orderId: "", variantId: "", warrantyMonths: "12", serialNumber: "" })
    const [error, setError] = useState("")

    const filtered = filter === "ALL" ? warranties : warranties.filter((w) => w.status === filter)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.orderId || !formData.variantId) return
        setError("")
        const result = await create({
            orderId: formData.orderId,
            variantId: formData.variantId,
            warrantyMonths: Number(formData.warrantyMonths),
            serialNumber: formData.serialNumber || undefined,
        })
        if (result) {
            setShowForm(false)
            setFormData({ orderId: "", variantId: "", warrantyMonths: "12", serialNumber: "" })
            refetch()
        } else {
            setError("Failed to create warranty")
        }
    }

    const handleVoid = async (id: string) => {
        if (!confirm("Are you sure you want to void this warranty?")) return
        const ok = await voidWarranty(id)
        if (ok) refetch()
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Warranty Management</h1>
                <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    {showForm ? "Cancel" : "Create Warranty"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">New Warranty</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Order ID *</label>
                            <input type="text" value={formData.orderId} onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Variant ID *</label>
                            <input type="text" value={formData.variantId} onChange={(e) => setFormData({ ...formData, variantId: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Warranty Months *</label>
                            <input type="number" min={1} max={120} value={formData.warrantyMonths} onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Serial Number</label>
                            <input type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={mutating} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                        {mutating ? "Creating..." : "Create"}
                    </button>
                </form>
            )}

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilter("ALL")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === "ALL" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                    All ({warranties.length})
                </button>
                {STATUSES.map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === s ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                        {s} ({warranties.filter((w) => w.status === s).length})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No warranties found</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Serial Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Period</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Start</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">End</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {filtered.map((w) => (
                                    <tr key={w._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark font-mono text-xs">{w._id.slice(-6)}</td>
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">{w.serialNumber ?? "-"}</td>
                                        <td className="px-4 py-3"><span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[w.status] ?? ""}`}>{w.status}</span></td>
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">{w.warrantyMonths}mo</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{new Date(w.startDate).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{new Date(w.endDate).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{new Date(w.createdAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-right">
                                            {w.status === "ACTIVE" && (
                                                <button onClick={() => handleVoid(w._id)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    Void
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
