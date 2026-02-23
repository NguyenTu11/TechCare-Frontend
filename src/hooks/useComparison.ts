"use client"

import { useState, useEffect, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { comparisonService } from "@/services/comparison"
import type { Product } from "@/types/product"

export function useComparison(productIds: string[]) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        if (productIds.length < 2) {
            setProducts([])
            return
        }

        controllerRef.current?.abort()
        controllerRef.current = new AbortController()
        const controller = controllerRef.current

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await comparisonService.compare(productIds, controller.signal)
                if (!controller.signal.aborted) {
                    setProducts(result.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load comparison")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [productIds])

    return { products, isLoading, error }
}
