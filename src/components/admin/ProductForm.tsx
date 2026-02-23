"use client"

import { useState, useEffect } from "react"
import { useCategories, useBrands } from "@/hooks/useProduct"
import type { Product } from "@/types/product"

interface ProductFormProps {
    initialData?: Product
    onSubmit: (formData: FormData) => Promise<void>
    isSubmitting?: boolean
    submitLabel?: string
}

export default function ProductForm({ initialData, onSubmit, isSubmitting = false, submitLabel = "Save Product" }: ProductFormProps) {
    const { categories } = useCategories()
    const { brands } = useBrands()

    const [name, setName] = useState(initialData?.name || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [categoryId, setCategoryId] = useState(typeof initialData?.category === "object" ? initialData.category._id : initialData?.category || "")
    const [brandId, setBrandId] = useState(typeof initialData?.brand === "object" ? initialData.brand._id : initialData?.brand || "")
    const [tags, setTags] = useState(initialData?.tags?.join(", ") || "")
    const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [imageFiles, setImageFiles] = useState<File[]>([])

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null)
    const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || [])

    useEffect(() => {
        if (initialData) {
            setName(initialData.name)
            setDescription(initialData.description || "")
            setCategoryId(typeof initialData.category === 'object' ? initialData.category._id : initialData.category)
            setBrandId(typeof initialData.brand === 'object' ? initialData.brand._id : initialData.brand)
            setTags(initialData.tags?.join(", ") || "")
            setIsFeatured(initialData.isFeatured)
            setIsActive(initialData.isActive)
            setThumbnailPreview(initialData.thumbnail || null)
            setImagePreviews(initialData.images || [])
        }
    }, [initialData])

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setThumbnailFile(file)
            setThumbnailPreview(URL.createObjectURL(file))
        }
    }

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImageFiles((prev) => [...prev, ...files])

            const newPreviews = files.map(f => URL.createObjectURL(f))
            setImagePreviews((prev) => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImageFiles((prev) => {
            const newFiles = [...prev]
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        formData.append("category", categoryId)
        formData.append("brand", brandId)
        formData.append("tags", tags)
        formData.append("isFeatured", String(isFeatured))
        formData.append("isActive", String(isActive))

        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile)
        }

        if (imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append("images", file)
            })
        }

        await onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Product Name *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Category *</label>
                        <select
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Brand *</label>
                        <select
                            required
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                        >
                            <option value="" disabled>Select Brand</option>
                            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g. flagship, sale, new"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Thumbnail</label>
                        <div className="flex items-center gap-4">
                            {thumbnailPreview && (
                                <img src={thumbnailPreview} alt="Thumbnail preview" className="h-20 w-20 rounded-lg object-cover border border-border-light dark:border-border-dark" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="text-sm text-text-secondary-light dark:text-text-secondary-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-300"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Gallery Images (Replaces existing)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="w-full text-sm text-text-secondary-light dark:text-text-secondary-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-300"
                        />
                        {imagePreviews.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {imagePreviews.map((src, idx) => (
                                    <img key={idx} src={src} alt={`Preview ${idx}`} className="h-16 w-16 rounded-lg object-cover border border-border-light dark:border-border-dark" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Featured Product</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Active</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Description</label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark"
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-lg shadow-primary-500/20"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    )
}
