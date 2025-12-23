import { Pharmacy } from "@/lib/mock-data"
import { MapPin, Phone, Star } from "lucide-react"

interface PharmacyCardProps {
    pharmacy: Pharmacy
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
    let statusColor = "bg-green-100 text-green-700"
    if (pharmacy.status === "Closing soon") statusColor = "bg-orange-100 text-orange-700"
    if (pharmacy.status === "Closed") statusColor = "bg-red-100 text-red-700"

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusColor}`}>
                    {pharmacy.status} {pharmacy.closingTime ? `until ${pharmacy.closingTime}` : ""}
                </span>
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
                    <span>{pharmacy.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{pharmacy.phone}</span>
                </div>
            </div>
        </div>
    )
}
