"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { productService } from "@/services/product"
import { adminProductService } from "@/services/adminCatalog"
import type { Product } from "@/types/product"
import type { PaginationMeta } from "@/types/api"
import type { ProductQueryParams } from "@/services/product"

export function useAdminProducts(initialParams?: ProductQueryParams) {
    const [products, setProducts] = useState<Product[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
        controllerRef.current?.abort()
        controllerRef.current = new AbortController()
        const controller = controllerRef.current

        setIsLoading(true)
        setError(null)
        try {
            const result = await productService.getAll(params, controller.signal)
            if (!controller.signal.aborted) {
                setProducts(result.data)
                setPagination(result.pagination)
            }
        } catch (err) {
            if (isCanceledError(err)) return
            if (!controller.signal.aborted) {
                setError(err instanceof Error ? err.message : "Failed to load products")
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchProducts(initialParams)
        return () => { controllerRef.current?.abort() }
    }, [fetchProducts, initialParams])

    return { products, pagination, isLoading, error, refetch: fetchProducts }
}

export function useAdminProductMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const create = useCallback(async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminProductService.create(formData)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create product")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const update = useCallback(async (id: string, formData: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminProductService.update(id, formData)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to update product")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const remove = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await adminProductService.delete(id)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to delete product")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, update, remove, isLoading, error }
}
