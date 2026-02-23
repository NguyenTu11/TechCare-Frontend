import api from "@/services/api"
import type { ApiResponse, ApiListResponse, ApiMessageResponse } from "@/types/api"
import type { ShippingAddress, Shipment, ShipmentStatus } from "@/types/shipping"
import {
    shippingAddressSchema,
    type ShippingAddressInput,
} from "@/schemas/shipping"

export const shippingService = {
    getAddresses: async (signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<ShippingAddress[]>>(
            "/shipping/address",
            { signal }
        )
        return response.data
    },

    createAddress: async (data: ShippingAddressInput, signal?: AbortSignal) => {
        const validated = shippingAddressSchema.parse(data)
        const response = await api.post<ApiResponse<ShippingAddress>>(
            "/shipping/address",
            validated,
            { signal }
        )
        return response.data
    },

    updateAddress: async (
        id: string,
        data: Partial<ShippingAddressInput>,
        signal?: AbortSignal
    ) => {
        const response = await api.put<ApiResponse<ShippingAddress>>(
            `/shipping/address/${id}`,
            data,
            { signal }
        )
        return response.data
    },

    deleteAddress: async (id: string, signal?: AbortSignal) => {
        const response = await api.delete<ApiMessageResponse>(
            `/shipping/address/${id}`,
            { signal }
        )
        return response.data
    },

    getShipmentByOrder: async (orderId: string, signal?: AbortSignal) => {
        const response = await api.get<ApiResponse<Shipment>>(
            `/shipping/shipment/order/${orderId}`,
            { signal }
        )
        return response.data
    },

    getAllShipments: async (signal?: AbortSignal) => {
        const response = await api.get<ApiListResponse<Shipment>>(
            "/shipping/shipment",
            { signal }
        )
        return response.data
    },

    createShipment: async (
        data: { orderId: string; addressId: string },
        signal?: AbortSignal
    ) => {
        const response = await api.post<ApiResponse<Shipment>>(
            "/shipping/shipment",
            data,
            { signal }
        )
        return response.data
    },

    updateShipmentStatus: async (
        id: string,
        data: { status: ShipmentStatus; trackingCode?: string; estimatedDelivery?: string },
        signal?: AbortSignal
    ) => {
        const response = await api.patch<ApiResponse<Shipment>>(
            `/shipping/shipment/${id}/status`,
            data,
            { signal }
        )
        return response.data
    },
}
