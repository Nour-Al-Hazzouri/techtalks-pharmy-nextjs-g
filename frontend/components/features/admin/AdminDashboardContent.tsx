"use client"

import * as React from "react"
import Link from "next/link"
import {
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    ShieldCheck,
    Package,
    ChevronRight,
    Loader2,
} from "lucide-react"
import { AdminStatsCard } from "./AdminStatsCard"
import { AdminQuickActions } from "./AdminQuickActions"
import { AdminRecentActivity } from "./AdminRecentActivity"
import { getAdminDashboardStats, getPendingPharmacies, AdminPharmacy } from "@/lib/api/admin"

interface DashboardStats {
    pendingVerifications: number
    verifiedPharmacies: number
    rejected: number
    totalMedicines: number
}

export function AdminDashboardContent() {
    const [stats, setStats] = React.useState<DashboardStats | null>(null)
    const [pendingPharmacies, setPendingPharmacies] = React.useState<AdminPharmacy[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const [statsData, pharmaciesData] = await Promise.all([
                    getAdminDashboardStats(),
                    getPendingPharmacies()
                ])
                setStats(statsData)
                setPendingPharmacies(pharmaciesData)
            } catch (err) {
                console.error("Failed to fetch admin dashboard data:", err)
                setError("Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const quickActions = [
        {
            title: "VERIFY PHARMACIES",
            subtitle: "Verify pending pharmacy registrations",
            href: "/admin/verify",
            icon: <ShieldCheck className="h-6 w-6 text-[#E91E63]" />,
            iconBgColor: "bg-pink-50",
        },
        {
            title: "MANAGE CATALOG",
            subtitle: "Add or remove medicines from platform",
            href: "/admin/catalog",
            icon: <Package className="h-6 w-6 text-[#E91E63]" />,
            iconBgColor: "bg-pink-50",
        },
    ]

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E91E63]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            {/* Mobile Header - only shown on mobile */}
            <div className="md:hidden mb-6">
                <h1 className="text-lg font-bold text-gray-900 tracking-wide">ADMIN DASHBOARD</h1>
                <p className="text-xs text-gray-500">Pharmacy Verification & Medicine Management</p>
            </div>

            {/* Stats Cards - 2x2 on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <AdminStatsCard
                    title="Pending Verifications"
                    value={stats?.pendingVerifications ?? 0}
                    icon={<Clock className="h-5 w-5 text-orange-500" />}
                    iconBgColor="bg-orange-50"
                />
                <AdminStatsCard
                    title="Verified Pharmacies"
                    value={stats?.verifiedPharmacies ?? 0}
                    icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                    iconBgColor="bg-green-50"
                />
                <AdminStatsCard
                    title="Rejected"
                    value={stats?.rejected ?? 0}
                    icon={<XCircle className="h-5 w-5 text-red-500" />}
                    iconBgColor="bg-red-50"
                />
                <AdminStatsCard
                    title="Total Medicines"
                    value={stats?.totalMedicines ?? 0}
                    icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                    iconBgColor="bg-blue-50"
                />
            </div>

            {/* Pending Verifications - Vertical list on mobile */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Pending Verifications
                    </h2>
                    <Link
                        href="/admin/verify"
                        className="text-xs font-medium text-[#E91E63] hover:underline"
                    >
                        View All
                    </Link>
                </div>
                <div className="space-y-3">
                    {pendingPharmacies.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center text-gray-500 text-sm">
                            No pending verifications
                        </div>
                    ) : (
                        pendingPharmacies.slice(0, 3).map((pharmacy) => (
                            <Link
                                key={pharmacy.id}
                                href="/admin/verify"
                                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                            >
                                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                    <Clock className="h-5 w-5 text-orange-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{pharmacy.name}</p>
                                    <p className="text-xs text-gray-500">
                                        Submitted {new Date(pharmacy.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <AdminQuickActions actions={quickActions} />

            {/* Recent Activity */}
            <AdminRecentActivity />
        </div>
    )
}
