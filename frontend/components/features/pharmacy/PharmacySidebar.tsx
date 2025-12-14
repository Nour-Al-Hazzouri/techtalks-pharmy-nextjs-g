"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    Upload,
    LogOut,
    ChevronRight,
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
]

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

    const handleLogout = () => {
        // Simply redirect to login page (no cookies to clear)
        router.push("/login")
    }

    return (
        <aside className="flex h-screen w-64 flex-col bg-white border-r border-gray-100">
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
                        // Use mounted check to prevent hydration issues
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
    )
}
