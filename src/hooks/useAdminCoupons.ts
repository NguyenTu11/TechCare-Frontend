"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { adminCouponService } from "@/services/adminCoupon"
import type { Coupon } from "@/types/coupon"
import type { PaginationMeta } from "@/types/api"
import type { CreateCouponInput } from "@/schemas/coupon"

export function useAdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchCoupons = useCallback(async (params?: { page?: number; limit?: number; active?: string }, signal?: AbortSignal) => {
        controllerRef.current?.abort()
        controllerRef.current = new AbortController()
        const controller = signal ? { signal } : controllerRef.current

        setIsLoading(true)
        setError(null)
        try {
            const usedSignal = signal ?? controllerRef.current.signal
            const result = await adminCouponService.getAll(params, usedSignal)
            if (!usedSignal.aborted) {
                setCoupons(result.data.coupons)
                setPagination(result.data.pagination)
            }
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load coupons")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchCoupons(undefined, controller.signal)
        return () => controller.abort()
    }, [fetchCoupons])

    return { coupons, pagination, isLoading, error, refetch: fetchCoupons }
}

export function useAdminCouponMutation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const create = useCallback(async (data: CreateCouponInput) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await adminCouponService.create(data)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to create coupon")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const remove = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await adminCouponService.delete(id)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to delete coupon")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { create, remove, isLoading, error }
}
