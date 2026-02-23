"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { returnService } from "@/services/return"
import { adminReturnService } from "@/services/adminOrder"
import type { Return } from "@/types/return"
import type { ProcessReturnInput } from "@/schemas/return"

export function useAdminReturns() {
    const [returns, setReturns] = useState<Return[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchReturns = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await returnService.getAll(signal)
            setReturns(result.data)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load returns")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchReturns(controller.signal)
        return () => controller.abort()
    }, [fetchReturns])

    return { returns, isLoading, error, refetch: fetchReturns }
}

export function useAdminReturnMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const process = useCallback(async (id: string, data: ProcessReturnInput) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminReturnService.process(id, data)
            return result
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to process return")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { process, isLoading, error }
}
