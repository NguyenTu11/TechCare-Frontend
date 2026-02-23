import api from "@/services/api"
import type { ApiResponse } from "@/types/api"
import type { Cart } from "@/types/cart"
import {
    addToCartSchema,
    updateCartItemSchema,
    removeCartItemSchema,
    type AddToCartInput,
    type UpdateCartItemInput,
    type RemoveCartItemInput,
} from "@/schemas/cart"
import type { ApiMessageResponse } from "@/types/api"

export const cartService = {
    get: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Cart>>("/cart", { signal })
        return response.data
    },

    addItem: async (data: AddToCartInput, signal?: AbortSignal) => {
        const validated = addToCartSchema.parse(data)
        const response = await api.post<ApiResponse<Cart>>("/cart/add", validated, {
            signal,
        })
        return response.data
    },

    updateItem: async (data: UpdateCartItemInput, signal?: AbortSignal) => {
        const validated = updateCartItemSchema.parse(data)
        const response = await api.put<ApiResponse<Cart>>(
            "/cart/update",
            validated,
            { signal }
        )
        return response.data
    },

    removeItem: async (data: RemoveCartItemInput, signal?: AbortSignal) => {
        const validated = removeCartItemSchema.parse(data)
        const response = await api.delete<ApiResponse<Cart>>("/cart/remove", {
            data: validated,
            signal,
        })
        return response.data
    },

    clear: async (signal?: AbortSignal) => {
        const response = await api.delete<ApiMessageResponse>("/cart/clear", {
            signal,
        })
        return response.data
    },
}
