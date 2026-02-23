import api from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Brand } from "@/types/brand"

export const brandService = {
    getAll: async (params?: { page?: number; limit?: number }, signal?: AbortSignal) => {
        const response = await api.get<ApiListResponse<Brand>>("/brand", {
            params,
            signal,
        })
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Brand>>(`/brand/${id}`, {
            signal,
        })
        return response.data
    },

    getBySlug: async (slug: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Brand>>(`/brand/slug/${slug}`, {
            signal,
        })
        return response.data
    },
}
