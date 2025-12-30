"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/config"
import { getMyProfile, updateMyProfile } from "@/lib/api/profile"
import type { User } from "@/lib/api/types"

interface UserProfilePanelProps {
    onBackToMap?: () => void
}

export function UserProfilePanel({ onBackToMap }: UserProfilePanelProps) {
    const [profile, setProfile] = React.useState<User | null>(null)
    const [email, setEmail] = React.useState("")
    const [name, setName] = React.useState("")
    const [phone, setPhone] = React.useState<string>("")

    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)

    React.useEffect(() => {
        let mounted = true

        async function load() {
            try {
                setLoading(true)
                setError(null)
                const res = await getMyProfile()
                if (!mounted) return
                setProfile(res.data)
                setEmail(res.data.email ?? "")
                setName(res.data.name ?? "")
                setPhone(res.data.phone ?? "")
            } catch (e) {
                if (!mounted) return
                if (e instanceof ApiError) {
                    setError(e.message)
                } else {
                    setError("Failed to load profile")
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        load()

        return () => {
            mounted = false
        }
    }, [])

    const isValidEmail = (value: string) => {
        const raw = value.trim()
        if (!raw) return false
        return /^[^\s@]+@[^\s@]+\.[^\s@]{1,}$/.test(raw)
    }

    const isValidName = (value: string) => {
        const raw = value.trim()
        if (!raw) return false
        return /^[\p{L}\p{M}]+(?:[ \-'\u2019][\p{L}\p{M}]+)*$/u.test(raw)
    }

    const isValidLebanonPhone = (value: string) => {
        const raw = value.trim()
        if (!raw) return true

        const PHONE_FORMAT_REGEX = /^(?:\+961 ?\d{2} ?\d{3} ?\d{3}|\+961\d{8}|00961 ?\d{2} ?\d{3} ?\d{3}|00961\d{8}|\d{2} ?\d{3} ?\d{3}|\d{8})$/
        return PHONE_FORMAT_REGEX.test(raw)
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(null)

        if (!name.trim()) {
            setError("Name is required")
            return
        }

        if (!isValidName(name)) {
            setError("Name can only contain letters, spaces, hyphens, and apostrophes")
            return
        }

        if (!email.trim()) {
            setError("Email is required")
            return
        }

        if (!isValidEmail(email)) {
            setError("Email must be a valid email address")
            return
        }

        if (phone.trim() && !isValidLebanonPhone(phone)) {
            setError("Phone number must be a valid Lebanese phone number")
            return
        }

        try {
            setSaving(true)
            setError(null)

            const res = await updateMyProfile({
                email: email.trim(),
                name: name.trim(),
                phone: phone.trim() ? phone.trim() : null,
            })

            setProfile(res.data)
            setEmail(res.data.email ?? "")
            setName(res.data.name ?? "")
            setPhone(res.data.phone ?? "")
            setSuccess("Profile updated")
        } catch (e) {
            if (e instanceof ApiError) {
                const firstValidationError = e.errors ? Object.values(e.errors)[0]?.[0] : null
                setError(firstValidationError || e.message)
            } else {
                setError("Failed to update profile")
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-sm text-gray-500">Loading profile...</div>
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <div>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                        <p className="text-sm text-gray-500">Update your email, name, and phone number.</p>
                    </div>
                    {onBackToMap && (
                        <Button variant="outline" size="sm" type="button" onClick={onBackToMap}>
                            Back to Map
                        </Button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                </div>

                <div className="pt-2">
                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
