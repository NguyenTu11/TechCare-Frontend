"use client"

import Link from "next/link"
import { useOrders } from "@/hooks/useOrder"

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    PROCESSING: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    FAILED: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function OrdersPage() {
    const { orders, isLoading, error } = useOrders()

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
                My Orders
            </h1>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center text-red-600 dark:text-red-400">{error}</div>
            ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">No orders yet</p>
                    <Link href="/shop/products" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                        Start shopping →
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/shop/orders/${order._id}`}
                            className="block rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6 hover:shadow-lg hover:border-primary-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                        #{order.orderNumber}
                                    </p>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                            year: "numeric", month: "short", day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${statusColors[order.status] ?? statusColors.PENDING}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 overflow-hidden">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                            {(item.name || "P").charAt(0)}
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                        +{order.items.length - 3} more
                                    </span>
                                )}
                            </div>

                            <div className="mt-3 flex items-center justify-between pt-3 border-t border-border-light dark:border-border-dark">
                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                </span>
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
