"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/config"
import { changeMyPassword } from "@/lib/api/profile"

interface ChangePasswordPanelProps {
    onBackToMap?: () => void
}

export function ChangePasswordPanel({ onBackToMap }: ChangePasswordPanelProps) {
    const [oldPassword, setOldPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")

    const [saving, setSaving] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!oldPassword) {
            setError("Old password is required")
            return
        }
        if (!newPassword) {
            setError("New password is required")
            return
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters")
            return
        }
        if (newPassword !== confirmPassword) {
            setError("Password confirmation does not match")
            return
        }

        try {
            setSaving(true)
            const res = await changeMyPassword({
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            })

            setSuccess(res.message || "Password changed successfully")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (e) {
            if (e instanceof ApiError) {
                const firstValidationError = e.errors ? Object.values(e.errors)[0]?.[0] : null
                setError(firstValidationError || e.message)
            } else {
                setError("Failed to change password")
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <div>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                        <p className="text-sm text-gray-500">Update your account password.</p>
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
                    <label className="text-sm font-medium text-gray-700">Old Password</label>
                    <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div className="pt-2">
                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? "Updating..." : "Change password"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
