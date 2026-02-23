"use client"

import { useState, useCallback, useEffect } from "react"
import { shippingAddressSchema, type ShippingAddressInput } from "@/schemas/shipping"
import type { ShippingAddress } from "@/types/shipping"
import { ZodError } from "zod"

interface AddressFormProps {
    mode: "create" | "edit"
    address?: ShippingAddress
    onSave: (data: ShippingAddressInput) => Promise<boolean>
    onCancel: () => void
    isLoading: boolean
}

export default function AddressForm({ mode, address, onSave, onCancel, isLoading }: AddressFormProps) {
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [province, setProvince] = useState("")
    const [district, setDistrict] = useState("")
    const [ward, setWard] = useState("")
    const [addressLine, setAddressLine] = useState("")
    const [isDefault, setIsDefault] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (mode === "edit" && address) {
            setFullName(address.fullName)
            setPhone(address.phone)
            setProvince(address.province)
            setDistrict(address.district)
            setWard(address.ward)
            setAddressLine(address.address)
            setIsDefault(address.isDefault)
        }
    }, [mode, address])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setFieldErrors({})

        const data: ShippingAddressInput = {
            fullName,
            phone,
            province,
            district,
            ward,
            address: addressLine,
            isDefault: isDefault || undefined,
        }

        try {
            shippingAddressSchema.parse(data)
        } catch (err) {
            if (err instanceof ZodError) {
                const errors: Record<string, string> = {}
                for (const issue of err.issues) {
                    const field = issue.path[0]
                    if (typeof field === "string") {
                        errors[field] = issue.message
                    }
                }
                setFieldErrors(errors)
                return
            }
        }

        const ok = await onSave(data)
        if (ok) {
            onCancel()
        }
    }, [fullName, phone, province, district, ward, addressLine, isDefault, onSave, onCancel])

    const inputClassName = "w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-6 py-4">
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {mode === "create" ? "Add New Address" : "Edit Address"}
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg p-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={inputClassName}
                                maxLength={100}
                            />
                            {fieldErrors.fullName && <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClassName}
                                maxLength={20}
                            />
                            {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                            Province / City
                        </label>
                        <input
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className={inputClassName}
                            maxLength={100}
                        />
                        {fieldErrors.province && <p className="mt-1 text-xs text-red-500">{fieldErrors.province}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                                District
                            </label>
                            <input
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className={inputClassName}
                                maxLength={100}
                            />
                            {fieldErrors.district && <p className="mt-1 text-xs text-red-500">{fieldErrors.district}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                                Ward
                            </label>
                            <input
                                type="text"
                                value={ward}
                                onChange={(e) => setWard(e.target.value)}
                                className={inputClassName}
                                maxLength={100}
                            />
                            {fieldErrors.ward && <p className="mt-1 text-xs text-red-500">{fieldErrors.ward}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                            Address Detail
                        </label>
                        <input
                            type="text"
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            className={inputClassName}
                            maxLength={500}
                        />
                        {fieldErrors.address && <p className="mt-1 text-xs text-red-500">{fieldErrors.address}</p>}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="h-4 w-4 rounded border-border-light dark:border-border-dark accent-primary-600"
                        />
                        <span className="text-sm text-text-primary-light dark:text-text-primary-dark">Set as default address</span>
                    </label>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all"
                        >
                            {isLoading ? "Saving..." : mode === "create" ? "Add Address" : "Update Address"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="rounded-xl px-6 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
