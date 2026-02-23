"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isLoading = useAuthStore((s) => s.isLoading)
    const user = useAuthStore((s) => s.user)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login")
        } else if (!isLoading && isAuthenticated && user?.role !== "admin") {
            router.replace("/shop")
        }
    }, [isLoading, isAuthenticated, user, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
        )
    }

    if (!isAuthenticated || !user || user.role !== "admin") {
        return null
    }

    return (
        <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    )
}
