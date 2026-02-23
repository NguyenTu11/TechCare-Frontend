"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const ProductForm = dynamic(() => import("@/components/admin/ProductForm"), { ssr: false })
import { adminProductService } from "@/services/adminCatalog"

export default function AdminCreateProductPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)
        try {
            const result = await adminProductService.create(formData)
            router.push(`/admin/products/${result.data._id}`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create product")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Create Product</h1>

            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create & Continue (Add Variants)" />
            </div>
        </div>
    )
}
