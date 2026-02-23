import Link from "next/link"

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 p-4">
            <div className="w-full max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-500/25">
                    <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent sm:text-5xl">
                    TechCare
                </h1>
                <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
                    Your trusted destination for premium electronics with warranty and care services.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 transition-all"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center rounded-xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-8 py-3 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all"
                    >
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    )
}
