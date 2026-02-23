"use client"

import { useState, useEffect, useCallback } from "react"
import { wishlistService } from "@/services/wishlist"
import type { Wishlist } from "@/types/wishlist"

export function useWishlist() {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchWishlist = useCallback(async () => {
        setError(null)
        try {
            const result = await wishlistService.get()
            setWishlist(result.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load wishlist")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchWishlist()
    }, [fetchWishlist])

    const addItem = useCallback(async (productId: string) => {
        try {
            const result = await wishlistService.add(productId)
            setWishlist(result.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add to wishlist")
            throw err
        }
    }, [])

    const removeItem = useCallback(async (productId: string) => {
        try {
            const result = await wishlistService.remove(productId)
            setWishlist(result.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove from wishlist")
            throw err
        }
    }, [])

    const clearAll = useCallback(async () => {
        try {
            await wishlistService.clear()
            setWishlist(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to clear wishlist")
            throw err
        }
    }, [])

    const itemCount = wishlist?.items.length ?? 0

    return { wishlist, itemCount, isLoading, error, addItem, removeItem, clearAll, refetch: fetchWishlist }
}
