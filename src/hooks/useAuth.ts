"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { isCanceledError } from "@/utils/isCancel"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/auth"
import type {
    RegisterInput,
    LoginInput,
    VerifyEmailInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    ResendVerificationInput,
} from "@/types/auth"
import { AppApiError } from "@/types/api"
import { ZodError } from "zod"

function extractErrorMessage(error: unknown): string {
    if (error instanceof AppApiError) return error.message
    if (error instanceof ZodError) return error.issues[0]?.message ?? "Validation failed"
    if (error instanceof Error) return error.message
    return "An unexpected error occurred"
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const setAuth = useAuthStore((s) => s.setAuth)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const login = useCallback(
        async (data: LoginInput) => {
            abortRef.current?.abort()
            abortRef.current = new AbortController()

            setIsLoading(true)
            setError(null)

            try {
                const result = await authService.login(data, abortRef.current.signal)
                const { accessToken, refreshToken } = result.data

                if (typeof window !== "undefined") {
                    localStorage.setItem("accessToken", accessToken)
                    localStorage.setItem("refreshToken", refreshToken)
                }

                const meResult = await authService.getMe(abortRef.current.signal)
                setAuth(meResult.data, accessToken, refreshToken)

                if (meResult.data.role === "admin") {
                    router.replace("/admin")
                } else {
                    router.replace("/shop")
                }
            } catch (err) {
                if (isCanceledError(err)) return
                setError(extractErrorMessage(err))
            } finally {
                setIsLoading(false)
            }
        },
        [router, setAuth]
    )

    return { login, isLoading, error }
}

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const register = useCallback(async (data: RegisterInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await authService.register(data, abortRef.current.signal)
            setSuccess(true)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { register, isLoading, error, success }
}

export function useVerifyEmail() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const verifyEmail = useCallback(async (data: VerifyEmailInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await authService.verifyEmail(data, abortRef.current.signal)
            setSuccess(true)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { verifyEmail, isLoading, error, success }
}

export function useForgotPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const forgotPassword = useCallback(async (data: ForgotPasswordInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await authService.forgotPassword(data, abortRef.current.signal)
            setSuccess(true)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { forgotPassword, isLoading, error, success }
}

export function useResetPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const resetPassword = useCallback(async (data: ResetPasswordInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await authService.resetPassword(data, abortRef.current.signal)
            setSuccess(true)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { resetPassword, isLoading, error, success }
}

export function useResendVerification() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const resendVerification = useCallback(
        async (data: ResendVerificationInput) => {
            abortRef.current?.abort()
            abortRef.current = new AbortController()

            setIsLoading(true)
            setError(null)
            setSuccess(false)

            try {
                await authService.resendVerification(data, abortRef.current.signal)
                setSuccess(true)
            } catch (err) {
                if (isCanceledError(err)) return
                setError(extractErrorMessage(err))
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    return { resendVerification, isLoading, error, success }
}

export function useLogout() {
    const [isLoading, setIsLoading] = useState(false)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const refreshToken = useAuthStore((s) => s.refreshToken)
    const router = useRouter()

    const logout = useCallback(async () => {
        setIsLoading(true)
        try {
            if (refreshToken) {
                await authService.logout(refreshToken)
            }
        } catch {
        } finally {
            clearAuth()
            setIsLoading(false)
            router.replace("/login")
        }
    }, [clearAuth, refreshToken, router])

    return { logout, isLoading }
}

export function useSession() {
    const setAuth = useAuthStore((s) => s.setAuth)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const setLoading = useAuthStore((s) => s.setLoading)
    const isLoading = useAuthStore((s) => s.isLoading)
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const user = useAuthStore((s) => s.user)
    const bootstrappedRef = useRef(false)

    useEffect(() => {
        if (bootstrappedRef.current) return
        bootstrappedRef.current = true

        const accessToken =
            typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
        const refreshToken =
            typeof window !== "undefined"
                ? localStorage.getItem("refreshToken")
                : null

        if (!accessToken || !refreshToken) {
            clearAuth()
            return
        }

        const controller = new AbortController()

        const bootstrap = async () => {
            try {
                const result = await authService.getMe(controller.signal)
                setAuth(result.data, accessToken, refreshToken)
            } catch {
                clearAuth()
            }
        }

        bootstrap()

        return () => {
            controller.abort()
        }
    }, [setAuth, clearAuth, setLoading])

    return { user, isLoading, isAuthenticated }
}
