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
    RefreshCcw,
    X,
    ShieldCheck,
    ShieldAlert,
    ExternalLink,
    Mail,
    Phone as PhoneIcon,
    FileText,
    MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminReports, updateReportStatus, approvePharmacy, rejectPharmacy, AdminReport } from "@/lib/api/admin"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface ReviewModalProps {
    report: AdminReport | null
    isOpen: boolean
    onClose: () => void
    onStatusUpdate: (id: number, status: string) => Promise<void>
    onVerificationUpdate: () => void
}

function ReportReviewModal({ report, isOpen, onClose, onStatusUpdate, onVerificationUpdate }: ReviewModalProps) {
    const [actionLoading, setActionLoading] = React.useState<string | null>(null)
    const [rejectReason, setRejectReason] = React.useState("")
    const [showRejectForm, setShowRejectForm] = React.useState(false)
    const [localPharmacy, setLocalPharmacy] = React.useState(report?.pharmacy)

    React.useEffect(() => {
        if (report?.pharmacy) {
            setLocalPharmacy(report.pharmacy)
        }
    }, [report])

    if (!isOpen || !report) return null

    const handleApprove = async () => {
        setActionLoading('approve')
        try {
            await approvePharmacy(report.pharmacy_id)
            setLocalPharmacy(prev => prev ? { ...prev, verified: true } : prev)
            onVerificationUpdate()
        } catch (err) {
            console.error("Failed to approve pharmacy:", err)
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async () => {
        if (!rejectReason.trim()) return
        setActionLoading('reject')
        try {
            await rejectPharmacy(report.pharmacy_id, rejectReason)
            setLocalPharmacy(prev => prev ? { ...prev, verified: false } : prev)
            setShowRejectForm(false)
            setRejectReason("")
            onVerificationUpdate()
        } catch (err) {
            console.error("Failed to reject pharmacy:", err)
        } finally {
            setActionLoading(null)
        }
    }

    const handleStatusUpdate = async (status: string) => {
        setActionLoading(status)
        try {
            await onStatusUpdate(report.id, status)
            onClose()
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-[#E91E63]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Review Report #{report.id}</h3>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                {report.report_type.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all shadow-sm">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Reporter Info */}
                    <section className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <User className="h-3 w-3" />
                            Reporter Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Name</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">{report.user?.name || "Anonymous User"}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Email</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">{report.user?.email || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pharmacy Info */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Building2 className="h-3 w-3" />
                                Pharmacy Details
                            </h4>
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                localPharmacy?.verified ? "bg-green-50 text-green-700 border border-green-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                            )}>
                                {localPharmacy?.verified ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                                {localPharmacy?.verified ? 'Verified' : 'Unverified'}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-6 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h5 className="text-xl font-black text-gray-900 uppercase italic leading-none">{localPharmacy?.name}</h5>
                                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                                            <MapPin className="h-4 w-4 text-[#E91E63]" />
                                            <p className="text-sm font-medium">{localPharmacy?.address}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                                            <span className="font-semibold text-gray-600">{localPharmacy?.phone || "No Phone"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="font-semibold text-gray-600">ID: {report.pharmacy_id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {!localPharmacy?.verified ? (
                                        <Button
                                            onClick={handleApprove}
                                            disabled={!!actionLoading || report.status === 'resolved'}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-green-100"
                                        >
                                            {actionLoading === 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Pharmacy"}
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            {!showRejectForm ? (
                                                <Button
                                                    onClick={() => setShowRejectForm(true)}
                                                    variant="outline"
                                                    disabled={report.status === 'resolved'}
                                                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-bold h-11 rounded-xl"
                                                >
                                                    Revoke Verification
                                                </Button>
                                            ) : (
                                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                    <textarea
                                                        placeholder="Reason for revocation..."
                                                        className="w-full text-xs p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-200 focus:bg-white outline-none transition-all min-h-[80px]"
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={handleReject}
                                                            disabled={!rejectReason.trim() || !!actionLoading}
                                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                                                        >
                                                            {actionLoading === 'reject' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Revoke"}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setShowRejectForm(false)}
                                                            className="text-xs font-bold"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Report Content */}
                    <section className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <MessageSquare className="h-3 w-3" />
                            Report Message
                        </h4>
                        <div className="bg-[#FFF8E1] border-2 border-amber-100/50 rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MessageSquare className="h-16 w-16 text-amber-500 rotate-12" />
                            </div>
                            <p className="text-gray-800 font-medium leading-relaxed relative z-10 italic">
                                "{report.reason || "No written details provided for this report."}"
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500 font-bold hover:bg-gray-100 h-12 px-6 rounded-2xl"
                    >
                        Back
                    </Button>
                    <div className="flex-1" />
                    <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate('dismissed')}
                        disabled={!!actionLoading}
                        className="border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 font-bold h-12 px-6 rounded-2xl"
                    >
                        {actionLoading === 'dismissed' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Dismiss Report"}
                    </Button>
                    <Button
                        onClick={() => handleStatusUpdate('resolved')}
                        disabled={!!actionLoading}
                        className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-pink-100"
                    >
                        {actionLoading === 'resolved' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resolve & Close"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function ReportsContent() {
    const [reports, setReports] = React.useState<AdminReport[]>([])
    const [loading, setLoading] = React.useState(true)
    const [refreshing, setRefreshing] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [selectedReport, setSelectedReport] = React.useState<AdminReport | null>(null)

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

    const handleVerificationComplete = () => {
        fetchReports(true)
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'resolved':
                return "bg-green-50 text-green-700 border-green-100"
            case 'dismissed':
                return "bg-gray-50 text-gray-500 border-gray-100"
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
        <div className="max-w-7xl mx-auto space-y-8 py-12 px-4 md:px-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-none">User Reports</h1>
                    <p className="text-sm text-gray-500 mt-2">Manage and resolve issues reported by users regarding pharmacies.</p>
                </div>
                <button
                    onClick={() => fetchReports(true)}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                    <RefreshCcw className={cn("h-5 w-5 text-gray-600", refreshing && "animate-spin")} />
                </button>
            </div>

            {error ? (
                <div className="bg-red-50 border-2 border-red-100 p-8 rounded-3xl flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                        <p className="text-red-900 font-bold italic">Operational Interruption</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => fetchReports()}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200"
                    >
                        Re-initialize Fetch
                    </button>
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 p-16 rounded-3xl flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                        <MessageSquare className="h-10 w-10 text-gray-300" />
                    </div>
                    <div>
                        <p className="text-gray-900 font-bold italic text-lg uppercase tracking-tight">System Status: Optimal</p>
                        <p className="text-sm text-gray-400 mt-1 max-w-[240px]">There are currently no active reports requiring administrative attention.</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-pink-100/50 transition-all duration-300 group"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                getStatusStyles(report.status)
                                            )}>
                                                {report.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#E91E63] uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-100 group-hover:bg-[#E91E63] group-hover:text-white transition-colors">
                                                {getReportTypeLabel(report.report_type)}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                                                <Building2 className="h-6 w-6 text-gray-400 group-hover:text-[#E91E63] transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-xl font-black text-gray-900 uppercase italic leading-none group-hover:text-[#E91E63] transition-colors">
                                                    {report.pharmacy?.name || "Unknown Pharmacy"}
                                                </h3>
                                                <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {report.pharmacy?.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">Reporter</p>
                                                    <p className="font-bold text-gray-700 truncate text-xs">{report.user?.name || "Anonymous User"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">Timestamp</p>
                                                    <p className="font-bold text-gray-700 text-xs truncate">
                                                        {format(new Date(report.created_at), "MMM d, yyyy • h:mm a")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col gap-2 shrink-0">
                                        <Button
                                            onClick={() => setSelectedReport(report)}
                                            variant="outline"
                                            className="flex-1 lg:w-40 h-14 bg-white border-2 border-gray-100 text-gray-700 font-black italic rounded-2xl hover:bg-gray-50 hover:border-gray-200 hover:text-[#E91E63] transition-all hover:translate-x-1"
                                        >
                                            REVIEW
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateStatus(report.id, 'resolved')}
                                            disabled={report.status === 'resolved'}
                                            className={cn(
                                                "flex-1 lg:w-40 h-14 font-black italic rounded-2xl shadow-xl transition-all active:scale-95",
                                                report.status === 'resolved'
                                                    ? "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed"
                                                    : "bg-black text-white hover:bg-[#E91E63] shadow-black/10 hover:shadow-pink-200"
                                            )}
                                        >
                                            {report.status === 'resolved' ? 'RESOLVED' : 'RESOLVE'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ReportReviewModal
                report={selectedReport}
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                onStatusUpdate={handleUpdateStatus}
                onVerificationUpdate={handleVerificationComplete}
            />
        </div>
    )
}
