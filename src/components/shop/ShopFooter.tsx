import Link from "next/link"

export default function ShopFooter() {
    return (
        <footer className="border-t border-border-light dark:border-border-dark bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                                TechCare
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Your trusted destination for premium electronics with warranty and care services.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                            Shop
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/shop/products", label: "All Products" },
                                { href: "/shop/categories", label: "Categories" },
                                { href: "/shop/search", label: "Search" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                            Account
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/shop/orders", label: "My Orders" },
                                { href: "/shop/wishlist", label: "Wishlist" },
                                { href: "/shop/warranties", label: "Warranties" },
                                { href: "/shop/notifications", label: "Notifications" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/shop/returns", label: "Returns & Refunds" },
                                { href: "/shop/comparison", label: "Compare Products" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-border-light dark:border-border-dark pt-6 text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        © {new Date().getFullYear()} TechCare. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
