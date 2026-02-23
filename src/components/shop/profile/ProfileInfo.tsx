"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { useAuthStore } from "@/store/authStore"
import { useUpdateProfile } from "@/hooks/useProfile"

export default function ProfileInfo() {
    const user = useAuthStore((s) => s.user)
    const { updateProfile, isLoading, error, success } = useUpdateProfile()
    const [isEditing, setIsEditing] = useState(false)
    const [fullName, setFullName] = useState("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const memberSince = useMemo(() => {
        if (!user?.createdAt) return ""
        return new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }, [user?.createdAt])

    const handleStartEdit = useCallback(() => {
        if (!user) return
        setFullName(user.fullName)
        setAvatarFile(null)
        setAvatarPreview(null)
        setIsEditing(true)
    }, [user])

    const handleCancel = useCallback(() => {
        setIsEditing(false)
        setFullName("")
        setAvatarFile(null)
        setAvatarPreview(null)
    }, [])

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        const url = URL.createObjectURL(file)
        setAvatarPreview(url)
    }, [])

    const handleSave = useCallback(async () => {
        const data: { fullName?: string; avatar?: File } = {}
        if (fullName !== user?.fullName) {
            data.fullName = fullName
        }
        if (avatarFile) {
            data.avatar = avatarFile
        }
        if (Object.keys(data).length === 0) {
            setIsEditing(false)
            return
        }
        const ok = await updateProfile(data)
        if (ok) {
            setIsEditing(false)
            setAvatarFile(null)
            setAvatarPreview(null)
        }
    }, [fullName, avatarFile, user?.fullName, updateProfile])

    if (!user) return null

    const displayAvatar = avatarPreview ?? user.avatar

    return (
        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Profile Information
                </h2>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={handleStartEdit}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        {displayAvatar ? (
                            <img
                                src={displayAvatar}
                                alt={user.fullName}
                                className="h-24 w-24 rounded-full object-cover border-2 border-border-light dark:border-border-dark"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-2xl font-bold border-2 border-border-light dark:border-border-dark">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            >
                                Change Avatar
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    {isEditing ? (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                                maxLength={100}
                            />
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Full Name</p>
                            <p className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">{user.fullName}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Email</p>
                        <p className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Role</p>
                            <span className="inline-block mt-1 rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300 capitalize">
                                {user.role}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Member Since</p>
                            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mt-1">{memberSince}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Status</p>
                            <span className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-medium ${user.isVerified ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"}`}>
                                {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="rounded-xl px-6 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-4 text-sm text-red-500">{error}</p>
            )}

            {success && !isEditing && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400">Profile updated successfully</p>
            )}
        </div>
    )
}
