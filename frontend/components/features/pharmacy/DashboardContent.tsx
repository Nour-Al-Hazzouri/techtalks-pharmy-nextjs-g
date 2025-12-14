"use client"

import * as React from "react"
import {
    Pill,
    CheckCircle,
    AlertTriangle,
    TrendingDown,
    Package,
    Upload,
} from "lucide-react"
import { DashboardStatsCard } from "./DashboardStatsCard"
import { QuickActionCard } from "./QuickActionCard"
import { RecentActivityList, type ActivityItem } from "./RecentActivityList"
import { MOCK_DASHBOARD_STATS, MOCK_RECENT_ACTIVITY } from "@/lib/mock-data"
import {
    getStoredRecentActivity,
    hydrateRelativeTimestamps,
} from "@/lib/pharmacy-recent-activity"

export function DashboardContent() {
    const stats = MOCK_DASHBOARD_STATS
    const [activities, setActivities] = React.useState<ActivityItem[]>(() =>
        MOCK_RECENT_ACTIVITY
    )

    React.useEffect(() => {
        const stored = getStoredRecentActivity()
        if (stored.length > 0) {
            setActivities(hydrateRelativeTimestamps(stored))
            return
        }

        setActivities(MOCK_RECENT_ACTIVITY)
    }, [])

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DashboardStatsCard
                    title="Total Medicines"
                    value={stats.totalMedicines}
                    icon={<Pill className="h-5 w-5 text-green-600" />}
                    iconBgColor="bg-green-50"
                />
                <DashboardStatsCard
                    title="In Stock"
                    value={stats.inStock}
                    icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                    iconBgColor="bg-green-50"
                />
                <DashboardStatsCard
                    title="Low Stock"
                    value={stats.lowStock}
                    icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
                    iconBgColor="bg-amber-50"
                />
                <DashboardStatsCard
                    title="Out of Stock"
                    value={stats.outOfStock}
                    icon={<TrendingDown className="h-5 w-5 text-red-500" />}
                    iconBgColor="bg-red-50"
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
