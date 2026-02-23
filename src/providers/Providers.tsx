"use client"

import { type ReactNode } from "react"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { AuthProvider } from "@/providers/AuthProvider"
import SocketProvider from "@/providers/SocketProvider"
import { NotificationListener } from "@/components/common/NotificationListener"
import { Toaster } from "react-hot-toast"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        <NotificationListener />
                        <Toaster position="top-right" />
                        {children}
                    </SocketProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    )
}
