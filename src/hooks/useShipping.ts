"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { shippingService } from "@/services/shipping"
import type { ShippingAddress } from "@/types/shipping"
import type { ShippingAddressInput } from "@/schemas/shipping"

export function useShippingAddresses() {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAddresses = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await shippingService.getAddresses(signal)
            setAddresses(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load addresses")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchAddresses(controller.signal)
        return () => controller.abort()
    }, [fetchAddresses])

    return { addresses, isLoading, error, refetch: fetchAddresses }
}

export function useShippingAddressMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => { abortRef.current?.abort() }
    }, [])

    const create = useCallback(async (data: ShippingAddressInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await shippingService.createAddress(data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create address")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const update = useCallback(async (id: string, data: ShippingAddressInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await shippingService.updateAddress(id, data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to update address")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const remove = useCallback(async (id: string) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            await shippingService.deleteAddress(id, abortRef.current.signal)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to delete address")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, update, remove, isLoading, error }
}
