"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface QuickActionCardProps {
    title: string
    subtitle: string
    href: string
    icon: React.ReactNode
    iconBgColor?: string
}

export function QuickActionCard({
    title,
    subtitle,
    href,
    icon,
    iconBgColor = "bg-pink-50",
}: QuickActionCardProps) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
        >
            <div
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    iconBgColor
                )}
            >
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
        </Link>
    )
}
