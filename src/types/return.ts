export type ReturnStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED"

export type ReturnType = "REFUND" | "EXCHANGE"

export interface ReturnItem {
    variant: string
    quantity: number
    reason: string
}

export interface Return {
    _id: string
    order: string
    user: string
    returnNumber: string
    type: ReturnType
    items: ReturnItem[]
    status: ReturnStatus
    note?: string
    adminNote?: string
    refundAmount?: number
    processedAt?: string
    processedBy?: string
    createdAt: string
    updatedAt: string
}
