import { z } from "zod"

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
    )

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    fullName: z.string().min(1, "Full name is required"),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export const verifyEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    newPassword: passwordSchema,
})

export const refreshTokenBodySchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
})

export const logoutBodySchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
})

export const resendVerificationSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export const updateProfileSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(100, "Full name must be less than 100 characters").optional(),
})
