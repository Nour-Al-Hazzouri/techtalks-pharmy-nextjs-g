"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/api/auth"
import {
    LayoutDashboard,
    Package,
    Upload,
    LogOut,
    ChevronRight,
    Shield
} from "lucide-react"

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Stock Management", href: "/inventory", icon: Package },
    { label: "CSV Bulk Upload", href: "/bulk-upload", icon: Upload },
    { label: "Verification", href: "/verification", icon: Shield },
]

const mobileLabels: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/inventory": "Stock",
    "/bulk-upload": "Upload",
    "/verification": "Verify",
}

interface PharmacySidebarProps {
    pharmacyName?: string
    pharmacyLocation?: string
}

export function PharmacySidebar({
    pharmacyName = "ASTER PHARMACY",
    pharmacyLocation = "Dubai, International City, T-8601",
}: PharmacySidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch by only rendering active states after mount
    React.useEffect(() => {
        setMounted(true)
    }, [])


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

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-screen w-64 flex-col bg-white border-r border-gray-100">
                {/* Pharmacy Header */}
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-lg font-bold text-gray-900 tracking-wide">
                        {pharmacyName}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">{pharmacyLocation}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = mounted ? pathname === item.href : false
                            const Icon = item.icon

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-[#E91E63] text-white shadow-lg shadow-pink-200"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-white" : "text-gray-400"
                                            )}
                                        />
                                        <span className="flex-1">{item.label}</span>
                                        {isActive && (
                                            <ChevronRight className="h-4 w-4 text-white/70" />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5 text-gray-400" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 tracking-wide truncate">
                            {pharmacyName}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                            {pharmacyLocation}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="shrink-0 h-9 w-9 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-center"
                        aria-label="Logout"
                    >
                        <LogOut className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
                <ul className="grid grid-cols-4">
                    {navItems.map((item) => {
                        const isActive = mounted ? pathname === item.href : false
                        const Icon = item.icon

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 py-2",
                                        isActive ? "text-[#E91E63]" : "text-gray-500"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center",
                                            isActive
                                                ? "bg-[#E91E63] text-white shadow-lg shadow-pink-200"
                                                : "bg-gray-50"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-white" : "text-gray-400"
                                            )}
                                        />
                                    </span>
                                    <span className="text-[11px] font-medium">
                                        {mobileLabels[item.href] ?? item.label}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
    )
}
