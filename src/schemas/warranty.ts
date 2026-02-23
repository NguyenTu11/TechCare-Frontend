import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const createWarrantySchema = z.object({
    orderId: z.string().min(1).regex(OBJECTID_REGEX, "Invalid order ID"),
    variantId: z.string().min(1).regex(OBJECTID_REGEX, "Invalid variant ID"),
    warrantyMonths: z.number().int().min(1).max(120),
    serialNumber: z.string().max(100).optional(),
})

export const claimWarrantySchema = z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters").max(1000, "Reason too long"),
})

export const checkWarrantySchema = z.object({
    serialNumber: z.string().min(1).optional(),
    orderId: z.string().regex(OBJECTID_REGEX, "Invalid order ID").optional(),
    variantId: z.string().regex(OBJECTID_REGEX, "Invalid variant ID").optional(),
}).refine(data => {
    return data.serialNumber || (data.orderId && data.variantId)
}, { message: "Provide serialNumber or both orderId and variantId" })

export type CreateWarrantyInput = z.infer<typeof createWarrantySchema>
export type ClaimWarrantyInput = z.infer<typeof claimWarrantySchema>
export type CheckWarrantyInput = z.infer<typeof checkWarrantySchema>
