import { Pharmacy } from "@/lib/mock-data"
import { ArrowLeft, Phone, AlertCircle, CheckCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PharmacyDetailsProps {
    pharmacy: Pharmacy
    onBack: () => void
}

export function PharmacyDetails({ pharmacy, onBack }: PharmacyDetailsProps) {
    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
            {/* Header / Nav */}
            <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="flex-1 text-center font-semibold text-gray-700 text-sm">PHARMACY DETAILS</span>
                <div className="w-9" /> {/* Spacer for balance */}
            </div>

            <div className="p-4 space-y-4">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-gray-900 uppercase">{pharmacy.name}</h2>
                                    {pharmacy.verification_status === 'verified' && (
                                        <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            VERIFIED
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{pharmacy.address}</p>
                            </div>
                            <div className="bg-pink-50 h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-[#E91E63]">
                                {pharmacy.name.charAt(0)}
                            </div>
                        </div>

                        {pharmacy.license_number && (
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400">
                                <FileText className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-medium tracking-wider uppercase">LICENSE: {pharmacy.license_number}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CONTACT INFORMATION</h3>

                    <div className="flex items-center gap-3">
                        <div className="bg-pink-50 p-2 rounded-full">
                            <Phone className="h-4 w-4 text-[#E91E63]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Medicine Availability */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">MEDICINE AVAILABILITY</h3>
                    <div className="space-y-6">
                        {pharmacy.availability?.map((item, idx) => (
                            <div key={idx} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                            {item.category && (
                                                <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-medium">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                        {item.generic_name && (
                                            <p className="text-[11px] text-gray-500 mt-0.5 italic">({item.generic_name})</p>
                                        )}
                                    </div>
                                    <div className={`h-2.5 w-2.5 rounded-full mt-1 ${item.stock === 'In Stock' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>

                                {item.description && (
                                    <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 p-2 rounded-lg">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex gap-4 mt-3">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">STOCK STATUS</p>
                                        <p className={`text-[11px] font-semibold ${item.stock === 'Low Stock' ? 'text-red-500' : 'text-gray-600'}`}>{item.stock}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">QUANTITY</p>
                                        <p className="text-[11px] font-semibold text-gray-600">{item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!pharmacy.availability || pharmacy.availability.length === 0) && (
                            <p className="text-xs text-center text-gray-400 italic py-2">No availability data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 mt-auto">
                <Button className="w-full bg-[#E91E63] hover:bg-[#D81B60] h-12 rounded-xl text-white font-semibold">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Report Issue
                </Button>
            </div>
        </div>
    )
}
