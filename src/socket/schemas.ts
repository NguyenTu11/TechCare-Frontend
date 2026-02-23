import { z } from "zod"

export const notificationPayloadSchema = z.object({
    title: z.string(),
    message: z.string(),
    type: z.string(),
})

export const lowStockPayloadSchema = z.object({
    productName: z.string(),
    sku: z.string(),
    stock: z.number(),
    threshold: z.number(),
})

export const inventoryLowStockPayloadSchema = z.object({
    sku: z.string(),
    stock: z.number(),
    variantId: z.string(),
})

export const chatMessagePayloadSchema = z.object({
    conversationId: z.string(),
    message: z.object({
        _id: z.string(),
        conversation: z.string(),
        sender: z.string(),
        senderRole: z.enum(["user", "admin"]),
        content: z.string(),
        isRead: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),
})

export const chatClosePayloadSchema = z.object({
    conversationId: z.string(),
})

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>
export type LowStockPayload = z.infer<typeof lowStockPayloadSchema>
export type InventoryLowStockPayload = z.infer<typeof inventoryLowStockPayloadSchema>
export type ChatMessagePayload = z.infer<typeof chatMessagePayloadSchema>
export type ChatClosePayload = z.infer<typeof chatClosePayloadSchema>
