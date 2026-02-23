import { z } from "zod"

export const createReturnSchema = z.object({
    orderId: z.string().min(1, "Order is required"),
    type: z.enum(["REFUND", "EXCHANGE"]),
    items: z
        .array(
            z.object({
                variantId: z.string().min(1, "Variant is required"),
                quantity: z.number().int().min(1, "Quantity must be at least 1"),
                reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
            })
        )
        .min(1, "At least one item is required")
        .max(10),
    note: z.string().max(1000).optional(),
})

export const processReturnSchema = z.object({
    action: z.enum(["APPROVE", "REJECT", "COMPLETE"]),
    adminNote: z.string().max(1000).optional(),
    refundAmount: z.number().min(0).optional(),
})

export type CreateReturnInput = z.infer<typeof createReturnSchema>
export type ProcessReturnInput = z.infer<typeof processReturnSchema>
