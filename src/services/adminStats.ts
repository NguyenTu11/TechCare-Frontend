import api from "@/services/api"
import type { ApiResponse } from "@/types/api"
import { getRevenueQuerySchema, getTopProductsQuerySchema, getLowStockQuerySchema } from "@/schemas/stats"
import type { GetRevenueQuery, GetTopProductsQuery, GetLowStockQuery } from "@/schemas/stats"

export interface DashboardStats {
    revenue: {
        totalRevenue: number
        totalOrders: number
        avgOrderValue: number
    }
    orders: {
        pending: number
        paid: number
        processing: number
        shipped: number
        delivered: number
        cancelled: number
        failed: number
        refunded: number
        total: number
    }
    users: {
        totalUsers: number
        newUsersLast30Days: number
        activeUsers: number
    }
    lowStockCount: number
}

export interface RevenueStats {
    totalRevenue: number
    byDate: Array<{ date: string; revenue: number }>
}

export interface TopProduct {
    _id: string
    name: string
    thumbnail: string
    totalQuantity: number
    totalRevenue: number
    orderCount: number
}

export interface LowStockItem {
    _id: string
    product: { _id: string; name: string }
    sku: string
    stock: number
    lowStockThreshold: number
    isActive: boolean
}

export interface OrderStats {
    pending: number
    paid: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    failed: number
    refunded: number
    total: number
}

export interface UserStats {
    totalUsers: number
    newUsersLast30Days: number
    activeUsers: number
}

export const adminStatsService = {
    getDashboard: async (signal?: AbortSignal) => {
        const r = await api.get<ApiResponse<DashboardStats>>("/stats/dashboard", { signal })
        return r.data
    },
    getRevenue: async (params?: GetRevenueQuery, signal?: AbortSignal) => {
        const parsed = params ? getRevenueQuerySchema.parse(params) : undefined
        const r = await api.get<ApiResponse<RevenueStats>>("/stats/revenue", { params: parsed, signal })
        return r.data
    },
    getTopProducts: async (params?: GetTopProductsQuery, signal?: AbortSignal) => {
        const parsed = params ? getTopProductsQuerySchema.parse(params) : undefined
        const r = await api.get<ApiResponse<TopProduct[]>>("/stats/top-products", { params: parsed, signal })
        return r.data
    },
    getLowStock: async (params?: GetLowStockQuery, signal?: AbortSignal) => {
        const parsed = params ? getLowStockQuerySchema.parse(params) : undefined
        const r = await api.get<ApiResponse<LowStockItem[]>>("/stats/low-stock", { params: parsed, signal })
        return r.data
    },
    getOrderStats: async (signal?: AbortSignal) => {
        const r = await api.get<ApiResponse<OrderStats>>("/stats/orders", { signal })
        return r.data
    },
    getUserStats: async (signal?: AbortSignal) => {
        const r = await api.get<ApiResponse<UserStats>>("/stats/users", { signal })
        return r.data
    },
}
