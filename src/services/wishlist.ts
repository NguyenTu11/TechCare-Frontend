import api from "@/services/api"
import type { ApiResponse, ApiMessageResponse } from "@/types/api"
import type { Wishlist } from "@/types/wishlist"
import { addToWishlistSchema } from "@/schemas/wishlist"

export const wishlistService = {
    get: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Wishlist>>("/wishlist", {
            signal,
        })
        return response.data
    },

    add: async (productId: string, signal?: AbortSignal) => {
        const parsed = addToWishlistSchema.parse({ productId })
        const response = await api.post<ApiResponse<Wishlist>>(
            "/wishlist",
            parsed,
            { signal }
        )
        return response.data
    },

    remove: async (productId: string, signal?: AbortSignal) => {
        const response = await api.delete<ApiResponse<Wishlist>>(
            `/wishlist/${productId}`,
            { signal }
        )
        return response.data
    },

    check: async (productId: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<{ inWishlist: boolean }>>(
            `/wishlist/check/${productId}`,
            { signal }
        )
        return response.data
    },

    clear: async (signal?: AbortSignal) => {
        const response = await api.delete<ApiMessageResponse>("/wishlist", {
            signal,
        })
        return response.data
    },
}
