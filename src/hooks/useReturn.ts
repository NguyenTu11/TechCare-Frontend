"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { returnService } from "@/services/return"
import type { Return } from "@/types/return"
import type { CreateReturnInput } from "@/schemas/return"

export function useReturns() {
    const [returns, setReturns] = useState<Return[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchReturns = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await returnService.getAll()
            setReturns(result.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load returns")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReturns()
    }, [fetchReturns])

    return { returns, isLoading, error, refetch: fetchReturns }
}

export function useCreateReturn() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const create = useCallback(async (data: CreateReturnInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)

        try {
            const result = await returnService.create(data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            const msg = err instanceof Error ? err.message : "Failed to create return"
            setError(msg)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, isLoading, error }
}

export function useCancelReturn() {
    const [isLoading, setIsLoading] = useState(false)

    const cancel = useCallback(async (id: string) => {
        setIsLoading(true)
        try {
            await returnService.cancel(id)
            return true
        } catch {
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { cancel, isLoading }
}
