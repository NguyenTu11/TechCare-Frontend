"use client"

import ProfileInfo from "@/components/shop/profile/ProfileInfo"
import AddressList from "@/components/shop/profile/AddressList"

export default function ProfilePage() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
                My Profile
            </h1>
            <div className="space-y-6">
                <ProfileInfo />
                <AddressList />
            </div>
        </div>
    )
}
