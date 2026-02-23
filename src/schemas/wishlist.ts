import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const addToWishlistSchema = z.object({
    productId: z.string().min(1, "Product ID is required").regex(OBJECTID_REGEX, "Invalid product ID format"),
})

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>
