import * as React from "react"
import { cn } from "@/lib/utils"

interface DashboardStatsCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    iconBgColor: string
}

export function DashboardStatsCard({
    title,
    value,
    icon,
    iconBgColor,
}: DashboardStatsCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        iconBgColor
                    )}
                >
                    {icon}
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{title}</p>
                </div>
            </div>
        </div>
    )
}
