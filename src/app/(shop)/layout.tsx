"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import ShopHeader from "@/components/shop/ShopHeader"
import ShopFooter from "@/components/shop/ShopFooter"

export default function ShopLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isLoading = useAuthStore((s) => s.isLoading)
    const user = useAuthStore((s) => s.user)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login")
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="flex min-h-screen flex-col bg-surface-light dark:bg-surface-dark">
            <ShopHeader />
            <main className="flex-1">{children}</main>
            <ShopFooter />
        </div>
    )
}
