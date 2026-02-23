import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { Return } from "@/types/return"
import type { CreateReturnInput } from "@/schemas/return"

export const returnService = {
    getAll: async (signal?: AbortSignal) => {
        const response = await api.get<ApiListResponse<Return>>("/return", {
            signal,
        })
        return response.data
    },

    create: async (
        data: CreateReturnInput,
        signal?: AbortSignal
    ) => {
        const response = await api.post<ApiResponse<Return>>("/return", data, {
            signal,
        })
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Return>>(`/return/${id}`, {
            signal,
        })
        return response.data
    },

    cancel: async (id: string, signal?: AbortSignal) => {
        const response = await api.post<ApiMessageResponse>(
            `/return/${id}/cancel`,
            {},
            { signal }
        )
        return response.data
    },
}
