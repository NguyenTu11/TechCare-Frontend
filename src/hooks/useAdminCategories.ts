"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { categoryService } from "@/services/category"
import { adminCategoryService } from "@/services/adminCatalog"
import type { Category } from "@/types/category"

export function useAdminCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCategories = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await categoryService.getAll(undefined, signal)
            setCategories(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load categories")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchCategories(controller.signal)
        return () => controller.abort()
    }, [fetchCategories])

    return { categories, isLoading, error, refetch: fetchCategories }
}

export function useAdminCategoryMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const create = useCallback(async (data: { name: string; description?: string }) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminCategoryService.create(data)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create category")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const update = useCallback(async (id: string, data: { name?: string; description?: string }) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminCategoryService.update(id, data)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to update category")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const remove = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await adminCategoryService.delete(id)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to delete category")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, update, remove, isLoading, error }
}
