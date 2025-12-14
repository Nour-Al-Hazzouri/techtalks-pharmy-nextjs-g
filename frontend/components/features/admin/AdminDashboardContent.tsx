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
} from "lucide-react"
import { AdminStatsCard } from "./AdminStatsCard"
import { AdminQuickActions } from "./AdminQuickActions"
import { AdminRecentActivity } from "./AdminRecentActivity"

// Mock admin dashboard stats
const ADMIN_STATS = {
    pendingReviews: 8,
    verifiedPharmacies: 142,
    rejected: 12,
    totalMedicines: 285,
}

const MOCK_URGENT_REVIEWS = [
    { id: "1", name: "Al Manara Pharmacy", submittedDate: "Submitted 2 days ago", documents: 5 },
    { id: "2", name: "Dubai Medical Center", submittedDate: "Submitted 1 day ago", documents: 4 },
    { id: "3", name: "Wellness Pharmacy", submittedDate: "Submitted 3 days ago", documents: 5 },
]

export function AdminDashboardContent() {
    const quickActions = [
        {
            title: "VERIFY PHARMACIES",
            subtitle: "Review pending pharmacy registrations",
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
                    title="Pending Reviews"
                    value={ADMIN_STATS.pendingReviews}
                    icon={<Clock className="h-5 w-5 text-orange-500" />}
                    iconBgColor="bg-orange-50"
                />
                <AdminStatsCard
                    title="Verified Pharmacies"
                    value={ADMIN_STATS.verifiedPharmacies}
                    icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                    iconBgColor="bg-green-50"
                />
                <AdminStatsCard
                    title="Rejected"
                    value={ADMIN_STATS.rejected}
                    icon={<XCircle className="h-5 w-5 text-red-500" />}
                    iconBgColor="bg-red-50"
                />
                <AdminStatsCard
                    title="Total Medicines"
                    value={ADMIN_STATS.totalMedicines}
                    icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                    iconBgColor="bg-blue-50"
                />
            </div>

            {/* Urgent Reviews - Vertical list on mobile */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Urgent Reviews
                    </h2>
                    <Link
                        href="/admin/verify"
                        className="text-xs font-medium text-[#E91E63] hover:underline"
                    >
                        View All
                    </Link>
                </div>
                <div className="space-y-3">
                    {MOCK_URGENT_REVIEWS.map((review) => (
                        <Link
                            key={review.id}
                            href="/admin/verify"
                            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                        >
                            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                <Clock className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                                <p className="text-xs text-gray-500">{review.submittedDate} • {review.documents} documents</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <AdminQuickActions actions={quickActions} />

            {/* Recent Activity */}
            <AdminRecentActivity />
        </div>
    )
}
