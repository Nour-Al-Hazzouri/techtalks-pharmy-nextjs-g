"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface UrgentReview {
    id: string
    name: string
    submittedDate: string
    documents: number
    status: "pending" | "urgent"
}

const MOCK_URGENT_REVIEWS: UrgentReview[] = [
    {
        id: "1",
        name: "AL MANARA PHARMACY",
        submittedDate: "Submitted 2 days ago",
        documents: 3,
        status: "pending",
    },
    {
        id: "2",
        name: "DUBAI MEDICAL CENTER",
        submittedDate: "Submitted 1 day ago",
        documents: 4,
        status: "urgent",
    },
    {
        id: "3",
        name: "WELLNESS PHARMACY",
        submittedDate: "Submitted 3 days ago",
        documents: 5,
        status: "pending",
    },
]

export function UrgentReviewsSection() {
    return (
        <div className="mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_URGENT_REVIEWS.map((review) => (
                    <Link
                        key={review.id}
                        href={`/admin/verify/${review.id}`}
                        className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow flex items-center gap-3"
                    >
                        <div
                            className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                review.status === "urgent" ? "bg-orange-500" : "bg-green-500"
                            )}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {review.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {review.submittedDate} • {review.documents} documents
                            </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
