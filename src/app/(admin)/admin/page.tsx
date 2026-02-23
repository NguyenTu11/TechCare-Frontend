"use client"

import { useAdminDashboard } from "@/hooks/useAdminStats"

function formatCurrency(n: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)
}

export default function AdminDashboardPage() {
    const { dashboard, topProducts, lowStock, orderStats, userStats, isLoading: loading } = useAdminDashboard()

    if (loading) {
        return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
    }

    const kpis = dashboard
        ? [
            { label: "Total Revenue", value: formatCurrency(dashboard.revenue.totalRevenue), color: "from-emerald-500 to-emerald-700" },
            { label: "Total Orders", value: dashboard.revenue.totalOrders.toLocaleString(), color: "from-blue-500 to-blue-700" },
            { label: "Total Users", value: dashboard.users.totalUsers.toLocaleString(), color: "from-violet-500 to-violet-700" },
            { label: "Avg Order Value", value: formatCurrency(dashboard.revenue.avgOrderValue), color: "from-amber-500 to-amber-700" },
            { label: "Pending Orders", value: dashboard.orders.pending.toLocaleString(), color: "from-rose-500 to-rose-700" },
            { label: "Low Stock Items", value: dashboard.lowStockCount.toLocaleString(), color: "from-cyan-500 to-cyan-700" },
        ]
        : []

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpis.map((k) => (
                    <div key={k.label} className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-4 shadow-sm">
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">{k.label}</p>
                        <p className={`text-lg font-bold bg-gradient-to-r ${k.color} bg-clip-text text-transparent`}>{k.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-5">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Top Selling Products</h2>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">
                            {topProducts.map((p, i) => (
                                <div key={p._id} className="flex items-center gap-3">
                                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">{p.name}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{p.totalQuantity} sold</p>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(p.totalRevenue)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">No data</p>
                    )}
                </div>

                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-5">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Low Stock Alert</h2>
                    {lowStock.length > 0 ? (
                        <div className="space-y-3">
                            {lowStock.map((item) => (
                                <div key={item._id} className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">{item.product.name}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{item.sku}</p>
                                    </div>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.stock === 0 ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>
                                        {item.stock} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">All stocked</p>
                    )}
                </div>

                {orderStats && (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-5">
                        <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Orders by Status</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.entries(orderStats) as Array<[string, number]>).filter(([key]) => key !== "total").map(([status, count]) => (
                                <div key={status} className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark capitalize">{status.replace(/_/g, " ").toLowerCase()}</p>
                                    <p className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {userStats && (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-5">
                        <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Users</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Total", val: userStats.totalUsers },
                                { label: "Active", val: userStats.activeUsers },
                                { label: "New (30d)", val: userStats.newUsersLast30Days },
                            ].map((s) => (
                                <div key={s.label} className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{s.label}</p>
                                    <p className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{s.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
