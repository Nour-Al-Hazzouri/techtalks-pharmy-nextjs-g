import * as React from "react"
import { cn } from "@/lib/utils"

interface AdminStatsCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    iconBgColor?: string
}

export function AdminStatsCard({
    title,
    value,
    icon,
    iconBgColor = "bg-gray-100",
}: AdminStatsCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 flex flex-col items-center md:flex-row md:items-start gap-3 md:gap-4">
            <div className={cn("p-2.5 md:p-3 rounded-full md:rounded-xl", iconBgColor)}>
                {icon}
            </div>
            <div className="text-center md:text-left">
                <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{title}</p>
            </div>
        </div>
    )
}
