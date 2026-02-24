import { queuedApi } from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Category } from "@/types/category"

export const categoryService = {
    getAll: async (params?: { page?: number; limit?: number }, signal?: AbortSignal) => {
        const response = await queuedApi.get("/category", undefined, {
            params,
            signal,
        } as any)
        return response.data
    },

    getBySlug: async (slug: string, signal?: AbortSignal) => {
        const response = await queuedApi.get(`/category/slug/${slug}`, undefined, {
            signal,
        } as any)
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await queuedApi.get(`/category/${id}`, undefined, {
            signal,
        } as any)
        return response.data
    },
}
