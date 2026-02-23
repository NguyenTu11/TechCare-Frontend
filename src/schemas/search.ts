import { z } from "zod"

export const searchProductsSchema = z.object({
    q: z.string().min(1).max(100),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    sortBy: z.enum(["price_asc", "price_desc", "newest", "rating"]).optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
})

export const getSuggestionsSchema = z.object({
    q: z.string().min(1).max(50),
})

export type SearchProductsInput = z.infer<typeof searchProductsSchema>
export type GetSuggestionsInput = z.infer<typeof getSuggestionsSchema>
