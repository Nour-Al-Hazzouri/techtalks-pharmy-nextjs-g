import { MOCK_PHARMACIES } from "@/lib/mock-data"
import { PharmacyCard } from "./PharmacyCard"

export function PharmacyList() {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800 text-sm">Available at {MOCK_PHARMACIES.length} Pharmacies</h2>
                    <span className="text-xs text-gray-400">{MOCK_PHARMACIES.length} results</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Sorted by distance • Click to see details</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {MOCK_PHARMACIES.map((pharmacy) => (
                    <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                ))}
            </div>
        </div>
    )
}
