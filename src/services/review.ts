import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { Review } from "@/types/review"
import {
    createReviewSchema,
    type CreateReviewInput,
    type ReviewQueryInput,
} from "@/schemas/review"

export const reviewService = {
    getProductReviews: async (
        productId: string,
        params?: ReviewQueryInput,
        signal?: AbortSignal
    ) => {
        const response = await api.get<ApiListResponse<Review>>(
            `/review/product/${productId}`,
            { params, signal }
        )
        return response.data
    },

    create: async (data: CreateReviewInput, signal?: AbortSignal) => {
        const validated = createReviewSchema.parse(data)
        const response = await api.post<ApiResponse<Review>>(
            "/review",
            validated,
            { signal }
        )
        return response.data
    },

    delete: async (id: string, signal?: AbortSignal) => {
        const response = await api.delete<ApiMessageResponse>(`/review/${id}`, {
            signal,
        })
        return response.data
    },
}
