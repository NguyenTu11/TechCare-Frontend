"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { warrantyService } from "@/services/warranty"
import type { Warranty } from "@/types/warranty"
import type { ClaimWarrantyInput } from "@/schemas/warranty"

export function useWarranties() {
    const [warranties, setWarranties] = useState<Warranty[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await warrantyService.getAll(controller.signal)
                if (!controller.signal.aborted) {
                    setWarranties(result.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load warranties")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [])

    return { warranties, isLoading, error }
}

export function useWarrantyClaim() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => { abortRef.current?.abort() }
    }, [])

    const claim = useCallback(async (id: string, data: ClaimWarrantyInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)

        try {
            const result = await warrantyService.claim(id, data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            const msg = err instanceof Error ? err.message : "Failed to claim warranty"
            setError(msg)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { claim, isLoading, error }
}
