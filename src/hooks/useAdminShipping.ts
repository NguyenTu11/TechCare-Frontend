"use client"

import { useState, useEffect, useCallback } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { shippingService } from "@/services/shipping"
import type { Shipment } from "@/types/shipping"

export function useAdminShipments() {
    const [shipments, setShipments] = useState<Shipment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchShipments = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await shippingService.getAllShipments(signal)
            setShipments(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load shipments")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchShipments(controller.signal)
        return () => controller.abort()
    }, [fetchShipments])

    return { shipments, isLoading, error, refetch: fetchShipments }
}
