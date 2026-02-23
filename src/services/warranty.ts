import api from "@/services/api"
import type { ApiResponse, ApiListResponse } from "@/types/api"
import type { Warranty } from "@/types/warranty"
import { createWarrantySchema, claimWarrantySchema } from "@/schemas/warranty"
import type { CreateWarrantyInput, ClaimWarrantyInput } from "@/schemas/warranty"

export const warrantyService = {
    getAll: async (signal?: AbortSignal) => {
        const response = await api.get<ApiListResponse<Warranty>>("/warranty", {
            signal,
        })
        return response.data
    },

    getById: async (id: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Warranty>>(`/warranty/${id}`, {
            signal,
        })
        return response.data
    },

    claim: async (
        id: string,
        data: ClaimWarrantyInput,
        signal?: AbortSignal
    ) => {
        const parsed = claimWarrantySchema.parse(data)
        const response = await api.post<ApiResponse<Warranty>>(
            `/warranty/${id}/claim`,
            parsed,
            { signal }
        )
        return response.data
    },

    check: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Warranty[]>>(
            "/warranty/check",
            { signal }
        )
        return response.data
    },

    create: async (
        data: CreateWarrantyInput,
        signal?: AbortSignal
    ) => {
        const parsed = createWarrantySchema.parse(data)
        const response = await api.post<ApiResponse<Warranty>>(
            "/warranty",
            parsed,
            { signal }
        )
        return response.data
    },

    void: async (id: string, signal?: AbortSignal) => {
        const response = await api.delete<ApiResponse<Warranty>>(
            `/warranty/${id}/void`,
            { signal }
        )
        return response.data
    },
}
