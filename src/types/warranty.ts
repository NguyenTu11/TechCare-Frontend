export type WarrantyStatus = "ACTIVE" | "EXPIRED" | "CLAIMED" | "VOIDED"

export interface Warranty {
    _id: string
    order: string
    user: string
    variant: string
    serialNumber?: string
    startDate: string
    endDate: string
    warrantyMonths: number
    status: WarrantyStatus
    claimedAt?: string
    claimReason?: string
    createdAt: string
    updatedAt: string
}
