"use client"

import { useState, useCallback, type FormEvent, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useResetPassword } from "@/hooks/useAuth"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const emailFromParams = searchParams.get("email") ?? ""

    const [email, setEmail] = useState(emailFromParams)
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { resetPassword, isLoading, error, success } = useResetPassword()

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            resetPassword({ email, otp, newPassword })
        },
        [email, otp, newPassword, resetPassword]
    )

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev)
    }, [])

    if (success) {
        return (
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Password reset successful
                </h2>
                <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Your password has been reset. You can now sign in with your new
                    password.
                </p>
                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 transition-all"
                >
                    Go to Sign in
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Reset password
                </h1>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Enter the code from your email and your new password
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="reset-email"
                        className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                    >
                        Email
                    </label>
                    <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label
                        htmlFor="reset-otp"
                        className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                    >
                        Reset code
                    </label>
                    <input
                        id="reset-otp"
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 tracking-[0.5em] text-center font-mono text-lg transition-colors"
                        placeholder="000000"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                    />
                </div>

                <div>
                    <label
                        htmlFor="reset-new-password"
                        className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                    >
                        New password
                    </label>
                    <div className="relative">
                        <input
                            id="reset-new-password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="mt-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
                        Min 8 chars, uppercase, lowercase, digit, special character
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? "Resetting..." : "Reset password"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <Link
                    href="/login"
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                    Back to Sign in
                </Link>
            </p>
        </>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
