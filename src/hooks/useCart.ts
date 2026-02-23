"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { cartService } from "@/services/cart"
import type { Cart } from "@/types/cart"
import type { AddToCartInput, UpdateCartItemInput } from "@/schemas/cart"

export function useCart() {
    const [cart, setCart] = useState<Cart | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    const fetchCart = useCallback(async () => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setError(null)

        try {
            const result = await cartService.get(abortRef.current.signal)
            setCart(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load cart")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCart()
        return () => {
            abortRef.current?.abort()
        }
    }, [fetchCart])

    const addItem = useCallback(
        async (data: AddToCartInput) => {
            try {
                const result = await cartService.addItem(data)
                setCart(result.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to add item")
                throw err
            }
        },
        []
    )

    const updateItem = useCallback(
        async (data: UpdateCartItemInput) => {
            try {
                const result = await cartService.updateItem(data)
                setCart(result.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to update item")
                throw err
            }
        },
        []
    )

    const removeItem = useCallback(
        async (variantId: string) => {
            try {
                const result = await cartService.removeItem({ variantId })
                setCart(result.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to remove item")
                throw err
            }
        },
        []
    )

    const clearCart = useCallback(async () => {
        try {
            await cartService.clear()
            setCart(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to clear cart")
            throw err
        }
    }, [])

    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0

    return {
        cart,
        itemCount,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refetch: fetchCart,
    }
}
