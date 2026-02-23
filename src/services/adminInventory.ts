import api from "@/services/api"
import type { ApiResponse } from "@/types/api"
import type { InventoryLog } from "@/types/inventory"
import { adjustInventorySchema } from "@/schemas/inventory"
import type { AdjustInventoryInput } from "@/schemas/inventory"

export interface VariantStock {
    variantId: string
    sku: string
    stock: number
    lowStockThreshold: number
    isLowStock: boolean
}

export interface InventoryLogsResponse {
    logs: InventoryLog[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export const adminInventoryService = {
    getStock: async (variantId: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<VariantStock>>(
            `/inventory/stock/${variantId}`,
            { signal }
        )
        return response.data
    },

    getLogs: async (
        variantId: string,
        params?: { page?: number; limit?: number },
        signal?: AbortSignal
    ) => {
        const response = await api.get<ApiResponse<InventoryLogsResponse>>(
            `/inventory/logs/${variantId}`,
            { params, signal }
        )
        return response.data
    },

    adjust: async (data: AdjustInventoryInput, signal?: AbortSignal) => {
        const parsed = adjustInventorySchema.parse(data)
        const response = await api.post<ApiResponse<InventoryLog>>(
            "/inventory/adjust",
            parsed,
            { signal }
        )
        return response.data
    },
}
