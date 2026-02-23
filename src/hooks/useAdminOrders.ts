"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { adminOrderService } from "@/services/adminOrder"
import type { AdminOrderParams } from "@/services/adminOrder"
import type { Order } from "@/types/order"
import type { PaginationMeta } from "@/types/api"
import type { UpdateOrderStatusInput } from "@/schemas/order"

export function useAdminOrders(initialParams?: AdminOrderParams) {
    const [orders, setOrders] = useState<Order[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchOrders = useCallback(async (params?: AdminOrderParams) => {
        controllerRef.current?.abort()
        controllerRef.current = new AbortController()
        const controller = controllerRef.current

        setIsLoading(true)
        setError(null)
        try {
            const result = await adminOrderService.getAll(params, controller.signal)
            if (!controller.signal.aborted) {
                setOrders(result.data)
                setPagination(result.pagination)
            }
        } catch (err) {
            if (isCanceledError(err)) return
            if (!controller.signal.aborted) {
                setError(err instanceof Error ? err.message : "Failed to load orders")
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchOrders(initialParams)
        return () => { controllerRef.current?.abort() }
    }, [fetchOrders, initialParams])

    return { orders, pagination, isLoading, error, refetch: fetchOrders }
}

export function useAdminOrderMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => { abortRef.current?.abort() }
    }, [])

    const updateStatus = useCallback(async (id: string, data: UpdateOrderStatusInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminOrderService.updateStatus(id, data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to update order status")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { updateStatus, isLoading, error }
}
