"use client"

import * as React from "react"
import {
    Pill,
    CheckCircle,
    AlertTriangle,
    TrendingDown,
    Package,
    Upload,
    Loader2,
    Star,
    Flag,
} from "lucide-react"
import { DashboardStatsCard } from "./DashboardStatsCard"
import { QuickActionCard } from "./QuickActionCard"
import { RecentActivityList, type ActivityItem } from "./RecentActivityList"
import { getDashboardStats, type DashboardStats } from "@/lib/api/pharmacy"
import { ApiError } from "@/lib/api/config"
import {
    getStoredRecentActivity,
    hydrateRelativeTimestamps,
} from "@/lib/pharmacy-recent-activity"

export function DashboardContent() {
    const [stats, setStats] = React.useState<DashboardStats | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [activities, setActivities] = React.useState<ActivityItem[]>([])

    React.useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true)
                const response = await getDashboardStats()
                setStats(response.data)
            } catch (err) {
                // Only log unexpected errors to console
                const isNotFound = err instanceof ApiError && (err.status === 404 || err.message.includes("not found"));
                if (!isNotFound) {
                    console.error("Failed to fetch dashboard stats:", err)
                }
                setError("Failed to load dashboard stats")
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    React.useEffect(() => {
        const stored = getStoredRecentActivity()
        if (stored.length > 0) {
            setActivities(hydrateRelativeTimestamps(stored))
        }
    }, [])

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E91E63]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DashboardStatsCard
                    title="Total Medicines"
                    value={stats?.total_medicines ?? 0}
                    icon={<Pill className="h-5 w-5 text-green-600" />}
                    iconBgColor="bg-green-50"
                />
                <DashboardStatsCard
                    title="In Stock"
                    value={stats?.total_available ?? 0}
                    icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                    iconBgColor="bg-green-50"
                />
                <DashboardStatsCard
                    title="Low Stock"
                    value={stats?.low_stock_count ?? 0}
                    icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
                    iconBgColor="bg-amber-50"
                />
                <DashboardStatsCard
                    title="Out of Stock"
                    value={stats?.out_of_stock ?? 0}
                    icon={<TrendingDown className="h-5 w-5 text-red-500" />}
                    iconBgColor="bg-red-50"
                />
            </div>

            <div className="mb-8">
                <DashboardStatsCard
                    title="Total Reports"
                    value={stats?.total_reports ?? 0}
                    icon={<Flag className="h-5 w-5 text-purple-600" />}
                    iconBgColor="bg-purple-50"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickActionCard
                        title="Stock Management"
                        subtitle="Update medicine availability"
                        href="/inventory"
                        icon={<Package className="h-6 w-6 text-[#E91E63]" />}
                        iconBgColor="bg-pink-50"
                    />
                    <QuickActionCard
                        title="CSV Bulk Upload"
                        subtitle="Upload inventory data"
                        href="/bulk-upload"
                        icon={<Upload className="h-6 w-6 text-[#E91E63]" />}
                        iconBgColor="bg-pink-50"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Recent Activity
                </h2>
                <RecentActivityList activities={activities} />
            </div>
        </div>
    )
}
