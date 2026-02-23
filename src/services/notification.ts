import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { Notification } from "@/types/notification"
import { notificationIdSchema } from "@/schemas/notification"

export const notificationService = {
    getAll: async (
        params?: { page?: number; limit?: number },
        signal?: AbortSignal
    ) => {
        const response = await api.get<ApiListResponse<Notification>>(
            "/notification",
            { params, signal }
        )
        return response.data
    },

    markAsRead: async (id: string, signal?: AbortSignal) => {
        const { id: validId } = notificationIdSchema.parse({ id })
        const response = await api.patch<ApiResponse<Notification>>(
            `/notification/${validId}/read`,
            {},
            { signal }
        )
        return response.data
    },

    markAllAsRead: async (signal?: AbortSignal) => {
        const response = await api.patch<ApiMessageResponse>(
            "/notification/read-all",
            {},
            { signal }
        )
        return response.data
    },

    delete: async (id: string, signal?: AbortSignal) => {
        const { id: validId } = notificationIdSchema.parse({ id })
        const response = await api.delete<ApiMessageResponse>(
            `/notification/${validId}`,
            { signal }
        )
        return response.data
    },
}
