import api from "@/services/api"
import type { ApiResponse } from "@/types/api"
import type { ProductVariant } from "@/types/productVariant"

export const productVariantService = {
    getByProduct: async (productId: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<ProductVariant[]>>(
            `/product-variant/product/${productId}`,
            { signal }
        )
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<ProductVariant>>(
            `/product-variant/${id}`,
            { signal }
        )
        return response.data
    },

    getBySku: async (sku: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<ProductVariant>>(
            `/product-variant/sku/${sku}`,
            { signal }
        )
        return response.data
    },
}
