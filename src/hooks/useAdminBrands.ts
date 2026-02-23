"use client"

import { useState, useEffect, useCallback } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { brandService } from "@/services/brand"
import { adminBrandService } from "@/services/adminCatalog"
import type { Brand } from "@/types/brand"

export function useAdminBrands() {
    const [brands, setBrands] = useState<Brand[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBrands = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await brandService.getAll(undefined, signal)
            setBrands(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load brands")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchBrands(controller.signal)
        return () => controller.abort()
    }, [fetchBrands])

    return { brands, isLoading, error, refetch: fetchBrands }
}

export function useAdminBrandMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const create = useCallback(async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminBrandService.create(formData)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create brand")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const update = useCallback(async (id: string, formData: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminBrandService.update(id, formData)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to update brand")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const remove = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await adminBrandService.delete(id)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to delete brand")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, update, remove, isLoading, error }
}
