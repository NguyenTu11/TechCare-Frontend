"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/auth"
import { shippingService } from "@/services/shipping"
import type { ShippingAddress } from "@/types/shipping"
import type { ShippingAddressInput } from "@/schemas/shipping"
import { AppApiError } from "@/types/api"
import { ZodError } from "zod"

function extractErrorMessage(error: unknown): string {
    if (error instanceof AppApiError) return error.message
    if (error instanceof ZodError) return error.issues[0]?.message ?? "Validation failed"
    if (error instanceof Error) return error.message
    return "An unexpected error occurred"
}

export function useUpdateProfile() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const setUser = useAuthStore((s) => s.setUser)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const updateProfile = useCallback(
        async (data: { fullName?: string; avatar?: File }) => {
            abortRef.current?.abort()
            abortRef.current = new AbortController()

            setIsLoading(true)
            setError(null)
            setSuccess(false)

            try {
                const result = await authService.updateProfile(data, abortRef.current.signal)
                setUser(result.data)
                setSuccess(true)
                return true
            } catch (err) {
                if (isCanceledError(err)) return false
                setError(extractErrorMessage(err))
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [setUser]
    )

    return { updateProfile, isLoading, error, success }
}

export function useAddresses() {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    const fetchAddresses = useCallback(async () => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setError(null)

        try {
            const result = await shippingService.getAddresses(abortRef.current.signal)
            setAddresses(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAddresses()
        return () => {
            abortRef.current?.abort()
        }
    }, [fetchAddresses])

    const createAddress = useCallback(
        async (data: ShippingAddressInput) => {
            setActionLoading(true)
            setError(null)
            try {
                await shippingService.createAddress(data)
                await fetchAddresses()
                return true
            } catch (err) {
                setError(extractErrorMessage(err))
                return false
            } finally {
                setActionLoading(false)
            }
        },
        [fetchAddresses]
    )

    const updateAddress = useCallback(
        async (id: string, data: Partial<ShippingAddressInput>) => {
            setActionLoading(true)
            setError(null)
            try {
                await shippingService.updateAddress(id, data)
                await fetchAddresses()
                return true
            } catch (err) {
                setError(extractErrorMessage(err))
                return false
            } finally {
                setActionLoading(false)
            }
        },
        [fetchAddresses]
    )

    const deleteAddress = useCallback(
        async (id: string) => {
            setActionLoading(true)
            setError(null)
            try {
                await shippingService.deleteAddress(id)
                await fetchAddresses()
                return true
            } catch (err) {
                setError(extractErrorMessage(err))
                return false
            } finally {
                setActionLoading(false)
            }
        },
        [fetchAddresses]
    )

    return {
        addresses,
        isLoading,
        error,
        actionLoading,
        createAddress,
        updateAddress,
        deleteAddress,
        refetch: fetchAddresses,
    }
}
