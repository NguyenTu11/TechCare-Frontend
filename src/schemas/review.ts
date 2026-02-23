import { z } from "zod"

export const createReviewSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    variantId: z.string().min(1, "Variant ID is required"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
    images: z.array(z.string().url()).max(5).optional(),
})

export const reviewQuerySchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>
