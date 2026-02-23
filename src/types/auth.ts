import { z } from "zod"
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    resendVerificationSchema,
    updateProfileSchema,
} from "@/schemas/auth"

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export interface LoginResponseData {
    accessToken: string
    refreshToken: string
    user: {
        id: string
        email: string
        fullName: string
    }
}

export interface RefreshTokenResponseData {
    accessToken: string
}
