"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickAction {
    title: string
    subtitle: string
    href: string
    icon: React.ReactNode
    iconBgColor: string
}

interface AdminQuickActionsProps {
    actions: QuickAction[]
}

export function AdminQuickActions({ actions }: AdminQuickActionsProps) {
    return (
        <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={cn("p-3 rounded-xl", action.iconBgColor)}>
                            {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                            <p className="text-xs text-gray-500">{action.subtitle}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
