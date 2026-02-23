import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const startConversationSchema = z.object({
    message: z.string().min(1).max(2000),
})

export const sendMessageSchema = z.object({
    content: z.string().min(1).max(2000),
})

export const getMessagesQuerySchema = z.object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).optional(),
})

export const getConversationsQuerySchema = z.object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).optional(),
})

export const conversationIdSchema = z.object({
    id: z.string().min(1).regex(OBJECTID_REGEX, "Invalid conversation ID format"),
})

export type StartConversationInput = z.infer<typeof startConversationSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>
export type GetConversationsQuery = z.infer<typeof getConversationsQuerySchema>
