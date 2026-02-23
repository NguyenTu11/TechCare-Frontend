"use client"

import { useState, useEffect, useCallback } from "react"
import { notificationService } from "@/services/notification"
import type { Notification } from "@/types/notification"
import type { PaginationMeta } from "@/types/api"

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchNotifications = useCallback(
        async (params?: { page?: number; limit?: number }) => {
            setError(null)
            try {
                const result = await notificationService.getAll(params)
                setNotifications(result.data)
                if (result.pagination) setPagination(result.pagination)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load notifications")
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationService.markAsRead(id)
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            )
        } catch {
            /* silently fail */
        }
    }, [])

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead()
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        } catch {
            /* silently fail */
        }
    }, [])

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await notificationService.delete(id)
            setNotifications((prev) => prev.filter((n) => n._id !== id))
        } catch {
            /* silently fail */
        }
    }, [])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return {
        notifications,
        unreadCount,
        pagination,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refetch: fetchNotifications,
    }
}
