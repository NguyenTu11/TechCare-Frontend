"use client"

import { useState } from "react"
import { useWarranties, useWarrantyClaim } from "@/hooks/useWarranty"

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    EXPIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    CLAIMED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    VOIDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function WarrantiesPage() {
    const { warranties, isLoading } = useWarranties()
    const { claim, isLoading: claiming, error: claimError } = useWarrantyClaim()
    const [claimingId, setClaimingId] = useState<string | null>(null)
    const [claimReason, setClaimReason] = useState("")
    const [claimDescription, setClaimDescription] = useState("")

    const handleClaim = async (warrantyId: string) => {
        if (!claimReason.trim()) return
        const result = await claim(warrantyId, {
            reason: claimReason.trim(),
        })
        if (result) {
            setClaimingId(null)
            setClaimReason("")
            setClaimDescription("")
        }
    }

    if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">My Warranties</h1>
            {warranties.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No warranties found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Array.isArray(warranties) && warranties.map((w) => (
                        <div key={w._id} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Warranty #{w._id.slice(-6)}</p>
                                    {w.serialNumber && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">SN: {w.serialNumber}</p>}
                                </div>
                                <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${statusColors[w.status] ?? ""}`}>{w.status}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">Period</span><p className="font-medium text-text-primary-light dark:text-text-primary-dark">{w.warrantyMonths} months</p></div>
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">Start</span><p className="font-medium text-text-primary-light dark:text-text-primary-dark">{new Date(w.startDate).toLocaleDateString("vi-VN")}</p></div>
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">End</span><p className="font-medium text-text-primary-light dark:text-text-primary-dark">{new Date(w.endDate).toLocaleDateString("vi-VN")}</p></div>
                            </div>
                            {w.status === "ACTIVE" && (
                                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                                    {claimingId === w._id ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Claim Reason *</label>
                                                <input
                                                    value={claimReason}
                                                    onChange={(e) => setClaimReason(e.target.value)}
                                                    placeholder="Reason for claim"
                                                    className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                                                    autoFocus
                                                />
                                            </div>
                                                                                        {claimError && <p className="text-sm text-red-500">{claimError}</p>}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleClaim(w._id)}
                                                    disabled={claiming || !claimReason.trim()}
                                                    className="rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {claiming ? "Submitting..." : "Submit Claim"}
                                                </button>
                                                <button
                                                    onClick={() => { setClaimingId(null); setClaimReason(""); setClaimDescription("") }}
                                                    className="rounded-xl bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setClaimingId(w._id)}
                                            className="rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 transition-colors"
                                        >
                                            Claim Warranty
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
