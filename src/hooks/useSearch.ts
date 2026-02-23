"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { searchService } from "@/services/search"
import type { Product } from "@/types/product"
import type { SearchSuggestion, PopularSearch } from "@/types/search"
import type { SearchProductsInput } from "@/schemas/search"
import type { PaginationMeta } from "@/types/api"

export function useSearch() {
    const [results, setResults] = useState<Product[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const search = useCallback(async (params: SearchProductsInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)

        try {
            const result = await searchService.searchProducts(
                params,
                abortRef.current.signal
            )
            setResults(result.data)
            if (result.pagination) setPagination(result.pagination)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Search failed")
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { results, pagination, isLoading, error, search }
}

export function useSuggestions() {
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const getSuggestions = useCallback(async (q: string) => {
        if (!q.trim()) {
            setSuggestions([])
            return
        }

        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)

        try {
            const result = await searchService.getSuggestions(
                { q },
                abortRef.current.signal
            )
            setSuggestions(result.data)
        } catch {
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { suggestions, isLoading, getSuggestions }
}

export function usePopularSearches() {
    const [searches, setSearches] = useState<PopularSearch[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        const fetch = async () => {
            try {
                const result = await searchService.getPopular(controller.signal)
                setSearches(result.data)
            } catch {
                /* silently fail */
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
        return () => controller.abort()
    }, [])

    return { searches, isLoading }
}
