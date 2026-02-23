import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { Order, OrderStatus } from "@/types/order"
import { updateOrderStatusSchema } from "@/schemas/order"
import { confirmPaymentSchema } from "@/schemas/payment"
import { processReturnSchema } from "@/schemas/return"
import type { UpdateOrderStatusInput } from "@/schemas/order"
import type { ConfirmPaymentInput } from "@/schemas/payment"
import type { ProcessReturnInput } from "@/schemas/return"

export interface AdminOrderParams {
    page?: number
    limit?: number
    status?: OrderStatus
    startDate?: string
    endDate?: string
    keyword?: string
}

export const adminOrderService = {
    getAll: async (params?: AdminOrderParams, signal?: AbortSignal) => {
        const r = await api.get<ApiListResponse<Order>>("/order/admin", { params, signal })
        return r.data
    },
    getById: async (id: string, signal?: AbortSignal) => {
        const r = await api.get<ApiResponse<Order>>(`/order/${id}`, { signal })
        return r.data
    },
    updateStatus: async (id: string, data: UpdateOrderStatusInput, signal?: AbortSignal) => {
        const parsed = updateOrderStatusSchema.parse(data)
        const r = await api.patch<ApiResponse<Order>>(`/order/${id}/status`, parsed, { signal })
        return r.data
    },
}

export const adminPaymentService = {
    confirm: async (id: string, data?: ConfirmPaymentInput) => {
        const parsed = data ? confirmPaymentSchema.parse(data) : {}
        const r = await api.post<ApiResponse<unknown>>(`/payment/${id}/confirm`, parsed)
        return r.data
    },
    fail: async (id: string) => {
        const r = await api.post<ApiResponse<unknown>>(`/payment/${id}/fail`, {})
        return r.data
    },
    refund: async (id: string) => {
        const r = await api.post<ApiResponse<unknown>>(`/payment/${id}/refund`, {})
        return r.data
    },
}

export const adminReturnService = {
    process: async (id: string, data: ProcessReturnInput) => {
        const parsed = processReturnSchema.parse(data)
        const r = await api.post<ApiMessageResponse>(`/return/${id}/process`, parsed)
        return r.data
    },
}
