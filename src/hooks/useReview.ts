"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { reviewService } from "@/services/review"
import type { Review } from "@/types/review"
import type { CreateReviewInput, ReviewQueryInput } from "@/schemas/review"

export function useProductReviews(productId: string) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchReviews = useCallback(async (params?: ReviewQueryInput, signal?: AbortSignal) => {
        if (!productId) return
        setIsLoading(true)
        setError(null)
        try {
            const result = await reviewService.getProductReviews(productId, params, signal)
            setReviews(Array.isArray(result.data) ? result.data : [])
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load reviews")
        } finally {
            setIsLoading(false)
        }
    }, [productId])

    useEffect(() => {
        if (!productId) return
        const controller = new AbortController()
        fetchReviews(undefined, controller.signal)
        return () => controller.abort()
    }, [productId, fetchReviews])

    return { reviews, isLoading, error, refetch: fetchReviews }
}

export function useCreateReview() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => { abortRef.current?.abort() }
    }, [])

    const createReview = useCallback(async (data: CreateReviewInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await reviewService.create(data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create review")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { createReview, isLoading, error }
}
