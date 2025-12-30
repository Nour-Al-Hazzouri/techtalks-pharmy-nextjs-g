"use client"

import * as React from "react"
import { X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitReport } from "@/lib/api/public"

interface ReportModalProps {
    pharmacyId: string | number
    pharmacyName: string
    isOpen: boolean
    onClose: () => void
}

const REPORT_TYPES = [
    { value: "wrong_availability", label: "Wrong Availability" },
    { value: "wrong_location", label: "Wrong Location" },
    { value: "wrong_contact", label: "Wrong Contact" },
    { value: "other", label: "Other" },
]

export function ReportModal({ pharmacyId, pharmacyName, isOpen, onClose }: ReportModalProps) {
    const [reportType, setReportType] = React.useState(REPORT_TYPES[0].value)
    const [reason, setReason] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (reason.trim().length < 10) {
            setError("Please provide at least 10 characters for the report.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await submitReport({
                pharmacy_id: pharmacyId,
                report_type: reportType,
                reason: reason.trim()
            })
            setSuccess(true)
            setTimeout(() => {
                onClose()
                setSuccess(false)
                setReason("")
                setReportType(REPORT_TYPES[0].value)
            }, 2000)
        } catch (err: any) {
            setError(err.message || "Failed to submit report. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">REPORT AN ISSUE</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">{pharmacyName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Report Submitted!</h4>
                                <p className="text-sm text-gray-500 mt-1">Thank you for helping us keep the platform accurate.</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">What is the problem?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {REPORT_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setReportType(type.value)}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200 text-left ${reportType === type.value
                                                    ? "border-[#E91E63] bg-pink-50 text-[#E91E63]"
                                                    : "border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-100"
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Details</label>
                                <textarea
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-200 focus:bg-white p-3 rounded-xl text-sm min-h-[100px] transition-all outline-none"
                                    placeholder="Tell us more about the issue..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || reason.trim().length < 10}
                                className="w-full h-12 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-100"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "SUBMIT REPORT"
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
