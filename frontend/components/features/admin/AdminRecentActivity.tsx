"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ActivityItem {
    id: string
    pharmacyName: string
    action: string
    timestamp: string
    status: "verified" | "submitted" | "rejected" | "updated"
}

const statusColors: Record<ActivityItem["status"], string> = {
    verified: "bg-green-500",
    submitted: "bg-orange-500",
    rejected: "bg-red-500",
    updated: "bg-blue-500",
}

export function AdminRecentActivity() {
    // In a full implementation, this would fetch from an activity log API
    // For now, we show a placeholder message
    const recentActivity: ActivityItem[] = []

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-4">
                    No recent activity
                </div>
            ) : (
                <div className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3"
                        >
                            <div
                                className={cn(
                                    "h-2 w-2 rounded-full mt-2 shrink-0",
                                    statusColors[activity.status]
                                )}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {activity.pharmacyName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {activity.action}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {activity.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
