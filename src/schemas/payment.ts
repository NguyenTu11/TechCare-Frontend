import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const createPaymentSchema = z.object({
    orderId: z.string().min(1, "Order ID is required").regex(OBJECTID_REGEX, "Invalid Order ID format"),
    method: z.enum(["COD", "BANK_TRANSFER", "MOMO", "VNPAY"]),
})

export const confirmPaymentSchema = z.object({
    transactionId: z.string().min(1).max(100).optional(),
})

export const createVNPaySchema = z.object({
    orderId: z.string().min(1, "Order ID is required").regex(OBJECTID_REGEX, "Invalid Order ID format"),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>
export type CreateVNPayInput = z.infer<typeof createVNPaySchema>
