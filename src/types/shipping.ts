export type ShipmentStatus =
    | "CREATED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "FAILED"

export interface ShippingAddress {
    _id: string
    user: string
    fullName: string
    phone: string
    address: string
    province: string
    district: string
    ward: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

export interface ShipmentAddressSnapshot {
    fullName: string
    phone: string
    province: string
    district: string
    ward: string
    address: string
}

export interface Shipment {
    _id: string
    order: string
    address: ShipmentAddressSnapshot
    trackingCode?: string
    status: ShipmentStatus
    estimatedDelivery?: string
    deliveredAt?: string
    createdAt: string
    updatedAt: string
}
