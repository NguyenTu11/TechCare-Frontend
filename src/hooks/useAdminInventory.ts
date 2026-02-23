"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { adminInventoryService } from "@/services/adminInventory"
import type { VariantStock, InventoryLogsResponse } from "@/services/adminInventory"
import type { AdjustInventoryInput } from "@/schemas/inventory"

export function useAdminInventoryStock() {
    const [stock, setStock] = useState<VariantStock | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchStock = useCallback(async (variantId: string) => {
        controllerRef.current?.abort()
        controllerRef.current = new AbortController()
        const controller = controllerRef.current

        setIsLoading(true)
        setError(null)
        try {
            const result = await adminInventoryService.getStock(variantId, controller.signal)
            if (!controller.signal.aborted) {
                setStock(result.data)
            }
        } catch (err) {
            if (isCanceledError(err)) return
            if (!controller.signal.aborted) {
                setError(err instanceof Error ? err.message : "Failed to load stock")
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        return () => { controllerRef.current?.abort() }
    }, [])

    return { stock, isLoading, error, fetchStock }
}

export function useAdminInventoryLogs() {
    const [logs, setLogs] = useState<InventoryLogsResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchLogs = useCallback(async (variantId: string, params?: { page?: number; limit?: number }) => {
        controllerRef.current?.abort()
        controllerRef.current = new AbortController()
        const controller = controllerRef.current

        setIsLoading(true)
        setError(null)
        try {
            const result = await adminInventoryService.getLogs(variantId, params, controller.signal)
            if (!controller.signal.aborted) {
                setLogs(result.data)
            }
        } catch (err) {
            if (isCanceledError(err)) return
            if (!controller.signal.aborted) {
                setError(err instanceof Error ? err.message : "Failed to load inventory logs")
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        return () => { controllerRef.current?.abort() }
    }, [])

    return { logs, isLoading, error, fetchLogs }
}

export function useAdminInventoryAdjust() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const adjust = useCallback(async (data: AdjustInventoryInput) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminInventoryService.adjust(data)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to adjust inventory")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { adjust, isLoading, error }
}
