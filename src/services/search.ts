import api from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Product } from "@/types/product"
import type { SearchSuggestion, PopularSearch } from "@/types/search"
import {
    searchProductsSchema,
    getSuggestionsSchema,
    type SearchProductsInput,
    type GetSuggestionsInput,
} from "@/schemas/search"

export const searchService = {
    searchProducts: async (params: SearchProductsInput, signal?: AbortSignal) => {
        const validated = searchProductsSchema.parse(params)
        const response = await api.get<ApiListResponse<Product>>("/search", {
            params: validated,
            signal,
        })
        return response.data
    },

    getSuggestions: async (params: GetSuggestionsInput, signal?: AbortSignal) => {
        const validated = getSuggestionsSchema.parse(params)
        const response = await api.get<ApiResponse<SearchSuggestion[]>>(
            "/search/suggestions",
            { params: validated, signal }
        )
        return response.data
    },

    getPopular: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<PopularSearch[]>>(
            "/search/popular",
            { signal }
        )
        return response.data
    },
}
