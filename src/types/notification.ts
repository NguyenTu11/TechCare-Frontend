export type NotificationType =
    | "ORDER_STATUS"
    | "PAYMENT_SUCCESS"
    | "PAYMENT_FAILED"
    | "PAYMENT_REFUNDED"
    | "SHIPMENT_UPDATE"
    | "LOW_STOCK"
    | "SYSTEM"

export interface Notification {
    _id: string
    user: string
    type: NotificationType
    title: string
    message: string
    data?: Record<string, unknown>
    isRead: boolean
    createdAt: string
    updatedAt: string
}
