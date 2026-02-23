import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { Order, OrderStatusHistory } from "@/types/order"
import {
    checkoutSchema,
    orderQuerySchema,
    type CheckoutInput,
    type OrderQueryInput,
} from "@/schemas/order"

export const orderService = {
    checkout: async (data: CheckoutInput, signal?: AbortSignal) => {
        const validated = checkoutSchema.parse(data)
        const response = await api.post<ApiResponse<Order>>(
            "/order/checkout",
            validated,
            { signal }
        )
        return response.data
    },

    getAll: async (params?: OrderQueryInput, signal?: AbortSignal) => {
        const validated = params ? orderQuerySchema.parse(params) : undefined
        const response = await api.get<ApiListResponse<Order>>("/order", {
            params: validated,
            signal,
        })
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Order>>(`/order/${id}`, {
            signal,
        })
        return response.data
    },

    getHistory: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<OrderStatusHistory[]>>(
            `/order/${id}/history`,
            { signal }
        )
        return response.data
    },

    cancel: async (id: string, signal?: AbortSignal) => {
        const response = await api.post<ApiMessageResponse>(
            `/order/${id}/cancel`,
            {},
            { signal }
        )
        return response.data
    },
}
