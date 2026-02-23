import api from "@/services/api"
import type { ApiResponse } from "@/types/api"
import type { Product } from "@/types/product"
import { compareProductsSchema } from "@/schemas/comparison"

export const comparisonService = {
    compare: async (productIds: string[], signal?: AbortSignal) => {
        const parsed = compareProductsSchema.parse({ productIds })
        const response = await api.post<ApiResponse<Product[]>>(
            "/comparison/compare",
            parsed,
            { signal }
        )
        return response.data
    },
}
