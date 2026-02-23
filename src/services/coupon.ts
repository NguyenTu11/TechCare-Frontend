import api from "@/services/api"
import type { ApiResponse } from "@/types/api"
import type { Coupon, CouponValidation } from "@/types/coupon"
import { validateCouponSchema } from "@/schemas/coupon"
import type { ValidateCouponInput } from "@/schemas/coupon"

export const couponService = {
    getActive: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Coupon[]>>("/coupon/active", {
            signal,
        })
        return response.data
    },

    validate: async (
        data: ValidateCouponInput,
        signal?: AbortSignal
    ) => {
        const parsed = validateCouponSchema.parse(data)
        const response = await api.post<ApiResponse<CouponValidation>>(
            "/coupon/validate",
            parsed,
            { signal }
        )
        return response.data
    },
}
