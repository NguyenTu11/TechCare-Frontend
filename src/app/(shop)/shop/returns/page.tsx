"use client"

import { useState } from "react"
import { useReturns, useCreateReturn, useCancelReturn } from "@/hooks/useReturn"
import type { ReturnType } from "@/types/return"

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function ShopReturnsPage() {
    const { returns, isLoading, refetch } = useReturns()
    const { create, isLoading: submitting, error: createError } = useCreateReturn()
    const { cancel } = useCancelReturn()
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        orderId: "",
        type: "REFUND" as ReturnType,
        variantId: "",
        quantity: "1",
        reason: "",
        note: "",
    })

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.orderId || !formData.variantId || !formData.reason) return
        setError("")
        const result = await create({
            orderId: formData.orderId,
            type: formData.type,
            items: [{ variantId: formData.variantId, quantity: Number(formData.quantity), reason: formData.reason }],
            note: formData.note || undefined,
        })
        if (result) {
            setShowForm(false)
            setFormData({ orderId: "", type: "REFUND", variantId: "", quantity: "1", reason: "", note: "" })
            refetch()
        } else if (createError) {
            setError(createError)
        }
    }

    const handleCancel = async (id: string) => {
        if (!confirm("Cancel this return request?")) return
        const ok = await cancel(id)
        if (ok) {
            refetch()
        }
    }

    if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Returns & Refunds</h1>
                <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    {showForm ? "Cancel" : "New Return"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6 mb-6 space-y-4">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Create Return Request</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Order ID *</label>
                            <input type="text" value={formData.orderId} onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Type *</label>
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ReturnType })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark">
                                <option value="REFUND">Refund</option>
                                <option value="EXCHANGE">Exchange</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Variant ID *</label>
                            <input type="text" value={formData.variantId} onChange={(e) => setFormData({ ...formData, variantId: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Quantity *</label>
                            <input type="number" min={1} value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Reason * (min 10 characters)</label>
                        <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required minLength={10} rows={2} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 resize-none text-text-primary-light dark:text-text-primary-dark" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Note (optional)</label>
                        <input type="text" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={submitting} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                        {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            )}

            {returns.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">No return requests yet</p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Click &quot;New Return&quot; to create a return request for a delivered order</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {returns.map((r) => (
                        <div key={r._id} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{r.returnNumber}</p>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">{r.type} &middot; {r.items.length} item(s) &middot; {new Date(r.createdAt).toLocaleDateString("vi-VN")}</p>
                                </div>
                                <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${statusColors[r.status] ?? ""}`}>{r.status}</span>
                            </div>
                            {r.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                                    <span className="font-mono text-xs">Variant: {item.variant}</span> &middot; Qty: {item.quantity} &middot; {item.reason}
                                </div>
                            ))}
                            {r.note && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 italic">Note: {r.note}</p>}
                            {r.adminNote && <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">Admin: {r.adminNote}</p>}
                            {r.refundAmount != null && <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">Refund: {r.refundAmount.toLocaleString("vi-VN")}d</p>}
                            {r.status === "PENDING" && (
                                <button onClick={() => handleCancel(r._id)} className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    Cancel Request
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
