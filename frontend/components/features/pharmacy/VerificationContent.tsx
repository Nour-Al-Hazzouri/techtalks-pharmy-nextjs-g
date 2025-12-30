"use client"

import * as React from "react"
import {
    Shield,
    Upload,
    CheckCircle2,
    AlertCircle,
    FileText,
    Loader2,
    X,
    ExternalLink,
    Clock,
    ShieldCheck,
    AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CustomDialog, type AlertConfig } from "@/components/ui/custom-dialog"
import {
    getPharmacyProfile,
    uploadPharmacyDocument,
    submitForVerification,
    cancelVerificationSubmission,
    getMyDocuments,
    deletePharmacyDocument,
    PharmacyProfile
} from "@/lib/api/pharmacy"

export function VerificationContent() {
    const [profile, setProfile] = React.useState<PharmacyProfile | null>(null)
    const [documents, setDocuments] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [uploading, setUploading] = React.useState<string | null>(null)
    const [submitting, setSubmitting] = React.useState(false)

    const [confirmConfig, setConfirmConfig] = React.useState<AlertConfig>({
        isOpen: false,
        title: "",
    })

    const [error, setError] = React.useState<string | null>(null)

    const fetchData = async () => {
        try {
            const [profileRes, docsRes] = await Promise.all([
                getPharmacyProfile(),
                getMyDocuments()
            ])
            if (profileRes.status) setProfile(profileRes.data)
            if (docsRes.status) setDocuments(docsRes.data)
        } catch (error: any) {
            console.error("Failed to fetch verification data:", error)
            setError(error.message || "Failed to load verification data")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteDocument = async (id: number | string) => {
        try {
            await deletePharmacyDocument(id)
            await fetchData()
        } catch (error: any) {
            console.error("Delete failed:", error)
            setError(error.message || "Failed to delete document")
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic frontend validation
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        if (!allowedTypes.includes(file.type)) {
            setError("Unsupported file format. Please upload a PDF, Image (JPG, PNG), or Word document.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size too large. Maximum allowed size is 5MB.")
            return
        }

        setUploading(type)
        setError(null)
        try {
            await uploadPharmacyDocument(type, file)
            await fetchData()
        } catch (error: any) {
            console.error("Upload failed:", error)
            setError(error.message || "Upload failed. Please try again.")
        } finally {
            setUploading(null)
            // Clear input
            if (e.target) e.target.value = ""
        }
    }

    const confirmCancel = async () => {
        setSubmitting(true)
        setError(null)
        try {
            await cancelVerificationSubmission()
            await fetchData()
        } catch (error: any) {
            console.error("Cancellation failed:", error)
            setError(error.message || "Failed to cancel verification request.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = () => {
        setConfirmConfig({
            isOpen: true,
            title: "Discard verification request?",
            description: "Are you sure you want to discard your verification request? This will return your status to incomplete.",
            variant: "destructive",
            confirmLabel: "Discard",
            onConfirm: confirmCancel,
        })
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setError(null)
        try {
            await submitForVerification()
            await fetchData()
        } catch (error: any) {
            console.error("Submission failed:", error)
            setError(error.message || "Failed to submit verification request.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#E91E63]" />
            </div>
        )
    }

    const getStatusDetails = (status: string) => {
        switch (status) {
            case 'verified':
                return {
                    icon: Shield,
                    color: "text-green-600",
                    bg: "bg-green-50",
                    border: "border-green-100",
                    label: "Verified & Active",
                    desc: "Your pharmacy is fully verified. You have full access to all platform features."
                }
            case 'pending':
                return {
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                    label: "Review in Progress",
                    desc: "Our team is currently reviewing your documents. This usually takes 24-48 hours."
                }
            case 'rejected':
                return {
                    icon: AlertTriangle,
                    color: "text-red-600",
                    bg: "bg-red-50",
                    border: "border-red-100",
                    label: "Verification Revoked",
                    desc: "Administrative action has been taken on your account. Please review the details below."
                }
            default:
                return {
                    icon: FileText,
                    color: "text-gray-600",
                    bg: "bg-gray-100",
                    border: "border-gray-200",
                    label: "Incomplete Profile",
                    desc: "Please upload the required documents to request pharmacy verification."
                }
        }
    }

    const statusObj = getStatusDetails(profile?.verification_status || 'incomplete')
    const StatusIcon = statusObj.icon

    const hasDocs = documents.length > 0

    return (
        <div className="flex-1 bg-gray-50 px-4 py-8 md:p-8 pt-20 pb-24 md:pt-8 md:pb-8 overflow-auto">
            <CustomDialog
                {...confirmConfig}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />
            <div className="max-w-4xl mx-auto space-y-8 relative">
                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-red-100">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-900 leading-tight">Operation Failed</p>
                            <p className="text-xs text-red-600 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="p-1.5 hover:bg-white rounded-lg transition-all text-red-300 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trust & Verification</h1>
                    <p className="text-gray-500 mt-2">Professional accreditation and document management.</p>
                </div>

                {/* Current Status Card */}
                <div className={cn(
                    "p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center gap-6 shadow-sm bg-white transition-all",
                    statusObj.border
                )}>
                    <div className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                        statusObj.bg,
                        statusObj.color
                    )}>
                        <StatusIcon className="h-8 w-8" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            <span className={cn("text-xs font-bold uppercase tracking-widest", statusObj.color)}>
                                Current Status
                            </span>
                            <span className={cn(
                                "hidden md:inline-block w-1 h-1 rounded-full",
                                statusObj.bg.replace('bg-', 'bg-').replace('50', '200')
                            )} />
                            <h2 className="text-lg font-bold text-gray-900">{statusObj.label}</h2>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{statusObj.desc}</p>
                    </div>
                    {hasDocs && (
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || profile?.verification_status === 'verified' || profile?.verification_status === 'pending'}
                            className={cn(
                                "w-full md:w-auto font-bold h-12 px-8 rounded-2xl shadow-lg transition-all",
                                profile?.verification_status === 'verified'
                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-green-100"
                                    : profile?.verification_status === 'pending'
                                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100"
                                        : "bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-pink-100"
                            )}
                        >
                            {submitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : profile?.verification_status === 'verified' ? (
                                <>
                                    <ShieldCheck className="mr-2 h-5 w-5" />
                                    Verified & Active
                                </>
                            ) : profile?.verification_status === 'pending' ? (
                                <>
                                    <Clock className="mr-2 h-5 w-5" />
                                    Review in Progress
                                </>
                            ) : (
                                "Submit Official Request"
                            )}
                        </Button>
                    )}
                    {profile?.verification_status === 'pending' && (
                        <Button
                            onClick={handleCancel}
                            disabled={submitting}
                            variant="outline"
                            className="w-full md:w-auto font-bold h-12 px-8 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Discard Official Request"}
                        </Button>
                    )}
                </div>

                {/* Rejection Details Warning */}
                {profile?.verification_status === 'rejected' && (
                    <div className="bg-[#FFF8F8] border-2 border-red-100 rounded-3xl p-6 md:p-8 animate-in slide-in-from-top-4 duration-500 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <Shield className="h-32 w-32 text-red-600 -rotate-12" />
                        </div>
                        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                            <div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-black text-red-900 uppercase italic leading-none">Administrative Notice</h3>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Reason for Revocation</p>
                                    <div className="bg-white/50 border border-red-50 p-4 rounded-2xl">
                                        <p className="text-red-700 font-medium italic leading-relaxed">
                                            "{profile.rejection_reason || "No specific reason was provided by the administration."}"
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-red-400 font-medium max-w-lg">
                                    Please ensure all your documents are valid and up to date. You can re-submit for verification once the issues are resolved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Medical License', 'MOPH Permit'].map((type) => {
                        const isUploaded = documents.some(d => d.doc_type === type)
                        const isUploading = uploading === type

                        return (
                            <div key={type} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
                                <div className={cn(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center",
                                    isUploaded ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                                )}>
                                    {isUploaded ? <CheckCircle2 className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{type}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Official certificate as issued by the ministry.</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1">PDF, JPG, PNG, DOCX (Max 5MB)</p>
                                </div>
                                <div className="w-full pt-2">
                                    <label className={cn(
                                        "flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-dashed transition-all",
                                        profile?.verification_status === 'pending' || profile?.verification_status === 'verified'
                                            ? "border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed"
                                            : isUploaded
                                                ? "border-green-100 bg-green-50/30 text-green-700 hover:bg-green-50 cursor-pointer"
                                                : "border-gray-200 hover:border-[#E91E63] hover:bg-pink-50 text-gray-600 cursor-pointer"
                                    )}>
                                        {isUploading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : isUploaded ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4" />
                                                {profile?.verification_status === 'pending' ? "File Locked" : "Update File"}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Upload PDF/JPG
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png,.docx"
                                            onChange={(e) => handleFileUpload(e, type)}
                                            disabled={!!uploading || profile?.verification_status === 'pending' || profile?.verification_status === 'verified'}
                                        />
                                    </label>
                                    {isUploaded && profile?.verification_status !== 'pending' && profile?.verification_status !== 'verified' && (
                                        <button
                                            onClick={() => {
                                                const doc = documents.find(d => d.doc_type === type);
                                                if (doc) handleDeleteDocument(doc.id);
                                            }}
                                            className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1 mx-auto"
                                        >
                                            <X className="h-3 w-3" />
                                            Discard File
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Documents List */}
                {hasDocs && (
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Uploaded Evidence</h3>
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {documents.length} Files
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-[#E91E63] transition-all">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{doc.doc_type}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    profile?.verification_status === 'pending' ? "bg-amber-400" : "bg-blue-400"
                                                )} />
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                                    {profile?.verification_status === 'pending' ? "Pending Review" : "Ready to Submit"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {profile?.verification_status !== 'pending' && profile?.verification_status !== 'verified' && (
                                        <button
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="h-9 w-9 rounded-xl hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
