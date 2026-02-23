export type PaymentMethod = "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY"
export type PaymentStatus =
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED"

export interface Payment {
    _id: string
    order: string
    user: string
    method: PaymentMethod
    amount: number
    status: PaymentStatus
    transactionId?: string
    paidAt?: string
    createdAt: string
    updatedAt: string
}
