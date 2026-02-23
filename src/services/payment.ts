import api from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Payment } from "@/types/payment"
import { createPaymentSchema, createVNPaySchema } from "@/schemas/payment"
import type { CreatePaymentInput, CreateVNPayInput } from "@/schemas/payment"

export const paymentService = {
    create: async (
        data: CreatePaymentInput,
        signal?: AbortSignal
    ) => {
        const parsed = createPaymentSchema.parse(data)
        const response = await api.post<ApiResponse<Payment>>(
            "/payment/create",
            parsed,
            { signal }
        )
        return response.data
    },

    getByOrder: async (orderId: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Payment>>(
            `/payment/order/${orderId}`,
            { signal }
        )
        return response.data
    },

    getAll: async (
        params?: { page?: number; limit?: number },
        signal?: AbortSignal
    ) => {
        const response = await api.get<ApiListResponse<Payment>>("/payment", {
            params,
            signal,
        })
        return response.data
    },

    cancel: async (id: string, signal?: AbortSignal) => {
        const response = await api.post<ApiResponse<Payment>>(
            `/payment/${id}/cancel`,
            {},
            { signal }
        )
        return response.data
    },

    createVNPay: async (
        data: CreateVNPayInput,
        signal?: AbortSignal
    ) => {
        const parsed = createVNPaySchema.parse(data)
        const response = await api.post<ApiResponse<{ paymentUrl: string }>>(
            "/payment/vnpay/create",
            parsed,
            { signal }
        )
        return response.data
    },
}
