import { z } from "zod"

export const getRevenueQuerySchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const getTopProductsQuerySchema = z.object({
    limit: z.number().int().min(1).optional(),
})

export const getLowStockQuerySchema = z.object({
    threshold: z.number().int().min(1).optional(),
})

export type GetRevenueQuery = z.infer<typeof getRevenueQuerySchema>
export type GetTopProductsQuery = z.infer<typeof getTopProductsQuerySchema>
export type GetLowStockQuery = z.infer<typeof getLowStockQuerySchema>
