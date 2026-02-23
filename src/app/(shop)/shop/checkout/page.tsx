"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCheckout } from "@/hooks/useOrder"
import { shippingService } from "@/services/shipping"
import type { ShippingAddress } from "@/types/shipping"
import type { PaymentMethod } from "@/types/payment"

export default function CheckoutPage() {
    const router = useRouter()
    const { checkout, isLoading, error } = useCheckout()
    const [addresses, setAddresses] = useState<ShippingAddress[]>([])
    const [selectedAddress, setSelectedAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD")
    const [couponCode, setCouponCode] = useState("")
    const [note, setNote] = useState("")

    useEffect(() => {
        const controller = new AbortController()
        shippingService.getAddresses(controller.signal).then((r) => {
            setAddresses(r.data)
            const defaultAddr = r.data.find((a) => a.isDefault)
            if (defaultAddr) setSelectedAddress(defaultAddr._id)
            else if (r.data[0]) setSelectedAddress(r.data[0]._id)
        }).catch(() => { })
        return () => controller.abort()
    }, [])

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await checkout({
            couponCode: couponCode || undefined,
            note: note || undefined,
        })
        if (result) router.push(`/shop/orders/${result._id}`)
    }

    const methods: { value: PaymentMethod; label: string }[] = [
        { value: "COD", label: "Cash on Delivery" },
        { value: "BANK_TRANSFER", label: "Bank Transfer" },
        { value: "MOMO", label: "MoMo" },
        { value: "VNPAY", label: "VNPay" },
    ]

    return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Checkout</h1>
            <form onSubmit={handleCheckout} className="space-y-6">
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Shipping Address</h2>
                    {addresses.length === 0 ? (
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">No addresses saved. Add one in your profile.</p>
                    ) : (
                        <div className="space-y-2">
                            {addresses.map((addr) => (
                                <label key={addr._id} className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${selectedAddress === addr._id ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10" : "border-border-light dark:border-border-dark hover:border-primary-300"}`}>
                                    <input type="radio" name="address" value={addr._id} checked={selectedAddress === addr._id} onChange={() => setSelectedAddress(addr._id)} className="mt-1 accent-primary-600" />
                                    <div className="text-sm">
                                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{addr.fullName} · {addr.phone}</p>
                                        <p className="text-text-secondary-light dark:text-text-secondary-dark">{addr.address}, {addr.ward}, {addr.district}, {addr.province}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Payment Method</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {methods.map((m) => (
                            <label key={m.value} className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-all ${paymentMethod === m.value ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10" : "border-border-light dark:border-border-dark hover:border-primary-300"}`}>
                                <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="accent-primary-600" />
                                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{m.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Coupon Code</h2>
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                </div>

                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                    <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Note</h2>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any special instructions..." rows={3} className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 resize-none text-text-primary-light dark:text-text-primary-dark" />
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button type="submit" disabled={isLoading || !selectedAddress} className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all">
                    {isLoading ? "Processing..." : "Place Order"}
                </button>
            </form>
        </div>
    )
}
