export interface DashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    totalUsers: number
    recentOrders: number
    pendingOrders: number
}

export interface RevenueStats {
    date: string
    revenue: number
    orders: number
}

export interface TopProduct {
    product: { _id: string; name: string; thumbnail?: string }
    totalSold: number
    totalRevenue: number
}

export interface LowStockItem {
    variant: { _id: string; sku: string; name: string }
    product: { _id: string; name: string }
    stock: number
}
