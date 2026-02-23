export type CouponType = "PERCENTAGE" | "FIXED"

export interface Coupon {
    _id: string
    code: string
    type: CouponType
    value: number
    minOrderAmount: number
    maxDiscount?: number
    usageLimit?: number
    usedCount: number
    startDate: string
    endDate: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CouponValidation {
    valid: boolean
    discount: number
    coupon: Coupon
}
