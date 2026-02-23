"use client"

import { type ReactNode } from "react"
import { useSession } from "@/hooks/useAuth"

export function AuthProvider({ children }: { children: ReactNode }) {
    useSession()
    return <>{children}</>
}
