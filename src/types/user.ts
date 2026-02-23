export type UserRole = "customer" | "admin"

export interface User {
    _id: string
    email: string
    fullName: string
    avatar?: string
    role: UserRole
    isActive: boolean
    isVerified: boolean
    createdAt: string
    updatedAt: string
}
