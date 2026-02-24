"use client"

import { useNotifications } from "@/hooks/useNotification"

export default function NotificationsPage() {
    const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

    if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Notifications</h1>
                {notifications.length > 0 && (
                    <button onClick={markAllAsRead} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Mark all as read</button>
                )}
            </div>
            {notifications.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No notifications</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((n) => (
                        <div key={n._id} className={`flex items-start gap-4 rounded-2xl border p-5 transition-all ${n.isRead ? "border-border-light dark:border-border-dark bg-white dark:bg-gray-900" : "border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10"}`}>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{n.title}</h3>
                                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">{n.message}</p>
                                {n.type === "ORDER_STATUS" && n.data && typeof n.data === "object" && "orderStatus" in n.data && (
                                    <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">Status: {String(n.data.orderStatus)}</p>
                                )}
                                <p className="mt-2 text-xs text-text-secondary-light/60 dark:text-text-secondary-dark/60">{new Date(n.createdAt).toLocaleString("vi-VN")}</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                {!n.isRead && <button onClick={() => markAsRead(n._id)} className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-xs">✓</button>}
                                <button onClick={() => deleteNotification(n._id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
