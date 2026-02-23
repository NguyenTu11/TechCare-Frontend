import api from "@/services/api"
import type { ApiResponse, PaginationMeta } from "@/types/api"
import type { ChatConversation, ChatMessage } from "@/types/chat"
import { startConversationSchema, sendMessageSchema } from "@/schemas/chat"
import type { StartConversationInput, SendMessageInput } from "@/schemas/chat"

export const chatService = {
    getConversations: async (page = 1, limit = 20, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<{ conversations: ChatConversation[]; pagination: PaginationMeta }>>(
            "/chat/conversations",
            { params: { page, limit }, signal }
        )
        return response.data
    },

    getMessages: async (conversationId: string, page = 1, limit = 50, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<{ messages: ChatMessage[]; pagination: PaginationMeta }>>(
            `/chat/${conversationId}/messages`,
            { params: { page, limit }, signal }
        )
        return response.data
    },

    startConversation: async (data: StartConversationInput, signal?: AbortSignal) => {
        const parsed = startConversationSchema.parse(data)
        const response = await api.post<ApiResponse<{ conversation: ChatConversation; message: ChatMessage }>>(
            "/chat/start",
            parsed,
            { signal }
        )
        return response.data
    },

    sendMessage: async (conversationId: string, data: SendMessageInput, signal?: AbortSignal) => {
        const parsed = sendMessageSchema.parse(data)
        const response = await api.post<ApiResponse<ChatMessage>>(
            `/chat/${conversationId}/send`,
            parsed,
            { signal }
        )
        return response.data
    },

    markAsRead: async (conversationId: string, signal?: AbortSignal) => {
        const response = await api.patch<ApiResponse<null>>(
            `/chat/${conversationId}/read`,
            {},
            { signal }
        )
        return response.data
    },

    closeConversation: async (conversationId: string, signal?: AbortSignal) => {
        const response = await api.patch<ApiResponse<null>>(
            `/chat/${conversationId}/close`,
            {},
            { signal }
        )
        return response.data
    },
}
