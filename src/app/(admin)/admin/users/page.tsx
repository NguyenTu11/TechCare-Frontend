"use client"

import { useAdminUserStats } from "@/hooks/useAdminStats"

export default function AdminUsersPage() {
    const { stats, isLoading: loading } = useAdminUserStats()

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Users</h1>

            {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
            ) : !stats ? (
                <p className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">Failed to load stats</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { label: "Total Users", value: stats.totalUsers, color: "bg-blue-100 text-blue-700" },
                        { label: "Active Users", value: stats.activeUsers, color: "bg-emerald-100 text-emerald-700" },
                        { label: "New Users (30d)", value: stats.newUsersLast30Days, color: "bg-amber-100 text-amber-700" },
                    ].map((s) => (
                        <div key={s.label} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5">
                            <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{s.label}</p>
                            <p className={`mt-2 text-2xl font-bold ${s.color.split(" ")[1]} dark:text-white`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/20 p-8 text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">User listing and management features are coming soon.</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">(Backend endpoint /users not yet implemented)</p>
            </div>
        </div>
    )
}
