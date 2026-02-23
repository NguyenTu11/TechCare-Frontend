"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const ProductForm = dynamic(() => import("@/components/admin/ProductForm"), { ssr: false })
const VariantManager = dynamic(() => import("@/components/admin/VariantManager"), { ssr: false })
import { adminProductService } from "@/services/adminCatalog"
import { useProduct } from "@/hooks/useProduct"

export default function AdminEditProductPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const { product, isLoading, error: fetchError } = useProduct(id)

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true)
        setError(null)
        setSuccess(null)
        try {
            await adminProductService.update(id, formData)
            setSuccess("Product updated successfully")
            window.scrollTo(0, 0)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update product")
        } finally {
            setSubmitting(false)
        }
    }

    if (isLoading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
    if (fetchError || !product) return (
        <div className="p-6 text-center">
            <p className="text-red-500">Error: {fetchError || "Product not found"}</p>
            <button onClick={() => router.push("/admin/products")} className="mt-4 text-primary-600 hover:underline">Back to Products</button>
        </div>
    )

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Edit Product: {product.name}</h1>
                <button onClick={() => router.push("/admin/products")} className="text-sm text-text-secondary-light hover:text-text-primary-light">Back to List</button>
            </div>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">General Information</h2>
                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                <ProductForm initialData={product} onSubmit={handleSubmit} isSubmitting={submitting} />
            </div>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                <VariantManager productId={id} />
            </div>
        </div>
    )
}
