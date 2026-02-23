import api from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Category } from "@/types/category"

export const categoryService = {
    getAll: async (params?: { page?: number; limit?: number }, signal?: AbortSignal) => {
        const response = await api.get<ApiListResponse<Category>>("/category", {
            params,
            signal,
        })
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Category>>(`/category/${id}`, {
            signal,
        })
        return response.data
    },

    getBySlug: async (slug: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Category>>(
            `/category/slug/${slug}`,
            { signal }
        )
        return response.data
    },
}
