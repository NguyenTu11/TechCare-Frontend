import { queuedApi } from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Product } from "@/types/product"

export interface ProductQueryParams {
    page?: number
    limit?: number
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
}

export const productService = {
    getAll: async (params?: ProductQueryParams, signal?: AbortSignal) => {
        const response = await queuedApi.get("/product", undefined, {
            params,
            signal,
        } as any)
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await queuedApi.get(`/product/${id}`, undefined, {
            signal,
        } as any)
        return response.data
    },

    getBySlug: async (slug: string, signal?: AbortSignal) => {
        const response = await queuedApi.get(`/product/slug/${slug}`, undefined, {
            signal,
        } as any)
        return response.data
    },
}
