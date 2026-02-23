"use client"

import { useParams } from "next/navigation"
import { useProduct, useProductVariants } from "@/hooks/useProduct"
import { useCart } from "@/hooks/useCart"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, Star, Truck, ShieldCheck, ArrowRight } from "lucide-react"

export default function ProductDetailPage() {
    const params = useParams<{ slug: string }>()
    const { product, isLoading, error } = useProduct(params.slug)
    const { variants } = useProductVariants(product?._id ?? "")
    const { addItem } = useCart()

    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [addingToCart, setAddingToCart] = useState(false)
    const [cartMessage, setCartMessage] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const activeVariant = variants.find((v) => v._id === selectedVariant) ?? variants[0]

    useEffect(() => {
        if (product?.thumbnail) {
            setSelectedImage(product.thumbnail)
        } else if (product?.images && product.images.length > 0) {
            setSelectedImage(product.images[0])
        }
    }, [product])

    const handleAddToCart = async () => {
        if (!activeVariant) return
        setAddingToCart(true)
        setCartMessage(null)
        try {
            await addItem({ variantId: activeVariant._id, quantity })
            setCartMessage("Added to cart!")
            setTimeout(() => setCartMessage(null), 3000)
        } catch {
            setCartMessage("Failed to add to cart")
        }
        setAddingToCart(false)
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <div className="space-y-6">
                        <div className="h-8 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        <div className="h-6 w-1/3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        <div className="h-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <p className="text-red-500">{error ?? "Product not found"}</p>
                <Link href="/shop/products" className="mt-4 inline-flex items-center text-primary-600 hover:underline">
                    Back to products <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
        )
    }

    const brandName = typeof product.brand === 'object' ? product.brand.name : "Unknown Brand"
    const categoryName = typeof product.category === 'object' ? product.category.name : "Unknown Category"
    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean) as string[]
    const uniqueImages = Array.from(new Set(allImages))

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <nav className="flex mb-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/shop/products" className="hover:text-primary-600 transition-colors">Products</Link>
                <span className="mx-2">/</span>
                <span className="text-text-primary-light dark:text-text-primary-dark truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center relative">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-contain p-4 transition-all duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="text-gray-300 dark:text-gray-700">
                                <svg className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        {product.isFeatured && (
                            <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                Featured
                            </span>
                        )}
                    </div>

                    {uniqueImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-4">
                            {uniqueImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 overflow-hidden transition-all ${selectedImage === img
                                            ? "ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900"
                                            : "hover:opacity-80"
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="h-full w-full object-contain p-1" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30">
                                {brandName}
                            </span>
                            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                {categoryName}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                            {product.name}
                        </h1>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
                                    {product.avgRating?.toFixed(1) || "0.0"}
                                </span>
                            </div>
                            <span className="h-4 w-px bg-border-light dark:bg-border-dark" />
                            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 cursor-pointer">
                                {product.reviewCount} Reviews
                            </span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark space-y-4">
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(activeVariant?.salePrice ?? activeVariant?.price ?? 0)}
                            </p>
                            {activeVariant?.salePrice && activeVariant.salePrice < activeVariant.price && (
                                <p className="text-lg text-text-secondary-light line-through decoration-2">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(activeVariant.price)}
                                </p>
                            )}
                        </div>

                        {variants.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    Select Version
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((v) => (
                                        <button
                                            key={v._id}
                                            onClick={() => setSelectedVariant(v._id)}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeVariant?._id === v._id
                                                    ? "bg-text-primary-light dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105"
                                                    : "bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark hover:border-gray-400 dark:hover:border-gray-500"
                                                } ${v.stock === 0 ? "opacity-50 cursor-not-allowed decoration-slice" : ""}`}
                                            disabled={v.stock === 0}
                                        >
                                            <div className="flex flex-col items-center">
                                                <span>{v.sku}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeVariant && (
                            <div className="flex items-center gap-4 text-xs font-medium border-t border-border-light dark:border-border-dark pt-4">
                                <div className={`flex items-center gap-1.5 ${activeVariant.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                    <div className={`h-2 w-2 rounded-full ${activeVariant.stock > 0 ? "bg-emerald-600 dark:bg-emerald-400" : "bg-rose-600 dark:bg-rose-400"} animate-pulse`} />
                                    {activeVariant.stock > 0 ? "In Stock" : "Out of Stock"}
                                </div>
                                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                                    SKU: {activeVariant.sku}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center rounded-xl border-2 border-border-light dark:border-border-dark bg-white dark:bg-gray-900 w-32">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 py-3 text-lg hover:text-primary-600 disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span className="flex-1 text-center font-semibold text-text-primary-light dark:text-text-primary-dark">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 py-3 text-lg hover:text-primary-600 disabled:opacity-50"
                                disabled={activeVariant && quantity >= activeVariant.stock}
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || !activeVariant || activeVariant.stock === 0}
                            className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 shadow-lg shadow-primary-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {addingToCart ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Add to Cart
                                </>
                            )}
                        </button>
                    </div>

                    {cartMessage && (
                        <div className={`flex items-center gap-2 text-sm font-medium p-3 rounded-lg ${cartMessage.includes("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                            {cartMessage.includes("Failed") ? null : <Check className="w-4 h-4" />}
                            {cartMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border-light dark:border-border-dark">
                        <div className="flex items-start gap-3">
                            <Truck className="w-6 h-6 text-primary-600 shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Free Shipping</h4>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">On orders over 5.000.000đ</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-6 h-6 text-primary-600 shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">1 Year Warranty</h4>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Authentic products guaranteed</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border-light dark:border-border-dark">
                        <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                            Description
                        </h3>
                        <div className="prose prose-sm dark:prose-invert text-text-secondary-light dark:text-text-secondary-dark max-w-none">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>
                    </div>

                    {product.tags && product.tags.length > 0 && (
                        <div className="pt-6 border-t border-border-light dark:border-border-dark">
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
