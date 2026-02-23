import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const addToCartSchema = z.object({
    variantId: z.string().min(1).regex(OBJECTID_REGEX, "Invalid variant ID"),
    quantity: z.number().int().positive("Quantity must be positive"),
})

export const updateCartItemSchema = z.object({
    variantId: z.string().min(1).regex(OBJECTID_REGEX, "Invalid variant ID"),
    quantity: z.number().int().positive("Quantity must be positive"),
})

export const removeCartItemSchema = z.object({
    variantId: z.string().min(1).regex(OBJECTID_REGEX, "Invalid variant ID"),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>
