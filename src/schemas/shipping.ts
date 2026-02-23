import { z } from "zod"

export const shippingAddressSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    province: z.string().min(1, "Province is required"),
    district: z.string().min(1, "District is required"),
    ward: z.string().min(1, "Ward is required"),
    isDefault: z.boolean().optional(),
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
