import { MapPin } from "lucide-react"
import { MedicineSearchBar } from "@/components/features/medicine/MedicineSearchBar"

export function MedicineSearchHome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
            <div className="w-full absolute top-0 left-0 p-4 flex items-center gap-2 bg-white border-b border-gray-100">
                <div className="bg-[#E91E63] p-1.5 rounded-lg">
                    <MapPin className="text-white h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-900">Pharmacy Finder</h2>
                    <p className="text-xs text-gray-500">Find medicine at nearby pharmacies</p>
                </div>
            </div>

            <MedicineSearchBar />
        </div>
    )
}
