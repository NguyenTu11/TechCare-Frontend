"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { productService, type ProductQueryParams } from "@/services/product"
import { categoryService } from "@/services/category"
import { brandService } from "@/services/brand"
import { productVariantService } from "@/services/productVariant"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"
import type { Brand } from "@/types/brand"
import type { ProductVariant } from "@/types/productVariant"
import type { PaginationMeta } from "@/types/api"

export function useProducts(initialParams?: ProductQueryParams) {
    const [products, setProducts] = useState<Product[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)

        try {
            const result = await productService.getAll(
                params,
                abortRef.current.signal
            )
            setProducts(result.data)
            if (result.pagination) setPagination(result.pagination)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load products")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts(initialParams)
        return () => {
            abortRef.current?.abort()
        }
    }, [fetchProducts, initialParams])

    return { products, pagination, isLoading, error, refetch: fetchProducts }
}

export function useProduct(slugOrId: string) {
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slugOrId) return
        const controller = new AbortController()
        const isId = /^[a-fA-F0-9]{24}$/.test(slugOrId)

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = isId
                    ? await productService.getById(slugOrId, controller.signal)
                    : await productService.getBySlug(slugOrId, controller.signal)
                if (!controller.signal.aborted) {
                    setProduct(result.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load product"
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [slugOrId])

    return { product, isLoading, error }
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetch = async () => {
            try {
                const result = await categoryService.getAll(
                    { limit: 100 },
                    controller.signal
                )
                setCategories(result.data)
            } catch (err) {
                if (isCanceledError(err)) return
                setError(
                    err instanceof Error ? err.message : "Failed to load categories"
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetch()
        return () => controller.abort()
    }, [])

    return { categories, isLoading, error }
}

export function useBrands() {
    const [brands, setBrands] = useState<Brand[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetch = async () => {
            try {
                const result = await brandService.getAll(
                    { limit: 100 },
                    controller.signal
                )
                setBrands(result.data)
            } catch (err) {
                if (isCanceledError(err)) return
                setError(
                    err instanceof Error ? err.message : "Failed to load brands"
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetch()
        return () => controller.abort()
    }, [])

    return { brands, isLoading, error }
}

export function useProductVariants(productId: string) {
    const [variants, setVariants] = useState<ProductVariant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVariants = useCallback(async () => {
        setIsLoading(true)
        const controller = new AbortController()

        try {
            const result = await productVariantService.getByProduct(
                productId,
                controller.signal
            )
            setVariants(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(
                err instanceof Error ? err.message : "Failed to load variants"
            )
        } finally {
            setIsLoading(false)
        }

        return () => controller.abort()
    }, [productId])

    useEffect(() => {
        if (productId) fetchVariants()
    }, [productId, fetchVariants])

    return { variants, isLoading, error, refetch: fetchVariants }
}
