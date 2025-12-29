"use client"

import * as React from "react"
import { Search, MapPin, Phone, X, CheckCircle, Eye, ChevronLeft, XCircle, Loader2, Shield, FileText, Building2, Calendar, ShieldCheck, ShieldAlert, ExternalLink, Mail, User, AlertCircle, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Helper to map API data
import { getPharmacies } from "@/lib/api/public"
import { approvePharmacy, rejectPharmacy } from "@/lib/api/admin"

interface Pharmacy {
    id: string
    name: string
    location: string
    phone: string
    mophNumber: string
    submittedDate: string
    documents: Document[]
}

interface Document {
    id: string
    name: string
    url: string
    verified: boolean
}

// Removed MOCK_PHARMACIES constant

interface DocumentViewerModalProps {
    document: Document | null
    onClose: () => void
}

function DocumentViewerModal({ document, onClose }: DocumentViewerModalProps) {
    const [scale, setScale] = React.useState(1)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })

    if (!document) return null

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 4))
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
    const handleReset = () => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => setIsDragging(false)

    const isImage = /\.(jpg|jpeg|png)$/i.test(document.url)

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40 text-white">
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                        <p className="text-sm font-bold">{document.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Document Viewer</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isImage && (
                        <div className="flex items-center bg-white/10 rounded-xl p-1 gap-1">
                            <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ZoomOut className="h-4 w-4" /></button>
                            <span className="text-[10px] font-bold w-12 text-center">{Math.round(scale * 100)}%</span>
                            <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ZoomIn className="h-4 w-4" /></button>
                            <div className="w-px h-4 bg-white/10 mx-1" />
                            <button onClick={handleReset} title="Reset View" className="p-2 hover:bg-white/10 rounded-lg transition-colors"><RotateCcw className="h-4 w-4" /></button>
                        </div>
                    )}
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500 rounded-xl transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Viewer Area */}
            <div
                className="flex-1 overflow-hidden relative flex items-center justify-center cursor-grab active:cursor-grabbing"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseDown={handleMouseDown}
            >
                {isImage ? (
                    <img
                        src={document.url}
                        alt={document.name}
                        className="max-h-full transition-transform duration-75 ease-out select-none shadow-2xl"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        }}
                        draggable={false}
                    />
                ) : (
                    <iframe
                        src={document.url}
                        className="w-full h-full border-none bg-white"
                        title={document.name}
                    />
                )}
            </div>

            <div className="p-4 bg-black/40 text-center text-white/40 text-[10px] font-medium uppercase tracking-[0.2em]">
                {isImage ? "Drag to pan • Use controls to zoom" : "Previewing PDF document"}
            </div>
        </div>
    )
}

interface VerificationModalProps {
    pharmacy: Pharmacy | null
    isOpen: boolean
    onClose: () => void
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onViewDocument: (doc: Document) => void
}

