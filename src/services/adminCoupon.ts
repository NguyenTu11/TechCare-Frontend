import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { Coupon } from "@/types/coupon"
import { createCouponSchema, updateCouponSchema } from "@/schemas/coupon"
import type { CreateCouponInput, UpdateCouponInput } from "@/schemas/coupon"

export const adminCouponService = {
    getAll: async (
        params?: { page?: number; limit?: number; active?: string },
        signal?: AbortSignal
    ) => {
        const response = await api.get<ApiResponse<{ coupons: Coupon[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>>(
            "/coupon",
            { params, signal }
        )
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Coupon>>(
            `/coupon/${id}`,
            { signal }
        )
        return response.data
    },

    create: async (data: CreateCouponInput, signal?: AbortSignal) => {
        const parsed = createCouponSchema.parse(data)
        const response = await api.post<ApiResponse<Coupon>>(
            "/coupon",
            parsed,
            { signal }
        )
        return response.data
    },

    update: async (id: string, data: UpdateCouponInput, signal?: AbortSignal) => {
        const parsed = updateCouponSchema.parse(data)
        const response = await api.patch<ApiResponse<Coupon>>(
            `/coupon/${id}`,
            parsed,
            { signal }
        )
        return response.data
    },

    delete: async (id: string, signal?: AbortSignal) => {
        const response = await api.delete<ApiMessageResponse>(
            `/coupon/${id}`,
            { signal }
        )
        return response.data
    },
}
