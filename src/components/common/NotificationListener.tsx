"use client"

import { useEffect } from "react"
import { useSocket } from "@/hooks/useSocket"
import { useAuthStore } from "@/store/authStore"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import {
    SOCKET_EVENTS,
    parsePayload,
    notificationPayloadSchema,
    lowStockPayloadSchema,
} from "@/socket"

export function NotificationListener() {
    const { socket } = useSocket()
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!socket || !user) return

        const handleNewNotification = (raw: unknown) => {
            const data = parsePayload(notificationPayloadSchema, raw, SOCKET_EVENTS.NOTIFICATION_NEW)
            if (!data) return
            toast(data.message, {
                icon: data.type === "ORDER_STATUS" ? "📦" : "🔔",
                duration: 5000,
            })
        }

        const handleLowStock = (raw: unknown) => {
            if (user.role !== "admin") return
            const data = parsePayload(lowStockPayloadSchema, raw, SOCKET_EVENTS.STOCK_LOW)
            if (!data) return
            toast.error(`Low Stock Alert: ${data.productName} (${data.sku}) is at ${data.stock} (Threshold: ${data.threshold})`, {
                duration: 8000,
                position: "top-right"
            })
        }

        socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification)
        socket.on(SOCKET_EVENTS.STOCK_LOW, handleLowStock)

        return () => {
            socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification)
            socket.off(SOCKET_EVENTS.STOCK_LOW, handleLowStock)
        }
    }, [socket, user, router])

    return null
}
