"use client"

import { useState, useCallback } from "react"
import { useAddresses } from "@/hooks/useProfile"
import type { ShippingAddress } from "@/types/shipping"
import type { ShippingAddressInput } from "@/schemas/shipping"
import AddressForm from "./AddressForm"

export default function AddressList() {
    const {
        addresses,
        isLoading,
        error,
        actionLoading,
        createAddress,
        updateAddress,
        deleteAddress,
    } = useAddresses()

    const [showForm, setShowForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleCreate = useCallback(async (data: ShippingAddressInput) => {
        return createAddress(data)
    }, [createAddress])

    const handleUpdate = useCallback(async (data: ShippingAddressInput) => {
        if (!editingAddress) return false
        return updateAddress(editingAddress._id, data)
    }, [editingAddress, updateAddress])

    const handleDelete = useCallback(async (id: string) => {
        const ok = await deleteAddress(id)
        if (ok) {
            setDeletingId(null)
        }
    }, [deleteAddress])

    const handleSetDefault = useCallback(async (id: string) => {
        await updateAddress(id, { isDefault: true })
    }, [updateAddress])

    const handleOpenCreate = useCallback(() => {
        setEditingAddress(null)
        setShowForm(true)
    }, [])

    const handleOpenEdit = useCallback((addr: ShippingAddress) => {
        setEditingAddress(addr)
        setShowForm(true)
    }, [])

    const handleCloseForm = useCallback(() => {
        setShowForm(false)
        setEditingAddress(null)
    }, [])

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Shipping Addresses
                </h2>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                    Add Address
                </button>
            </div>

            {error && (
                <p className="mb-4 text-sm text-red-500">{error}</p>
            )}

            {addresses.length === 0 ? (
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-8 text-center">
                    No addresses saved yet. Add your first shipping address.
                </p>
            ) : (
                <div className="space-y-3">
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            className="rounded-xl border border-border-light dark:border-border-dark p-4 transition-all hover:border-primary-300 dark:hover:border-primary-700"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                                            {addr.fullName}
                                        </p>
                                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                            {addr.phone}
                                        </span>
                                        {addr.isDefault && (
                                            <span className="shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                        {addr.address}, {addr.ward}, {addr.district}, {addr.province}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {!addr.isDefault && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(addr._id)}
                                            disabled={actionLoading}
                                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(addr)}
                                        disabled={actionLoading}
                                        className="rounded-lg p-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        aria-label="Edit address"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    {deletingId === addr._id ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(addr._id)}
                                                disabled={actionLoading}
                                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingId(null)}
                                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setDeletingId(addr._id)}
                                            disabled={actionLoading}
                                            className="rounded-lg p-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            aria-label="Delete address"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <AddressForm
                    mode={editingAddress ? "edit" : "create"}
                    address={editingAddress ?? undefined}
                    onSave={editingAddress ? handleUpdate : handleCreate}
                    onCancel={handleCloseForm}
                    isLoading={actionLoading}
                />
            )}
        </div>
    )
}