function VerificationModal({ pharmacy, isOpen, onClose, onApprove, onReject, onViewDocument }: VerificationModalProps) {
    if (!isOpen || !pharmacy) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Shield className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Verification Details</h3>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Pharmacy ID: #{pharmacy.id}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all shadow-sm">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Pharmacy Info Card */}
                    <section className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Building2 className="h-3 w-3" />
                            Entity Information
                        </h4>
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h5 className="text-xl font-black text-gray-900 uppercase italic leading-none">{pharmacy.name}</h5>
                                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                                            <MapPin className="h-4 w-4 text-[#E91E63]" />
                                            <p className="text-sm font-medium">{pharmacy.location}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="font-semibold text-gray-600">{pharmacy.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="font-semibold text-gray-600">License: {pharmacy.mophNumber}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Verification Documents */}
                    <section className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <FileText className="h-3 w-3" />
                            Submitted Documents ({pharmacy.documents.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            {pharmacy.documents.length > 0 ? (
                                pharmacy.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-pink-200 hover:bg-white transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#E91E63] transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Official accreditation file</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onViewDocument(doc)}
                                            className="h-9 w-9 rounded-xl flex items-center justify-center text-[#E91E63] bg-pink-50 hover:bg-pink-100 transition-all shadow-sm"
                                        >
                                            <Maximize2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">No documents uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse md:flex-row md:items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto text-gray-500 font-bold hover:bg-gray-100 h-12 px-6 rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                    <div className="hidden md:block flex-1" />
                    <button
                        onClick={() => onReject(pharmacy.id)}
                        className="w-full md:w-auto h-12 px-6 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-white hover:border-red-200 hover:text-red-600 transition-all"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => onApprove(pharmacy.id)}
                        className="w-full md:w-auto bg-black text-white hover:bg-[#E91E63] font-black italic h-12 px-8 rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                        APPROVE & VERIFY
                    </button>
                </div>
            </div>
        </div>
    )
}

interface RejectionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
}

function RejectionModal({ isOpen, onClose, onConfirm }: RejectionModalProps) {
    const [reason, setReason] = React.useState("")

    if (!isOpen) return null

    const handleSubmit = () => {
        if (reason.trim()) {
            onConfirm(reason)
            setReason("")
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Verification</h3>
                <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this pharmacy.</p>

                <textarea
                    className="w-full text-sm p-3 bg-white border border-gray-200 rounded-xl focus:border-red-200 focus:ring-2 focus:ring-red-50 outline-none transition-all min-h-[100px] text-gray-700 placeholder:text-gray-400 mb-4"
                    placeholder="Reason for rejection..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    autoFocus
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                        className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Reject
                    </button>
                </div>
            </div>
        </div>
    )
}

export function VerifyPharmaciesContent() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedPharmacy, setSelectedPharmacy] = React.useState<Pharmacy | null>(null)
    const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([])
    const [loading, setLoading] = React.useState(true)
    const [viewingDocument, setViewingDocument] = React.useState<Document | null>(null)
    const [rejectId, setRejectId] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchPending = async () => {
            try {
                // Fetch ONLY pharmacies with 'pending' status for verification queue
                const res = await getPharmacies({ status: 'pending' })
                if (res.status && res.data) {
                    const mapped = res.data.data.map((p: any) => ({
                        id: String(p.id),
                        name: p.name,
                        location: p.address,
                        phone: p.phone,
                        mophNumber: p.license_number,
                        submittedDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : "Recently",
                        documents: (p.documents || []).map((d: any) => ({
                            id: String(d.id),
                            name: d.doc_type,
                            url: d.file_url,
                            verified: false
                        }))
                    }))
                    setPharmacies(mapped)
                }
            } catch (error) {
                console.error("Failed to fetch pending pharmacies", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPending()
    }, [])

    const filteredPharmacies = pharmacies.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.mophNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleApprove = async (id: string) => {
        try {
            const res = await approvePharmacy(id)
            if (res.status) {
                setPharmacies((prev) => prev.filter((p) => p.id !== id))
                setSelectedPharmacy(null)
            }
        } catch (error) {
            console.error("Failed to approve pharmacy:", error)
        }
    }

    const initReject = (id: string) => {
        setRejectId(id)
    }

    const handleConfirmReject = async (reason: string) => {
        if (!rejectId) return

        try {
            const res = await rejectPharmacy(rejectId, reason)
            if (res.status) {
                setPharmacies((prev) => prev.filter((p) => p.id !== rejectId))
                setSelectedPharmacy(null)
            }
        } catch (error) {
            console.error("Failed to reject pharmacy:", error)
        } finally {
            setRejectId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#E91E63]" />
            </div>
        )
    }

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            {/* Header */}
            <h1 className="text-lg font-bold text-gray-900 tracking-wider mb-6">
                PHARMACY VERIFICATION
            </h1>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or license..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63]"
                />
            </div>

            {pharmacies.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                    <p>No pending pharmacy verifications.</p>
                </div>
            ) : (
                /* Pharmacy List - Single column on mobile, 2 columns on desktop */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPharmacies.map((pharmacy) => (
                        <button
                            key={pharmacy.id}
                            onClick={() => setSelectedPharmacy(pharmacy)}
                            className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 text-left hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                        {pharmacy.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span>{pharmacy.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <Phone className="h-3 w-3 shrink-0" />
                                        <span>{pharmacy.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase">License Number</p>
                                            <p className="text-xs text-gray-600">{pharmacy.mophNumber}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 uppercase">Submitted</p>
                                            <p className="text-xs text-gray-600">{pharmacy.submittedDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded bg-orange-100" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Verification Modal */}
            <VerificationModal
                pharmacy={selectedPharmacy}
                isOpen={!!selectedPharmacy}
                onClose={() => setSelectedPharmacy(null)}
                onApprove={handleApprove}
                onReject={initReject}
                onViewDocument={(doc) => setViewingDocument(doc)}
            />

            <DocumentViewerModal
                document={viewingDocument}
                onClose={() => setViewingDocument(null)}
            />

            <RejectionModal
                isOpen={!!rejectId}
                onClose={() => setRejectId(null)}
                onConfirm={handleConfirmReject}
            />
        </div>
    )
}
