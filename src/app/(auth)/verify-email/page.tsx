"use client"

import { useState, useCallback, type FormEvent, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth"

function VerifyEmailForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const emailFromParams = searchParams.get("email") ?? ""

    const [email, setEmail] = useState(emailFromParams)
    const [otp, setOtp] = useState("")
    const { verifyEmail, isLoading, error, success } = useVerifyEmail()
    const {
        resendVerification,
        isLoading: isResending,
        success: resendSuccess,
    } = useResendVerification()

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            verifyEmail({ email, otp })
        },
        [email, otp, verifyEmail]
    )

    const handleResend = useCallback(() => {
        if (email) {
            resendVerification({ email })
        }
    }, [email, resendVerification])

    if (success) {
        return (
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Email verified
                </h2>
                <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Your email has been verified successfully. You can now sign in.
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
                    Verify your email
                </h1>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Enter the 6-digit code sent to your email
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {resendSuccess && (
                <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">
                    Verification code resent successfully
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="verify-email"
                        className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                    >
                        Email
                    </label>
                    <input
                        id="verify-email"
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
                        htmlFor="verify-otp"
                        className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                    >
                        Verification code
                    </label>
                    <input
                        id="verify-otp"
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? "Verifying..." : "Verify email"}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    type="button"
                    disabled={isResending}
                    onClick={handleResend}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 transition-colors"
                >
                    {isResending ? "Sending..." : "Resend verification code"}
                </button>
            </div>

            <p className="mt-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
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

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading...</div>}>
            <VerifyEmailForm />
        </Suspense>
    )
}
