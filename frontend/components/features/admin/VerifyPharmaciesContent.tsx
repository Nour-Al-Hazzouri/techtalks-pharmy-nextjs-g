"use client"

import * as React from "react"
import { Search, MapPin, Phone, X, CheckCircle, Eye, ChevronLeft, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Helper to map API data
import { getPharmacies } from "@/lib/api/public"

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
    verified: boolean
}

// Removed MOCK_PHARMACIES constant

interface ReviewModalProps {
    pharmacy: Pharmacy | null
    isOpen: boolean
    onClose: () => void
    onApprove: (id: string) => void
    onReject: (id: string) => void
}

function ReviewModal({ pharmacy, isOpen, onClose, onApprove, onReject }: ReviewModalProps) {
    if (!isOpen || !pharmacy) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-lg md:mx-4 max-h-[90vh] overflow-y-auto">
                {/* Handle bar for mobile */}
                <div className="md:hidden flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 rounded-full bg-gray-300" />
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">REVIEW DETAILS</h2>
                </div>

                {/* Pharmacy Information */}
                <div className="p-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        PHARMACY INFORMATION
                    </h3>
                    <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                        <div>
                            <p className="text-xs text-gray-500">Pharmacy Name</p>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.location}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">License Number</p>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.mophNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="px-6 pb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        DOCUMENTS ({pharmacy.documents.length})
                    </h3>
                    <div className="space-y-3">
                        {pharmacy.documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                                <div
                                    className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center",
                                        doc.verified ? "bg-green-100" : "bg-orange-100"
                                    )}
                                >
                                    <CheckCircle
                                        className={cn(
                                            "h-4 w-4",
                                            doc.verified ? "text-green-600" : "text-orange-500"
                                        )}
                                    />
                                </div>
                                <span className="flex-1 text-sm text-gray-900">{doc.name}</span>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={() => onReject(pharmacy.id)}
                        className="flex-1 py-3.5 rounded-xl border-2 border-[#E91E63] text-[#E91E63] font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <XCircle className="h-4 w-4" />
                        Reject
                    </button>
                    <button
                        onClick={() => onApprove(pharmacy.id)}
                        className="flex-1 py-3.5 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="h-4 w-4" />
                        Approve
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

    React.useEffect(() => {
        const fetchPending = async () => {
            try {
                // Fetch ONLY unverified pharmacies for verification queue
                const res = await getPharmacies({ verified: '0' })
                if (res.status && res.data) {
                    const mapped = res.data.data.map((p: any) => ({
                        id: String(p.id),
                        name: p.name,
                        location: p.address,
                        phone: p.phone,
                        mophNumber: p.license_number,
                        submittedDate: "Pending", // Mocked as API doesn't return created_at here yet
                        documents: [
                            { id: "d1", name: "License Document", verified: false }
                        ]
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

    const handleApprove = (id: string) => {
        // TODO: Call API to verify
        console.log("Approved", id)
        setPharmacies((prev) => prev.filter((p) => p.id !== id))
        setSelectedPharmacy(null)
    }

    const handleReject = (id: string) => {
        // TODO: Call API to reject
        console.log("Rejected", id)
        setPharmacies((prev) => prev.filter((p) => p.id !== id))
        setSelectedPharmacy(null)
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

            {/* Review Modal */}
            <ReviewModal
                pharmacy={selectedPharmacy}
                isOpen={!!selectedPharmacy}
                onClose={() => setSelectedPharmacy(null)}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    )
}
