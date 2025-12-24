"use client"

import * as React from "react"
import {
    AlertTriangle,
    Calendar,
    User,
    Building2,
    CheckCircle2,
    Clock,
    MessageSquare,
    ChevronDown,
    Loader2,
    RefreshCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminReports, updateReportStatus, AdminReport } from "@/lib/api/admin"
import { format } from "date-fns"

export function ReportsContent() {
    const [reports, setReports] = React.useState<AdminReport[]>([])
    const [loading, setLoading] = React.useState(true)
    const [refreshing, setRefreshing] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const fetchReports = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true)
        else setLoading(true)

        setError(null)
        try {
            const response = await getAdminReports()
            if (response.status) {
                setReports(response.data.data)
            } else {
                setError(response.message || "Failed to load reports")
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching reports")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    React.useEffect(() => {
        fetchReports()
    }, [])

    const handleUpdateStatus = async (reportId: number, status: string) => {
        try {
            const response = await updateReportStatus(reportId, status)
            if (response.status) {
                setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: status as any } : r))
            }
        } catch (err: any) {
            console.error("Failed to update status:", err)
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'resolved':
                return "bg-green-50 text-green-700 border-green-100"
            case 'reviewed':
                return "bg-blue-50 text-blue-700 border-blue-100"
            default:
                return "bg-amber-50 text-amber-700 border-amber-100"
        }
    }

    const getReportTypeLabel = (type: string) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 text-[#E91E63] animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Loading reports...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and resolve issues reported by users regarding pharmacies.</p>
                </div>
                <button
                    onClick={() => fetchReports(true)}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all disabled:opacity-50"
                >
                    <RefreshCcw className={cn("h-5 w-5 text-gray-600", refreshing && "animate-spin")} />
                </button>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                    <button
                        onClick={() => fetchReports()}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100"
                    >
                        Try Again
                    </button>
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 p-12 rounded-3xl flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-gray-300" />
                    </div>
                    <div>
                        <p className="text-gray-900 font-bold italic">No reports found</p>
                        <p className="text-sm text-gray-400 mt-1">Everything seems to be working perfectly!</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                getStatusStyles(report.status)
                                            )}>
                                                {report.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#E91E63] uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                                                {getReportTypeLabel(report.report_type)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                            {report.pharmacy?.name || "Unknown Pharmacy"}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <User className="h-4 w-4 text-[#E91E63]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Reported By</p>
                                                    <p className="font-semibold text-gray-700 truncate">{report.user?.name || "Anonymous"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <Calendar className="h-4 w-4 text-[#E91E63]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Received On</p>
                                                    <p className="font-semibold text-gray-700">
                                                        {format(new Date(report.created_at), "MMM d, yyyy • h:mm a")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {report.reason && (
                                            <div className="bg-amber-50/30 border-l-4 border-amber-400 p-4 rounded-r-xl">
                                                <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Detailed Reason</p>
                                                <p className="text-gray-700 text-sm leading-relaxed">{report.reason}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                                                disabled={report.status === 'reviewed'}
                                                className={cn(
                                                    "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                                    report.status === 'reviewed'
                                                        ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                                                )}
                                            >
                                                Review
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(report.id, 'resolved')}
                                                disabled={report.status === 'resolved'}
                                                className={cn(
                                                    "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm",
                                                    report.status === 'resolved'
                                                        ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed shadow-none"
                                                        : "bg-[#E91E63] text-white border-[#E91E63] hover:bg-[#D81B60]"
                                                )}
                                            >
                                                Resolve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
