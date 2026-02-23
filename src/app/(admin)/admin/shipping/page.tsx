"use client"

import { useState } from "react"
import { useAdminShipments } from "@/hooks/useAdminShipping"
import { shippingService } from "@/services/shipping"
import type { ShipmentStatus } from "@/types/shipping"

const statusColors: Record<string, string> = {
    CREATED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    PICKED_UP: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    IN_TRANSIT: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const STATUSES: ShipmentStatus[] = ["CREATED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED"]

export default function AdminShippingPage() {
    const { shipments, isLoading, refetch } = useAdminShipments()
    const [showCreate, setShowCreate] = useState(false)
    const [createData, setCreateData] = useState({ orderId: "", addressId: "" })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [updating, setUpdating] = useState<string | null>(null)
    const [updateData, setUpdateData] = useState<{ status: ShipmentStatus; trackingCode: string; estimatedDelivery: string }>({ status: "CREATED", trackingCode: "", estimatedDelivery: "" })

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!createData.orderId || !createData.addressId) return
        setSubmitting(true)
        setError("")
        try {
            await shippingService.createShipment(createData)
            setShowCreate(false)
            setCreateData({ orderId: "", addressId: "" })
            refetch()
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create shipment"
            setError(msg)
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdate = async (id: string) => {
        try {
            await shippingService.updateShipmentStatus(id, {
                status: updateData.status,
                trackingCode: updateData.trackingCode || undefined,
                estimatedDelivery: updateData.estimatedDelivery ? new Date(updateData.estimatedDelivery).toISOString() : undefined,
            })
            setUpdating(null)
            refetch()
        } catch (err: unknown) {
            alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update")
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Shipping Management</h1>
                <button onClick={() => setShowCreate(!showCreate)} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    {showCreate ? "Cancel" : "Create Shipment"}
                </button>
            </div>

            {showCreate && (
                <form onSubmit={handleCreate} className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">New Shipment</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Order ID *</label>
                            <input type="text" value={createData.orderId} onChange={(e) => setCreateData({ ...createData, orderId: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Address ID *</label>
                            <input type="text" value={createData.addressId} onChange={(e) => setCreateData({ ...createData, addressId: e.target.value })} required className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={submitting} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                        {submitting ? "Creating..." : "Create"}
                    </button>
                </form>
            )}

            {shipments.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">No shipments found</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Address</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Tracking</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Est. Delivery</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {shipments.map((s) => (
                                    <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark font-mono text-xs">{s._id.slice(-6)}</td>
                                        <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark text-xs">
                                            {s.address.fullName}, {s.address.ward}, {s.address.district}, {s.address.province}
                                        </td>
                                        <td className="px-4 py-3"><span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[s.status] ?? ""}`}>{s.status}</span></td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark font-mono text-xs">{s.trackingCode ?? "-"}</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString("vi-VN") : "-"}</td>
                                        <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark text-xs">{new Date(s.createdAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-right">
                                            {s.status !== "DELIVERED" && s.status !== "FAILED" && (
                                                <button onClick={() => { setUpdating(s._id); setUpdateData({ status: s.status, trackingCode: s.trackingCode ?? "", estimatedDelivery: s.estimatedDelivery ?? "" }) }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                                    Update
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {updating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark p-6 w-full max-w-md space-y-4">
                        <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Update Shipment Status</h2>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Status</label>
                            <select value={updateData.status} onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as ShipmentStatus })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark">
                                {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Tracking Code</label>
                            <input type="text" value={updateData.trackingCode} onChange={(e) => setUpdateData({ ...updateData, trackingCode: e.target.value })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Estimated Delivery</label>
                            <input type="date" value={updateData.estimatedDelivery ? updateData.estimatedDelivery.split("T")[0] : ""} onChange={(e) => setUpdateData({ ...updateData, estimatedDelivery: e.target.value })} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setUpdating(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                            <button onClick={() => handleUpdate(updating)} className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
