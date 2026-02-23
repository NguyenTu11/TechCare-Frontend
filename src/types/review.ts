export interface Review {
    _id: string
    product: string
    variant: string
    user: {
        _id: string
        fullName: string
        avatar?: string
    }
    order: string
    rating: number
    comment?: string
    images?: string[]
    createdAt: string
    updatedAt: string
}
