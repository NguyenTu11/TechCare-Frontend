"use client"

import Link from "next/link"
import { useCart } from "@/hooks/useCart"

export default function CartPage() {
    const { cart, isLoading, error, updateItem, removeItem, clearCart } = useCart()

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    const items = cart?.items ?? []

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Your Cart
                </h1>
                {items.length > 0 && (
                    <button
                        onClick={() => clearCart()}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                        Clear cart
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {items.length === 0 ? (
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-16 text-center">
                    <svg className="mx-auto h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        Your cart is empty
                    </p>
                    <Link
                        href="/shop/products"
                        className="inline-flex items-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => {
                        const variant = item.variant
                        const product = variant.product
                        const variantId = variant._id
                        return (
                            <div
                                key={variantId}
                                className="flex items-center gap-4 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-5"
                            >
                                <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    {product.thumbnail ? (
                                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-300">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                        {item.sku}
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.salePrice ?? item.price)}
                                    </p>
                                </div>

                                <div className="flex items-center rounded-xl border border-border-light dark:border-border-dark">
                                    <button
                                        onClick={() => {
                                            if (item.quantity > 1) updateItem({ variantId, quantity: item.quantity - 1 })
                                        }}
                                        className="px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-xl"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateItem({ variantId, quantity: item.quantity + 1 })}
                                        className="px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-xl"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(variantId)}
                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        )
                    })}

                    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Total</span>
                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                    items.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0)
                                )}
                            </span>
                        </div>
                        <Link
                            href="/shop/checkout"
                            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 transition-all"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
