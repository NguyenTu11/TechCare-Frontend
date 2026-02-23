"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { orderService } from "@/services/order"
import type { Order } from "@/types/order"
import type { CheckoutInput, OrderQueryInput } from "@/schemas/order"
import type { PaginationMeta } from "@/types/api"

export function useOrders(initialParams?: OrderQueryInput) {
    const [orders, setOrders] = useState<Order[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrders = useCallback(async (params?: OrderQueryInput) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await orderService.getAll(params)
            setOrders(result.data)
            if (result.pagination) setPagination(result.pagination)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOrders(initialParams)
    }, [fetchOrders, initialParams])

    return { orders, pagination, isLoading, error, refetch: fetchOrders }
}

export function useOrder(id: string) {
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetch = async () => {
            setIsLoading(true)
            try {
                const result = await orderService.getById(id, controller.signal)
                setOrder(result.data)
            } catch (err) {
                if (isCanceledError(err)) return
                setError(err instanceof Error ? err.message : "Failed to load order")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetch()
        return () => controller.abort()
    }, [id])

    return { order, isLoading, error }
}

export function useCheckout() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const checkout = useCallback(async (data: CheckoutInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)

        try {
            const result = await orderService.checkout(
                data,
                abortRef.current.signal
            )
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            const msg = err instanceof Error ? err.message : "Checkout failed"
            setError(msg)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { checkout, isLoading, error }
}
