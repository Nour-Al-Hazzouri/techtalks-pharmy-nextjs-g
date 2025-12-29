import { Pharmacy } from "@/lib/mock-data"
import { MapPin, Phone, Star } from "lucide-react"

interface PharmacyCardProps {
    pharmacy: Pharmacy
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">{pharmacy.rating}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{pharmacy.phone}</span>
                </div>
            </div>
        </div>
    )
}
