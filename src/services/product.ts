import api from "@/services/api"
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
        const response = await api.get<ApiListResponse<Product>>("/product", {
            params,
            signal,
        })
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Product>>(`/product/${id}`, {
            signal,
        })
        return response.data
    },

    getBySlug: async (slug: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Product>>(
            `/product/slug/${slug}`,
            { signal }
        )
        return response.data
    },
}
