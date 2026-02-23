"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { paymentService } from "@/services/payment"
import type { Payment } from "@/types/payment"
import type { CreatePaymentInput, CreateVNPayInput } from "@/schemas/payment"

export function useCreatePayment() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => { abortRef.current?.abort() }
    }, [])

    const createPayment = useCallback(async (data: CreatePaymentInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await paymentService.create(data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create payment")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const createVNPay = useCallback(async (data: CreateVNPayInput) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await paymentService.createVNPay(data, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create VNPay payment")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { createPayment, createVNPay, isLoading, error }
}

export function usePaymentByOrder(orderId: string) {
    const [payment, setPayment] = useState<Payment | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!orderId) return
        const controller = new AbortController()

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await paymentService.getByOrder(orderId, controller.signal)
                if (!controller.signal.aborted) {
                    setPayment(result.data)
                }
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load payment")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [orderId])

    return { payment, isLoading, error }
}
