import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { AppApiError } from "@/types/api"
import { logger } from "@/lib/logger"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
})

let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else if (token) {
            promise.resolve(token)
        }
    })
    failedQueue = []
}

const getAccessToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
}

const getRefreshToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
}

const setAccessToken = (token: string): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", token)
    }
}

const clearTokens = (): void => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    }
}

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken()
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

const isAuthEndpoint = (url?: string): boolean => {
    if (!url) return false
    const authPaths = ["/auth/login", "/auth/register", "/auth/verify-email", "/auth/forgot-password", "/auth/reset-password", "/auth/refresh-token", "/auth/logout", "/auth/resend-verification"]
    return authPaths.some((path) => url.includes(path))
}

const redirectToLogin = (): void => {
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login"
    }
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error)
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        if (!originalRequest) {
            return Promise.reject(
                new AppApiError("Request configuration missing", 0)
            )
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint(originalRequest.url)
        ) {
            const refreshToken = getRefreshToken()

            if (!refreshToken) {
                clearTokens()
                redirectToLogin()
                return Promise.reject(new AppApiError("No refresh token", 401))
            }

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                    }
                    return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
                    { refreshToken }
                )

                const newAccessToken = response.data.data.accessToken as string
                setAccessToken(newAccessToken)
                processQueue(null, newAccessToken)

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                }

                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                clearTokens()
                redirectToLogin()
                return Promise.reject(new AppApiError("Session expired", 401))
            } finally {
                isRefreshing = false
            }
        }

        const statusCode = error.response?.status ?? 0
        const responseData = error.response?.data as
            | { message?: string }
            | undefined
        const message =
            responseData?.message ?? error.message ?? "An unexpected error occurred"

        logger.error(`API Error [${statusCode}]:`, message)

        return Promise.reject(new AppApiError(message, statusCode))
    }
)

export default api
