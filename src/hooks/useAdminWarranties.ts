"use client"

import { useState, useEffect, useCallback } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { warrantyService } from "@/services/warranty"
import type { Warranty } from "@/types/warranty"
import type { CreateWarrantyInput } from "@/schemas/warranty"

export function useAdminWarranties() {
    const [warranties, setWarranties] = useState<Warranty[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchWarranties = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await warrantyService.getAll(signal)
            setWarranties(Array.isArray(result.data) ? result.data : [])
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load warranties")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchWarranties(controller.signal)
        return () => controller.abort()
    }, [fetchWarranties])

    return { warranties, isLoading, error, refetch: fetchWarranties }
}

export function useAdminWarrantyMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const create = useCallback(async (data: CreateWarrantyInput) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await warrantyService.create(data)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create warranty")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const voidWarranty = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await warrantyService.void(id)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to void warranty")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, voidWarranty, isLoading, error }
}
