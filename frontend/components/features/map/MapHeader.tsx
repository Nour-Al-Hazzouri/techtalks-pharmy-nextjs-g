"use client"

import { MapPin, X, LogOut, Menu, User as UserIcon, KeyRound, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/api/auth"
import { LocationSearchBar, SelectedLocation } from "./LocationSearchBar"
import { Button } from "@/components/ui/button"
import * as React from "react"

export type DashboardView = "map" | "settings" | "profile" | "password"

interface MapHeaderProps {
    searchQuery: string
    onClear: () => void
    location: SelectedLocation | null
    onLocationSelect: (location: SelectedLocation) => void
    onLocationClear: () => void
    activeView: DashboardView
    onViewChange: (view: DashboardView) => void
}

export function MapHeader({
    searchQuery,
    onClear,
    location,
    onLocationSelect,
    onLocationClear,
    activeView,
    onViewChange,
}: MapHeaderProps) {
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)


    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error("Backend logout failed:", error)
        } finally {
            // Clear auth cookies
            document.cookie = "auth_token=; path=/; max-age=0"
            document.cookie = "user_role=; path=/; max-age=0"

            // Redirect to login
            router.push("/login")
            router.refresh()
        }
    }

    const settingsItems: Array<{ key: Exclude<DashboardView, "map" | "settings">; label: string; icon: React.ReactNode }> = [
        { key: "profile", label: "Edit Profile", icon: <UserIcon className="h-4 w-4" /> },
        { key: "password", label: "Change Password", icon: <KeyRound className="h-4 w-4" /> },
    ]

    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 shrink-0 relative z-20 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2">
                <div className="bg-[#E91E63] p-1.5 rounded-lg shrink-0">
                    <MapPin className="text-white h-5 w-5" />
                </div>

                {searchQuery ? (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-sm font-semibold text-gray-900 truncate hidden sm:block">Pharmacy Finder</h1>
                            <p className="text-xs text-gray-500 truncate">
                                <span className="hidden sm:inline">Searching for: </span>
                                <span className="sm:hidden">For: </span>
                                <span className="font-medium text-gray-700">{searchQuery}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="min-w-0 flex-1">
                        <h1 className="text-sm font-semibold text-gray-900 truncate">Pharmacy Finder</h1>
                        <p className="text-xs text-gray-500 truncate">Find nearby pharmacies</p>
                    </div>
                )}

            </div>
            <div className="flex items-center gap-2 shrink-0">
                <LocationSearchBar value={location} onSelect={onLocationSelect} onClear={onLocationClear} />
                {/* Mobile Burger */}
                <div className="relative md:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {mobileMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                            {settingsItems.map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                        onViewChange(item.key)
                                        setMobileMenuOpen(false)
                                    }}
                                    className={
                                        `w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 ${activeView === item.key ? "text-[#E91E63]" : "text-gray-700"
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}

                            <div className="h-px bg-gray-100" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 text-gray-700"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Desktop Settings */}
                <div className="relative hidden md:block">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewChange("settings")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
