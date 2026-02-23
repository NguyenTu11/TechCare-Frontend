import { z } from "zod"

export const checkoutSchema = z.object({
    note: z.string().max(500, "Note must be less than 500 characters").optional(),
    couponCode: z.string().min(1).max(50, "Coupon code must be less than 50 characters").optional(),
})

export const updateOrderStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "FAILED",
        "REFUNDED",
    ]),
    note: z.string().optional(),
})

export const orderQuerySchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(50).optional(),
    status: z
        .enum([
            "PENDING",
            "PAID",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
            "FAILED",
            "REFUNDED",
        ])
        .optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type OrderQueryInput = z.infer<typeof orderQuerySchema>
