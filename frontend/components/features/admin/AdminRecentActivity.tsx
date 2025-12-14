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

const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
    {
        id: "1",
        pharmacyName: "Life Pharmacy",
        action: "Verified Successfully",
        timestamp: "2 mins ago",
        status: "verified",
    },
    {
        id: "2",
        pharmacyName: "MedPlus Pharmacy",
        action: "Documents Submitted",
        timestamp: "1 hour ago",
        status: "submitted",
    },
    {
        id: "3",
        pharmacyName: "HealthCare Pharmacy",
        action: "Rejected - Invalid License",
        timestamp: "2 hours ago",
        status: "rejected",
    },
    {
        id: "4",
        pharmacyName: "Insulin Glarrine",
        action: "Added to Catalog",
        timestamp: "3 hours ago",
        status: "updated",
    },
]

const statusColors: Record<ActivityItem["status"], string> = {
    verified: "bg-green-500",
    submitted: "bg-orange-500",
    rejected: "bg-red-500",
    updated: "bg-blue-500",
}

export function AdminRecentActivity() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Recent Activity
            </h2>
            <div className="space-y-4">
                {MOCK_RECENT_ACTIVITY.map((activity) => (
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
        </div>
    )
}
