"use client"

import { useParams } from "next/navigation"
import { useOrder } from "@/hooks/useOrder"

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

export default function OrderDetailPage() {
    const params = useParams<{ id: string }>()
    const { order, isLoading, error } = useOrder(params.id)

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="space-y-4">
                    <div className="h-8 w-1/3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <div className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16 text-center">
                <p className="text-red-500">{error ?? "Order not found"}</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        Order #{order.orderNumber}
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Placed on {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                    </p>
                </div>
                <span className={`inline-flex rounded-lg px-4 py-1.5 text-sm font-semibold ${statusColors[order.status] ?? ""}`}>
                    {order.status}
                </span>
            </div>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                        Items ({order.items.length})
                    </h2>
                </div>
                <div className="divide-y divide-border-light dark:divide-border-dark">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 px-6 py-4">
                            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <div className="flex h-full items-center justify-center text-gray-300 text-xs">
                                    {(item.name || "P").charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                                    {item.name}
                                </p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    SKU: {item.sku}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                                </p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    x{item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                    Order Summary
                </h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-text-secondary-light dark:text-text-secondary-dark">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.subtotal)}</span>
                    </div>
                    {order.couponCode && (
                        <div className="flex justify-between text-text-secondary-light dark:text-text-secondary-dark">
                            <span>Coupon</span>
                            <span className="font-mono">{order.couponCode}</span>
                        </div>
                    )}
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-text-secondary-light dark:text-text-secondary-dark">
                        <span>Shipping</span>
                        <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border-light dark:border-border-dark font-bold text-text-primary-light dark:text-text-primary-dark">
                        <span>Total</span>
                        <span className="text-primary-600 dark:text-primary-400">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
