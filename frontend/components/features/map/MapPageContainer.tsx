"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { MapHeader } from "@/components/features/map/MapHeader"
import { PharmacyList } from "@/components/features/map/PharmacyList"
import { PharmacyDetails } from "@/components/features/map/PharmacyDetails"
import { MOCK_PHARMACIES, Pharmacy } from "@/lib/mock-data"
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
    const [searchQuery, setSearchQuery] = React.useState("")

    // Filter pharmacies based on search query (checking availability)
    const filteredPharmacies = React.useMemo(() => {
        if (!searchQuery) return MOCK_PHARMACIES
        return MOCK_PHARMACIES.filter(pharmacy =>
            pharmacy.availability?.some(medicine =>
                medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery])

    const handlePharmacySelect = (pharmacy: Pharmacy) => {
        setSelectedPharmacy(pharmacy)
        setIsPanelOpen(true)
    }

    const handleBackToList = () => {
        setSelectedPharmacy(null)
    }

    const handleSearch = (term: string) => {
        setSearchQuery(term)
        setSelectedPharmacy(null) // Reset selection when searching
    }

    const handleClearSearch = () => {
        setSearchQuery("")
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <MapHeader
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onClear={handleClearSearch}
            />

            <main className="flex-1 flex overflow-hidden relative">
                {/* Map Section */}
                <div className="flex-1 relative border-r border-gray-200">
                    <PharmacyMap pharmacies={filteredPharmacies} onSelect={handlePharmacySelect} />

                    {/* Toggle Panel Button (Visible on Map) */}
                    <button
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-full shadow-md hover:bg-gray-50 border border-gray-200"
                        title={isPanelOpen ? "Close Panel" : "Open Panel"}
                    >
                        {isPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Helper Panel - List or Details */}
                <aside
                    className={`
                        w-full md:w-[400px] bg-white flex flex-col transition-all duration-300 ease-in-out absolute md:relative z-[500] h-full shadow-xl md:shadow-none
                        ${isPanelOpen ? 'translate-x-0' : 'translate-x-full md:grid-cols-[1fr_0] md:w-0 md:opacity-0 md:overflow-hidden'}
                    `}
                >
                    {selectedPharmacy ? (
                        <PharmacyDetails
                            pharmacy={selectedPharmacy}
                            onBack={handleBackToList}
                        />
                    ) : (
                        <PharmacyList pharmacies={filteredPharmacies} onSelect={handlePharmacySelect} />
                    )}
                </aside>
            </main>
        </div>
    )
}
