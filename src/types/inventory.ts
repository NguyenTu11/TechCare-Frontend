export type InventoryAction = "IMPORT" | "ORDER" | "CANCEL" | "ADJUST"

export interface InventoryLog {
    _id: string
    variant: string
    action: InventoryAction
    quantity: number
    before: number
    after: number
    refId?: string
    note?: string
    performedBy: string
    createdAt: string
}
