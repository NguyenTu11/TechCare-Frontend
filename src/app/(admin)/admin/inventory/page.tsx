"use client"

import { useState, useCallback } from "react"
import { useAdminInventoryStock, useAdminInventoryLogs, useAdminInventoryAdjust } from "@/hooks/useAdminInventory"
import type { InventoryAction } from "@/types/inventory"
import { adjustInventorySchema } from "@/schemas/inventory"

const actionColors: Record<InventoryAction, string> = {
    IMPORT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    ORDER: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    CANCEL: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    ADJUST: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
}

export default function AdminInventoryPage() {
    const [variantId, setVariantId] = useState("")
    const { stock, isLoading: stockLoading, fetchStock } = useAdminInventoryStock()
    const { logs, isLoading: logsLoading, fetchLogs } = useAdminInventoryLogs()
    const { adjust, isLoading: adjusting } = useAdminInventoryAdjust()

    const [adjustQty, setAdjustQty] = useState("")
    const [adjustAction, setAdjustAction] = useState<InventoryAction>("IMPORT")
    const [adjustNote, setAdjustNote] = useState("")

    const loading = stockLoading || logsLoading

    const lookupVariant = useCallback(async () => {
        if (!variantId.trim()) return
        await Promise.all([
            fetchStock(variantId.trim()),
            fetchLogs(variantId.trim()),
        ])
    }, [variantId, fetchStock, fetchLogs])

    const handleAdjust = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!variantId.trim() || !adjustQty) return
        try {
            const parsed = adjustInventorySchema.parse({
                variantId: variantId.trim(),
                action: adjustAction,
                quantity: Number(adjustQty),
                note: adjustNote.trim() || undefined,
            })
            const result = await adjust(parsed)
            if (result) {
                setAdjustQty("")
                setAdjustNote("")
                await lookupVariant()
            }
        } catch { }
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Inventory</h1>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Lookup Variant</h2>
                <div className="flex gap-3">
                    <input value={variantId} onChange={(e) => setVariantId(e.target.value)} placeholder="Variant ID" className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                    <button type="button" onClick={lookupVariant} disabled={loading || !variantId.trim()} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                        {loading ? "..." : "Lookup"}
                    </button>
                </div>
            </div>

            {stock && (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">SKU: {stock.sku}</p>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Threshold: {stock.lowStockThreshold}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Current Stock</p>
                            <p className={`text-2xl font-bold ${stock.isLowStock ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>{stock.stock}</p>
                        </div>
                    </div>

                    <form onSubmit={handleAdjust} className="border-t border-border-light dark:border-border-dark pt-4 space-y-3">
                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Adjust Stock</h3>
                        <div className="grid sm:grid-cols-3 gap-3">
                            <select value={adjustAction} onChange={(e) => setAdjustAction(e.target.value as InventoryAction)} className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none text-text-primary-light dark:text-text-primary-dark">
                                <option value="IMPORT">Import</option>
                                <option value="ORDER">Order</option>
                                <option value="CANCEL">Cancel</option>
                                <option value="ADJUST">Adjust</option>
                            </select>
                            <input type="number" min="1" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} placeholder="Quantity" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                            <input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="Note" className="rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <button type="submit" disabled={adjusting || !adjustQty} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                            {adjusting ? "Adjusting..." : "Apply"}
                        </button>
                    </form>
                </div>
            )}

            {logs && logs.logs.length > 0 && (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Inventory Logs</h2>
                    <div className="space-y-2">
                        {logs.logs.map((log) => (
                            <div key={log._id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${actionColors[log.action] ?? "bg-gray-100 text-gray-700"}`}>{log.action}</span>
                                    <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">qty: {log.quantity}</span>
                                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{log.before} &rarr; {log.after}</span>
                                    {log.note && <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">({log.note})</span>}
                                </div>
                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap ml-2">{new Date(log.createdAt).toLocaleString("vi-VN")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
