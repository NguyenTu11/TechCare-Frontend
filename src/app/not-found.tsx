import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
            <div className="text-center">
                <p className="text-8xl font-bold text-primary-500">404</p>
                <h1 className="mt-4 text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Page not found
                </h1>
                <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                    The page you are looking for does not exist.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
