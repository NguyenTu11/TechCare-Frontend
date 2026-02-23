import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const compareProductsSchema = z.object({
    productIds: z.array(
        z.string().regex(OBJECTID_REGEX, "Invalid product ID")
    ).min(2, "At least 2 products required").max(4, "Maximum 4 products allowed"),
})

export type CompareProductsInput = z.infer<typeof compareProductsSchema>
