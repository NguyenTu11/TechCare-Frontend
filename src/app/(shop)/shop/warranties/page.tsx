"use client"

import { useWarranties } from "@/hooks/useWarranty"

const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    EXPIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    CLAIMED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    VOIDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function WarrantiesPage() {
    const { warranties, isLoading } = useWarranties()

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
                    {warranties.map((w) => (
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
