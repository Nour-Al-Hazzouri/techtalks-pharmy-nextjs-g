"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut, User as UserIcon, KeyRound, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/api/auth"
import type { DashboardView } from "@/components/features/map/MapHeader"

interface SettingsPanelProps {
    onViewChange: (view: DashboardView) => void
    onBackToMap?: () => void
}

export function SettingsPanel({ onViewChange, onBackToMap }: SettingsPanelProps) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error("Backend logout failed:", error)
        } finally {
            document.cookie = "auth_token=; path=/; max-age=0"
            document.cookie = "user_role=; path=/; max-age=0"

            router.push("/login")
            router.refresh()
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500">Manage your profile and password.</p>
                </div>
                {onBackToMap && (
                    <Button variant="outline" size="sm" type="button" onClick={onBackToMap}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Map
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Button type="button" variant="outline" className="justify-start" onClick={() => onViewChange("profile")}
                >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>

                <Button type="button" variant="outline" className="justify-start" onClick={() => onViewChange("password")}
                >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                </Button>

                <Button type="button" variant="outline" className="justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
