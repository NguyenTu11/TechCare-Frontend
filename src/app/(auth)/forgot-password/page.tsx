"use client"

import { useState, useCallback, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForgotPassword } from "@/hooks/useAuth"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const { forgotPassword, isLoading, error, success } = useForgotPassword()
    const router = useRouter()

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            forgotPassword({ email })
        },
        [email, forgotPassword]
    )

    if (success) {
        return (
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Check your email
                </h2>
                <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    If an account exists for <strong>{email}</strong>, we sent a reset OTP
                    to that address.
                </p>
                <button
                    type="button"
                    onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
                    className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 transition-all"
                >
                    Enter reset code
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Forgot password?
                </h1>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Enter your email and we&apos;ll send you a reset code
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
                        htmlFor="forgot-email"
                        className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                    >
                        Email
                    </label>
                    <input
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? "Sending..." : "Send reset code"}
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
