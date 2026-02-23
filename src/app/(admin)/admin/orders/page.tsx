"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useAdminOrders, useAdminOrderMutation } from "@/hooks/useAdminOrders"
import type { OrderStatus } from "@/types/order"

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    PAID: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    PROCESSING: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    SHIPPED: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    FAILED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    REFUNDED: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300",
}

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "FAILED", "REFUNDED"]

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
    PENDING: ["PAID", "CANCELLED", "FAILED"],
    PAID: ["PROCESSING", "CANCELLED", "REFUNDED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [],
    FAILED: [],
    REFUNDED: [],
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)
}

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("")
    const [updating, setUpdating] = useState<string | null>(null)

    const params = useMemo(() => {
        const p: { page: number; limit: number; status?: OrderStatus } = { page, limit: 10 }
        if (statusFilter) p.status = statusFilter
        return p
    }, [page, statusFilter])

    const { orders, pagination, isLoading: loading, refetch } = useAdminOrders(params)
    const { updateStatus } = useAdminOrderMutation()

    const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
        setUpdating(id)
        await updateStatus(id, { status: newStatus })
        setUpdating(null)
        refetch(params)
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Orders</h1>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | ""); setPage(1) }} className="rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none text-text-primary-light dark:text-text-primary-dark">
                    <option value="">All Statuses</option>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
            ) : orders.length === 0 ? (
                <p className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">No orders found</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Order #</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Items</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Total</th>
                                    <th className="px-4 py-3 text-left font-semibold text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold text-text-secondary-light dark:text-text-secondary-dark">Update</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {orders.map((o) => (
                                    <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-text-primary-light dark:text-text-primary-dark">{o.orderNumber ?? o._id.slice(-8)}</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">{o.items.length}</td>
                                        <td className="px-4 py-3 font-semibold text-text-primary-light dark:text-text-primary-dark">{formatCurrency(o.totalAmount)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-700"}`}>{o.status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {(VALID_TRANSITIONS[o.status]?.length ?? 0) > 0 ? (
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => handleStatusChange(o._id, e.target.value as OrderStatus)}
                                                    disabled={updating === o._id}
                                                    className="rounded-lg border border-border-light dark:border-border-dark bg-transparent px-2 py-1 text-xs outline-none disabled:opacity-50 text-text-primary-light dark:text-text-primary-dark"
                                                >
                                                    <option value={o.status}>{o.status}</option>
                                                    {VALID_TRANSITIONS[o.status]?.map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            ) : (
                                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">—</span>
                                            )}
                                        </td>
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
