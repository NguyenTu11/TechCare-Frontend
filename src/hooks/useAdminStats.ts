"use client"

import { useState, useEffect } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { adminStatsService } from "@/services/adminStats"
import type {
    DashboardStats,
    TopProduct,
    LowStockItem,
    OrderStats,
    UserStats,
} from "@/services/adminStats"
import type { GetRevenueQuery, GetTopProductsQuery, GetLowStockQuery } from "@/schemas/stats"

export function useAdminDashboard() {
    const [dashboard, setDashboard] = useState<DashboardStats | null>(null)
    const [topProducts, setTopProducts] = useState<TopProduct[]>([])
    const [lowStock, setLowStock] = useState<LowStockItem[]>([])
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
    const [userStats, setUserStats] = useState<UserStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const [d, t, l, o, u] = await Promise.all([
                    adminStatsService.getDashboard(controller.signal),
                    adminStatsService.getTopProducts({ limit: 5 }, controller.signal),
                    adminStatsService.getLowStock({ threshold: 10 }, controller.signal),
                    adminStatsService.getOrderStats(controller.signal),
                    adminStatsService.getUserStats(controller.signal),
                ])
                if (!controller.signal.aborted) {
                    setDashboard(d.data)
                    setTopProducts(t.data)
                    setLowStock(l.data)
                    setOrderStats(o.data)
                    setUserStats(u.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load dashboard")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [])

    return { dashboard, topProducts, lowStock, orderStats, userStats, isLoading, error }
}

export function useAdminRevenue(params?: GetRevenueQuery) {
    const [revenue, setRevenue] = useState<{ totalRevenue: number; byDate: Array<{ date: string; revenue: number }> } | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await adminStatsService.getRevenue(params, controller.signal)
                if (!controller.signal.aborted) {
                    setRevenue(result.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load revenue")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [params])

    return { revenue, isLoading, error }
}

export function useAdminUserStats() {
    const [stats, setStats] = useState<UserStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await adminStatsService.getUserStats(controller.signal)
                if (!controller.signal.aborted) {
                    setStats(result.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load user stats")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [])

    return { stats, isLoading, error }
}
