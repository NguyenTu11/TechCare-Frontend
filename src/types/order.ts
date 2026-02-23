export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "FAILED"
    | "REFUNDED"

export interface OrderItem {
    _id: string
    order: string
    product: string
    variant: string
    sku: string
    name: string
    price: number
    salePrice?: number
    quantity: number
    attributes: Record<string, string>
}

export interface OrderStatusHistory {
    status: OrderStatus
    note?: string
    changedBy: string
    changedAt: string
}

export interface Order {
    _id: string
    orderNumber: string
    user: string
    items: OrderItem[]
    subtotal: number
    discount: number
    shippingFee: number
    totalAmount: number
    couponCode?: string
    status: OrderStatus
    note?: string
    createdAt: string
    updatedAt: string
}
