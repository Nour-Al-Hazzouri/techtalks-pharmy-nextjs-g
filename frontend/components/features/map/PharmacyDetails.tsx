import { Pharmacy } from "@/lib/mock-data"
import { ArrowLeft, Clock, Mail, Phone, AlertCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
                    <div className="h-32 bg-gray-200 relative">
                        {/* Placeholder for cover image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                            Cover Image
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 uppercase">{pharmacy.name}</h2>
                                <p className="text-xs text-gray-500 mt-1">{pharmacy.address}</p>
                            </div>
                            <div className="bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                {pharmacy.name.charAt(0)}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-gray-300" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">WORKING HOURS</p>
                                    <p className="text-xs font-medium text-gray-700 mt-0.5">{pharmacy.workingHours || "09:00 - 22:00"}</p>
                                </div>
                            </div>
                        </div>
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

                    <div className="flex items-center gap-3">
                        <div className="bg-pink-50 p-2 rounded-full">
                            <Mail className="h-4 w-4 text-[#E91E63]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400">Email</p>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.email || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Medicine Availability */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">MEDICINE AVAILABILITY</h3>
                    <div className="space-y-4">
                        {pharmacy.availability?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-[10px] ${item.stock === 'Low Stock' ? 'text-red-500' : 'text-gray-500'}`}>{item.stock}</span>
                                        <span className="text-[10px] text-gray-300">QUANTITY: {item.quantity}</span>
                                    </div>
                                </div>
                                <div className={`h-2.5 w-2.5 rounded-full ${item.stock === 'In Stock' ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
