import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const adjustInventorySchema = z.object({
    variantId: z
        .string()
        .min(1, "Variant ID is required")
        .regex(OBJECTID_REGEX, "Invalid Variant ID format"),
    action: z.enum(["IMPORT", "ORDER", "CANCEL", "ADJUST"]),
    quantity: z
        .number()
        .int("Quantity must be an integer")
        .positive("Quantity must be positive"),
    refId: z
        .string()
        .regex(OBJECTID_REGEX, "Invalid reference ID format")
        .optional(),
    note: z
        .string()
        .max(500, "Note must be less than 500 characters")
        .optional(),
})

export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>
