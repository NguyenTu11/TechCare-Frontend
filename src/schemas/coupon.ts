import { z } from "zod"

export const createCouponSchema = z.object({
    code: z
        .string()
        .min(3, "Code must be at least 3 characters")
        .max(20, "Code must be at most 20 characters")
        .regex(/^[A-Z0-9]+$/, "Code must contain only uppercase letters and numbers"),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number().positive("Value must be positive"),
    minOrderAmount: z.number().min(0, "Minimum order amount cannot be negative").default(0),
    maxDiscount: z.number().positive("Max discount must be positive").optional(),
    usageLimit: z.number().int().positive("Usage limit must be positive").optional(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date"),
})

export const updateCouponSchema = z.object({
    value: z.number().positive().optional(),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscount: z.number().positive().nullable().optional(),
    usageLimit: z.number().int().positive().nullable().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
})

export const validateCouponSchema = z.object({
    code: z.string().min(1, "Coupon code is required"),
    orderAmount: z.number().positive("Order amount must be positive"),
})

export type CreateCouponInput = z.infer<typeof createCouponSchema>
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>
