import api from "@/services/api"
import type { ApiResponse, ApiMessageResponse } from "@/types/api"
import type {
    RegisterInput,
    LoginInput,
    LoginResponseData,
    VerifyEmailInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    ResendVerificationInput,
    RefreshTokenResponseData,
    UpdateProfileInput,
} from "@/types/auth"
import type { User } from "@/types/user"
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    resendVerificationSchema,
    refreshTokenBodySchema,
    logoutBodySchema,
    updateProfileSchema,
} from "@/schemas/auth"

export const authService = {
    register: async (data: RegisterInput, signal?: AbortSignal) => {
        const validated = registerSchema.parse(data)
        const response = await api.post<ApiMessageResponse>(
            "/auth/register",
            validated,
            { signal }
        )
        return response.data
    },

    login: async (data: LoginInput, signal?: AbortSignal) => {
        const validated = loginSchema.parse(data)
        const response = await api.post<ApiResponse<LoginResponseData>>(
            "/auth/login",
            validated,
            { signal }
        )
        return response.data
    },

    verifyEmail: async (data: VerifyEmailInput, signal?: AbortSignal) => {
        const validated = verifyEmailSchema.parse(data)
        const response = await api.post<ApiMessageResponse>(
            "/auth/verify-email",
            validated,
            { signal }
        )
        return response.data
    },

    forgotPassword: async (
        data: ForgotPasswordInput,
        signal?: AbortSignal
    ) => {
        const validated = forgotPasswordSchema.parse(data)
        const response = await api.post<ApiMessageResponse>(
            "/auth/forgot-password",
            validated,
            { signal }
        )
        return response.data
    },

    resetPassword: async (
        data: ResetPasswordInput,
        signal?: AbortSignal
    ) => {
        const validated = resetPasswordSchema.parse(data)
        const response = await api.post<ApiMessageResponse>(
            "/auth/reset-password",
            validated,
            { signal }
        )
        return response.data
    },

    refreshToken: async (refreshToken: string, signal?: AbortSignal) => {
        const validated = refreshTokenBodySchema.parse({ refreshToken })
        const response = await api.post<ApiResponse<RefreshTokenResponseData>>(
            "/auth/refresh-token",
            validated,
            { signal }
        )
        return response.data
    },

    logout: async (refreshToken: string, signal?: AbortSignal) => {
        const validated = logoutBodySchema.parse({ refreshToken })
        const response = await api.post<ApiMessageResponse>(
            "/auth/logout",
            validated,
            { signal }
        )
        return response.data
    },

    getMe: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<User>>("/auth/me", { signal })
        return response.data
    },

    resendVerification: async (
        data: ResendVerificationInput,
        signal?: AbortSignal
    ) => {
        const validated = resendVerificationSchema.parse(data)
        const response = await api.post<ApiMessageResponse>(
            "/auth/resend-verification",
            validated,
            { signal }
        )
        return response.data
    },

    updateProfile: async (
        data: { fullName?: string; avatar?: File },
        signal?: AbortSignal
    ) => {
        const bodyData: UpdateProfileInput = {}
        if (data.fullName !== undefined) {
            bodyData.fullName = data.fullName
        }
        const validated = updateProfileSchema.parse(bodyData)

        const formData = new FormData()
        if (validated.fullName !== undefined) {
            formData.append("fullName", validated.fullName)
        }
        if (data.avatar !== undefined) {
            formData.append("avatar", data.avatar)
        }

        const response = await api.put<ApiResponse<User>>(
            "/auth/profile",
            formData,
            {
                signal,
                headers: { "Content-Type": "multipart/form-data" },
            }
        )
        return response.data
    },
}
