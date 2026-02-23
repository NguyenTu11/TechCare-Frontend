export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    pagination?: PaginationMeta
}

export interface ApiListResponse<T> {
    success: boolean
    data: T[]
    pagination: PaginationMeta
}

export interface ApiMessageResponse {
    success: boolean
    message: string
}

export interface ApiError {
    success: false
    message: string
    statusCode: number
}

export class AppApiError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.name = "AppApiError"
        this.statusCode = statusCode
    }
}
