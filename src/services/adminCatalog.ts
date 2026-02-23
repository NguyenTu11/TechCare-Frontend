import api from "@/services/api"
import type { ApiResponse, ApiMessageResponse } from "@/types/api"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"
import type { Brand } from "@/types/brand"
import type { ProductVariant } from "@/types/productVariant"

export const adminProductService = {
    create: async (formData: FormData) => {
        const r = await api.post<ApiResponse<Product>>("/product", formData)
        return r.data
    },
    update: async (id: string, formData: FormData) => {
        const r = await api.put<ApiResponse<Product>>(`/product/${id}`, formData)
        return r.data
    },
    delete: async (id: string) => {
        const r = await api.delete<ApiMessageResponse>(`/product/${id}`)
        return r.data
    },
}

export const adminCategoryService = {
    create: async (data: { name: string; description?: string }) => {
        const r = await api.post<ApiResponse<Category>>("/category", data)
        return r.data
    },
    update: async (id: string, data: { name?: string; description?: string }) => {
        const r = await api.put<ApiResponse<Category>>(`/category/${id}`, data)
        return r.data
    },
    delete: async (id: string) => {
        const r = await api.delete<ApiMessageResponse>(`/category/${id}`)
        return r.data
    },
}

export const adminBrandService = {
    create: async (formData: FormData) => {
        const r = await api.post<ApiResponse<Brand>>("/brand", formData)
        return r.data
    },
    update: async (id: string, formData: FormData) => {
        const r = await api.put<ApiResponse<Brand>>(`/brand/${id}`, formData)
        return r.data
    },
    delete: async (id: string) => {
        const r = await api.delete<ApiMessageResponse>(`/brand/${id}`)
        return r.data
    },
}

export const adminVariantService = {
    create: async (data: {
        product: string
        sku: string
        costPrice: number
        price: number
        stock: number
        attributes?: Record<string, string>
        salePrice?: number
    }) => {
        const r = await api.post<ApiResponse<ProductVariant>>("/product-variant", data)
        return r.data
    },
    update: async (id: string, data: Partial<{
        sku: string
        costPrice: number
        price: number
        salePrice: number | null
        stock: number
        attributes: Record<string, string>
        isActive: boolean
    }>) => {
        const r = await api.put<ApiResponse<ProductVariant>>(`/product-variant/${id}`, data)
        return r.data
    },
    delete: async (id: string) => {
        const r = await api.delete<ApiMessageResponse>(`/product-variant/${id}`)
        return r.data
    },
    increaseStock: async (id: string, data: { quantity: number }) => {
        const r = await api.post<ApiResponse<ProductVariant>>(`/product-variant/${id}/increase-stock`, data)
        return r.data
    },
    decreaseStock: async (id: string, data: { quantity: number }) => {
        const r = await api.post<ApiResponse<ProductVariant>>(`/product-variant/${id}/decrease-stock`, data)
        return r.data
    },
}
