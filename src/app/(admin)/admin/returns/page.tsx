"use client"

import { useState } from "react"
import { useAdminReturns, useAdminReturnMutation } from "@/hooks/useAdminReturns"
import type { Return, ReturnStatus } from "@/types/return"

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const STATUSES: ReturnStatus[] = ["PENDING", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED", "CANCELLED"]

export default function AdminReturnsPage() {
    const { returns, isLoading, refetch } = useAdminReturns()
    const { process, isLoading: processing } = useAdminReturnMutation()
    const [filter, setFilter] = useState<ReturnStatus | "ALL">("ALL")
    const [selected, setSelected] = useState<Return | null>(null)
    const [actionData, setActionData] = useState({ adminNote: "", refundAmount: "" })

    const filtered = filter === "ALL" ? returns : returns.filter((r) => r.status === filter)

    const handleProcess = async (id: string, action: "APPROVE" | "REJECT" | "COMPLETE") => {
        const result = await process(id, {
            action,
            adminNote: actionData.adminNote || undefined,
            refundAmount: actionData.refundAmount ? Number(actionData.refundAmount) : undefined,
        })
        if (result) {
            setSelected(null)
            setActionData({ adminNote: "", refundAmount: "" })
            refetch()
        }
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
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Returns Management</h1>

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilter("ALL")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === "ALL" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                    All ({returns.length})
                </button>
                {STATUSES.map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === s ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                        {s} ({returns.filter((r) => r.status === s).length})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No returns found</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Return #</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Items</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {filtered.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark font-medium text-xs">{r.returnNumber}</td>
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark text-xs">{r.type}</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{r.items.length}</td>
                                        <td className="px-4 py-3"><span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[r.status] ?? ""}`}>{r.status}</span></td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => { setSelected(r); setActionData({ adminNote: "", refundAmount: "" }) }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{selected.returnNumber}</h2>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">{selected.type} &middot; <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${statusColors[selected.status] ?? ""}`}>{selected.status}</span></p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">&times;</button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase">Items</h3>
                            {selected.items.map((item, idx) => (
                                <div key={idx} className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-sm">
                                    <p className="text-text-primary-light dark:text-text-primary-dark font-mono text-xs">Variant: {item.variant}</p>
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">Qty: {item.quantity} &middot; {item.reason}</p>
                                </div>
                            ))}
                        </div>

                        {selected.note && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic">Customer note: {selected.note}</p>}
                        {selected.adminNote && <p className="text-xs text-primary-600 dark:text-primary-400">Admin note: {selected.adminNote}</p>}
                        {selected.refundAmount != null && <p className="text-xs font-medium text-green-600">Refund: {selected.refundAmount.toLocaleString("vi-VN")}d</p>}

                        {(selected.status === "PENDING" || selected.status === "APPROVED") && (
                            <div className="border-t border-border-light dark:border-border-dark pt-4 space-y-3">
                                <h3 className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase">Process Return</h3>
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Admin Note</label>
                                    <input type="text" value={actionData.adminNote} onChange={(e) => setActionData({ ...actionData, adminNote: e.target.value })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Refund Amount</label>
                                    <input type="number" min={0} value={actionData.refundAmount} onChange={(e) => setActionData({ ...actionData, refundAmount: e.target.value })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                                </div>
                                <div className="flex gap-2">
                                    {selected.status === "PENDING" && (
                                        <>
                                            <button onClick={() => handleProcess(selected._id, "APPROVE")} disabled={processing} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                                Approve
                                            </button>
                                            <button onClick={() => handleProcess(selected._id, "REJECT")} disabled={processing} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {selected.status === "APPROVED" && (
                                        <button onClick={() => handleProcess(selected._id, "COMPLETE")} disabled={processing} className="rounded-xl bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
