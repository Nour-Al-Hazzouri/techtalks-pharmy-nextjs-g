import * as React from "react"
import { cn } from "@/lib/utils"

export interface ActivityItem {
    id: string
    medicineName: string
    action: string
    timestamp: string
    status: "in_stock" | "low_stock" | "out_of_stock"
}

interface RecentActivityListProps {
    activities: ActivityItem[]
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                No recent activity
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex items-start gap-3 py-2"
                >
                    {/* Status Indicator */}
                    <div className="mt-1.5">
                        <span
                            className={cn(
                                "block h-2.5 w-2.5 rounded-full",
                                activity.status === "in_stock" && "bg-green-500",
                                activity.status === "low_stock" && "bg-[#E91E63]",
                                activity.status === "out_of_stock" && "bg-[#E91E63]"
                            )}
                        />
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                            {activity.medicineName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {activity.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {activity.timestamp}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
