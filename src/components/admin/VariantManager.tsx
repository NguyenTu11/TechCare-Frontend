"use client"

import { useState } from "react"
import { adminVariantService } from "@/services/adminCatalog"
import { useProductVariants } from "@/hooks/useProduct"

interface VariantManagerProps {
    productId: string
}

export default function VariantManager({ productId }: VariantManagerProps) {
    const { variants, isLoading, refetch } = useProductVariants(productId)
    const [isCreating, setIsCreating] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [newVariant, setNewVariant] = useState({
        sku: "",
        costPrice: 0,
        price: 0,
        salePrice: 0,
        stock: 0,
        attributes: [] as { key: string; value: string }[],
    })

    const handleAddAttribute = () => {
        setNewVariant(prev => ({ ...prev, attributes: [...prev.attributes, { key: "", value: "" }] }))
    }

    const handleAttributeChange = (index: number, field: "key" | "value", value: string) => {
        const newAttrs = [...newVariant.attributes]
        newAttrs[index][field] = value
        setNewVariant(prev => ({ ...prev, attributes: newAttrs }))
    }

    const handleRemoveAttribute = (index: number) => {
        setNewVariant(prev => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }))
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const attributesRecord: Record<string, string> = {}
            newVariant.attributes.forEach(a => {
                if (a.key.trim() && a.value.trim()) {
                    attributesRecord[a.key.trim()] = a.value.trim()
                }
            })

            await adminVariantService.create({
                product: productId,
                sku: newVariant.sku,
                costPrice: Number(newVariant.costPrice),
                price: Number(newVariant.price),
                salePrice: Number(newVariant.salePrice) || undefined,
                stock: Number(newVariant.stock),
                attributes: Object.keys(attributesRecord).length > 0 ? attributesRecord : undefined,
            })

            setIsCreating(false)
            setNewVariant({ sku: "", costPrice: 0, price: 0, salePrice: 0, stock: 0, attributes: [] })
            refetch()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create variant")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this variant?")) return
        try {
            await adminVariantService.delete(id)
            refetch()
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to delete variant")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Product Variants</h3>
                <button
                    type="button"
                    onClick={() => setIsCreating(!isCreating)}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                    {isCreating ? "Cancel" : "Add Variant"}
                </button>
            </div>

            {isCreating && (
                <div className="rounded-xl border border-border-light dark:border-border-dark p-4 bg-gray-50 dark:bg-gray-800/50">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">SKU *</label>
                                <input required type="text" value={newVariant.sku} onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Cost Price *</label>
                                <input required type="number" min={0} value={newVariant.costPrice} onChange={e => setNewVariant({ ...newVariant, costPrice: Number(e.target.value) })} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Price *</label>
                                <input required type="number" min={0} value={newVariant.price} onChange={e => setNewVariant({ ...newVariant, price: Number(e.target.value) })} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Sale Price</label>
                                <input type="number" min={0} value={newVariant.salePrice} onChange={e => setNewVariant({ ...newVariant, salePrice: Number(e.target.value) })} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Stock *</label>
                                <input required type="number" min={0} value={newVariant.stock} onChange={e => setNewVariant({ ...newVariant, stock: Number(e.target.value) })} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">Attributes</label>
                            {newVariant.attributes.map((attr, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input type="text" placeholder="Key (e.g. Color)" value={attr.key} onChange={e => handleAttributeChange(idx, "key", e.target.value)} className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none text-text-primary-light dark:text-text-primary-dark" />
                                    <input type="text" placeholder="Value (e.g. Red)" value={attr.value} onChange={e => handleAttributeChange(idx, "value", e.target.value)} className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none text-text-primary-light dark:text-text-primary-dark" />
                                    <button type="button" onClick={() => handleRemoveAttribute(idx)} className="text-red-500 hover:text-red-700">&times;</button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddAttribute} className="text-xs text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 rounded px-2 py-1">+ Add Attribute</button>
                        </div>

                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsCreating(false)} className="text-sm text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark">Cancel</button>
                            <button type="submit" disabled={submitting} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
                                {submitting ? "Saving..." : "Save Variant"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" /></div>
            ) : variants.length === 0 ? (
                <div className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    No variants added. Product will not be purchasable without variants.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase">
                            <tr>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">Cost Price</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Sale Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {variants.map(v => (
                                <tr key={v._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="px-4 py-3 font-medium text-text-primary-light dark:text-text-primary-dark">{v.sku}</td>
                                    <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v.costPrice)}
                                    </td>
                                    <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v.price)}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark">
                                        {v.salePrice ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v.salePrice) : "\u2014"}
                                    </td>
                                    <td className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark">{v.stock}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button type="button" onClick={() => handleDelete(v._id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
