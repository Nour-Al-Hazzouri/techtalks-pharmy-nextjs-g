"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { MapHeader } from "@/components/features/map/MapHeader"
import { PharmacyList } from "@/components/features/map/PharmacyList"
import { PharmacyDetails } from "@/components/features/map/PharmacyDetails"
import { Pharmacy } from "@/lib/mock-data"
import { ChevronRight, ChevronLeft } from "lucide-react"

const PharmacyMap = dynamic(
    () => import("@/components/features/map/PharmacyMap"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
    }
)

export function MapPageContainer() {
    const [selectedPharmacy, setSelectedPharmacy] = React.useState<Pharmacy | null>(null)
    const [isPanelOpen, setIsPanelOpen] = React.useState(true)

    const handlePharmacySelect = (pharmacy: Pharmacy) => {
        setSelectedPharmacy(pharmacy)
        setIsPanelOpen(true)
    }

    const handleBackToList = () => {
        setSelectedPharmacy(null)
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <MapHeader />

            <main className="flex-1 flex overflow-hidden relative">
                {/* Map Section */}
                <div className="flex-1 relative border-r border-gray-200">
                    <PharmacyMap onSelect={handlePharmacySelect} />

                    {/* Toggle Panel Button (Visible on Map) */}
                    <button
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
                        title={isPanelOpen ? "Close Panel" : "Open Panel"}
                    >
                        {isPanelOpen ? <ChevronRight className="h-5 w-5 text-gray-600" /> : <ChevronLeft className="h-5 w-5 text-gray-600" />}
                    </button>
                </div>

                {/* Helper Panel - List or Details */}
                <aside
                    className={`
                w-[400px] h-full overflow-hidden shadow-xl z-10 bg-white transition-all duration-300 ease-in-out absolute md:static right-0 top-0 bottom-0
                ${isPanelOpen ? 'translate-x-0' : 'translate-x-full md:w-0 md:translate-x-0 md:opacity-0 md:overflow-hidden'}
            `}
                    style={!isPanelOpen ? { width: 0, opacity: 0 } : {}}
                >
                    {selectedPharmacy ? (
                        <PharmacyDetails
                            pharmacy={selectedPharmacy}
                            onBack={handleBackToList}
                        />
                    ) : (
                        <PharmacyList onSelect={handlePharmacySelect} />
                    )}
                </aside>
            </main>
        </div>
    )
}
