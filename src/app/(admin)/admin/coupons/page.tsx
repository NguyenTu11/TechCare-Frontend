"use client"

import { useState } from "react"
import { useAdminCoupons, useAdminCouponMutation } from "@/hooks/useAdminCoupons"
import { createCouponSchema } from "@/schemas/coupon"

function formatCurrency(n: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)
}

export default function AdminCouponsPage() {
    const { coupons, pagination, isLoading: loading, refetch } = useAdminCoupons()
    const { create, update, remove, isLoading: mutating } = useAdminCouponMutation()
    const [deleting, setDeleting] = useState<string | null>(null)
    const [editing, setEditing] = useState<string | null>(null)
    const [editCode, setEditCode] = useState("")
    const [editType, setEditType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE")
    const [editValue, setEditValue] = useState("")
    const [editMinOrderAmount, setEditMinOrderAmount] = useState("")
    const [editMaxDiscount, setEditMaxDiscount] = useState("")
    const [editUsageLimit, setEditUsageLimit] = useState("")
    const [editExpiresAt, setEditExpiresAt] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [code, setCode] = useState("")
    const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE")
    const [value, setValue] = useState("")
    const [minOrderAmount, setMinOrderAmount] = useState("")
    const [maxDiscount, setMaxDiscount] = useState("")
    const [usageLimit, setUsageLimit] = useState("")
    const [expiresAt, setExpiresAt] = useState("")
    const [page, setPage] = useState(1)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!code.trim() || !value) return
        try {
            const parsed = createCouponSchema.parse({
                code: code.trim().toUpperCase(),
                type,
                value: Number(value),
                startDate: new Date().toISOString(),
                endDate: expiresAt ? new Date(expiresAt).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                ...(minOrderAmount ? { minOrderAmount: Number(minOrderAmount) } : {}),
                ...(maxDiscount ? { maxDiscount: Number(maxDiscount) } : {}),
                ...(usageLimit ? { usageLimit: Number(usageLimit) } : {}),
            })
            const result = await create(parsed)
            if (result) {
                setShowForm(false)
                setCode(""); setType("PERCENTAGE"); setValue(""); setMinOrderAmount(""); setMaxDiscount(""); setUsageLimit(""); setExpiresAt("")
                refetch()
            }
        } catch { }
    }

    const handleEdit = (coupon: any) => {
        setEditing(coupon._id)
        setEditCode(coupon.code)
        setEditType(coupon.type)
        setEditValue(String(coupon.value))
        setEditMinOrderAmount(coupon.minOrderAmount ? String(coupon.minOrderAmount) : "")
        setEditMaxDiscount(coupon.maxDiscount ? String(coupon.maxDiscount) : "")
        setEditUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : "")
        setEditExpiresAt(coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : "")
    }

    const handleUpdate = async (e: React.FormEvent, id: string) => {
        e.preventDefault()
        if (!editCode.trim() || !editValue) return
        try {
            const parsed = createCouponSchema.parse({
                code: editCode.trim().toUpperCase(),
                type: editType,
                value: Number(editValue),
                startDate: new Date().toISOString(),
                endDate: editExpiresAt ? new Date(editExpiresAt).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                ...(editMinOrderAmount ? { minOrderAmount: Number(editMinOrderAmount) } : {}),
                ...(editMaxDiscount ? { maxDiscount: Number(editMaxDiscount) } : {}),
                ...(editUsageLimit ? { usageLimit: Number(editUsageLimit) } : {}),
            })
            const result = await update(id, parsed)
            if (result) {
                setEditing(null)
                setEditCode(""); setEditType("PERCENTAGE"); setEditValue(""); setEditMinOrderAmount(""); setEditMaxDiscount(""); setEditUsageLimit(""); setEditExpiresAt("")
                refetch()
            }
        } catch { }
    }

    const handleCancelEdit = () => {
        setEditing(null)
        setEditCode(""); setEditType("PERCENTAGE"); setEditValue(""); setEditMinOrderAmount(""); setEditMaxDiscount(""); setEditUsageLimit(""); setEditExpiresAt("")
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this coupon?")) return
        setDeleting(id)
        const ok = await remove(id)
        setDeleting(null)
        if (ok) refetch()
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Coupons</h1>
                <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    {showForm ? "Cancel" : "+ Add Coupon"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5 space-y-3">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code (e.g. SALE20)" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 uppercase text-text-primary-light dark:text-text-primary-dark" />
                        <select value={type} onChange={(e) => setType(e.target.value as "PERCENTAGE" | "FIXED")} className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none text-text-primary-light dark:text-text-primary-dark">
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount (₫)</option>
                        </select>
                        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Discount value" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        <input type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} placeholder="Min order amount" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="Max discount" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="Usage limit" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} placeholder="Expires at" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                    </div>
                    <button type="submit" disabled={mutating || !code.trim() || !value} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                        {mutating ? "Creating..." : "Create Coupon"}
                    </button>
                </form>
            )}

            {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
            ) : coupons.length === 0 ? (
                <p className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">No coupons</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Code</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Type</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Value</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Used</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Active</th>
                                    <th className="px-4 py-3 text-right font-semibold text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {coupons.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        {editing === c._id ? (
                                            <td colSpan={6} className="px-4 py-3">
                                                <form onSubmit={(e) => handleUpdate(e, c._id)} className="space-y-3">
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                                        <input
                                                            value={editCode}
                                                            onChange={(e) => setEditCode(e.target.value)}
                                                            placeholder="Code"
                                                            className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                            autoFocus
                                                        />
                                                        <select
                                                            value={editType}
                                                            onChange={(e) => setEditType(e.target.value as "PERCENTAGE" | "FIXED")}
                                                            className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                        >
                                                            <option value="PERCENTAGE">%</option>
                                                            <option value="FIXED">Fixed</option>
                                                        </select>
                                                        <input
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            placeholder="Value"
                                                            type="number"
                                                            className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                        />
                                                        <input
                                                            value={editMinOrderAmount}
                                                            onChange={(e) => setEditMinOrderAmount(e.target.value)}
                                                            placeholder="Min Order"
                                                            type="number"
                                                            className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                        />
                                                        <input
                                                            value={editMaxDiscount}
                                                            onChange={(e) => setEditMaxDiscount(e.target.value)}
                                                            placeholder="Max Discount"
                                                            type="number"
                                                            className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                        />
                                                        <input
                                                            value={editExpiresAt}
                                                            onChange={(e) => setEditExpiresAt(e.target.value)}
                                                            placeholder="Expires"
                                                            type="date"
                                                            className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            disabled={mutating || !editCode.trim() || !editValue}
                                                            className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            {mutating ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </td>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 font-mono font-semibold text-text-primary-light dark:text-text-primary-dark">{c.code}</td>
                                                <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark">{c.type}</td>
                                                <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">
                                                    {c.type === "PERCENTAGE" ? `${c.value}%` : formatCurrency(c.value)}
                                                </td>
                                                <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark">{c.usedCount ?? 0}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                                                <td className="px-4 py-3"><span className={`inline-block h-2 w-2 rounded-full ${c.isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}`} /></td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(c._id)}
                                                            disabled={deleting === c._id}
                                                            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            {deleting === c._id ? "..." : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark">Prev</button>
                            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{page} / {pagination.totalPages}</span>
                            <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark">Next</button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
