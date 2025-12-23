"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { MapHeader } from "@/components/features/map/MapHeader"
import { PharmacyList } from "@/components/features/map/PharmacyList"
import { PharmacyDetails } from "@/components/features/map/PharmacyDetails"
import { MOCK_PHARMACIES, Pharmacy } from "@/lib/mock-data"
import { ChevronRight, ChevronLeft, Search } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSearchParams } from "next/navigation"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"

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
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [snap, setSnap] = React.useState<number | string | null>(0.5)
    const searchParams = useSearchParams()

    React.useEffect(() => {
        // Initial mobile state: Closed to show full map
        if (window.innerWidth < 768) {
            setIsPanelOpen(false)
        }

        // Handle URL search params
        const q = searchParams.get('q')
        if (q) {
            setSearchQuery(q)
            setIsPanelOpen(true)
            // On mobile, if we have a search, open to half.
            if (window.innerWidth < 768) {
                setSnap(0.5)
            }
        }
    }, [searchParams])


    // Filter pharmacies based on search query (checking availability)
    const filteredPharmacies = React.useMemo(() => {
        if (!searchQuery) return [] // No results initially
        return MOCK_PHARMACIES.filter(pharmacy =>
            pharmacy.availability?.some(medicine =>
                medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery])

    const handlePharmacySelect = (pharmacy: Pharmacy) => {
        setSelectedPharmacy(pharmacy)
        setIsPanelOpen(true)
        if (!isDesktop) setSnap(1) // Expand to full screen on mobile when selecting details
    }

    const handleBackToList = () => {
        setSelectedPharmacy(null)
        if (!isDesktop) setSnap(0.5) // Go back to half screen on mobile
    }

    const handleSearch = (term: string) => {
        setSearchQuery(term)
        setSelectedPharmacy(null) // Reset selection when searching
        setIsPanelOpen(true) // Auto-open panel on search
        if (!isDesktop) setSnap(0.5) // Ensure it opens to half screen
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        if (!isDesktop) setIsPanelOpen(false) // Close drawer on mobile when cleared? Or keep open with welcome?
        // User requested "no markers... clicking clear search... same effect".
        // If clear -> empty state. On mobile, maybe close it to see map?
        // Let's close it for cleaner experience, or show "Welcome" in drawer.
        // Prompt: "When the user enter the map page, I want the full screen to be a map".
        // So initially closed. If cleared, close it.
        if (!isDesktop) setIsPanelOpen(false)
    }

    const renderPanelContent = () => {
        if (selectedPharmacy) {
            return (
                <PharmacyDetails
                    pharmacy={selectedPharmacy}
                    onBack={handleBackToList}
                />
            )
        }
        if (!searchQuery) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
                    <div className="bg-pink-50 p-4 rounded-full mb-4">
                        <Search className="h-8 w-8 text-[#E91E63]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Find Your Medicine</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        Search for a medicine above to see which pharmacies have it in stock.
                    </p>
                </div>
            )
        }
        return <PharmacyList pharmacies={filteredPharmacies} onSelect={handlePharmacySelect} />
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

                    {/* Toggle Panel Button (Visible on Map, Desktop Only) */}
                    <button
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="hidden md:block absolute top-4 right-4 z-[400] bg-white p-2 rounded-full shadow-md hover:bg-gray-50 border border-gray-200"
                        title={isPanelOpen ? "Close Panel" : "Open Panel"}
                    >
                        {isPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Desktop Sidebar */}
                {isDesktop && (
                    <aside
                        className={`
                        bg-white flex flex-col transition-[width,transform,opacity] duration-300 ease-in-out absolute md:relative z-[500] h-full shadow-xl md:shadow-none right-0
                        ${isPanelOpen
                                ? 'w-full md:w-[400px] translate-x-0 opacity-100'
                                : 'w-full md:w-0 translate-x-full md:translate-x-0 md:opacity-0 overflow-hidden'
                            }
                    `}
                    >
                        {renderPanelContent()}
                    </aside>
                )}

                {/* Mobile Drawer */}
                {!isDesktop && (
                    <Drawer
                        open={isPanelOpen}
                        onOpenChange={setIsPanelOpen}
                        snapPoints={[0.5, 1]}
                        activeSnapPoint={snap}
                        setActiveSnapPoint={setSnap}
                        modal={false}
                    >
                        <DrawerContent className="h-full max-h-[96%] flex flex-col">
                            <div className="flex-1 overflow-hidden flex flex-col">
                                {/* Custom Title for Accessibility if needed, or hidden */}
                                <DrawerHeader className="sr-only">
                                    <DrawerTitle>Pharmacy Details</DrawerTitle>
                                    <DrawerDescription>List of available pharmacies</DrawerDescription>
                                </DrawerHeader>
                                {renderPanelContent()}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}
            </main>
        </div>
    )
}
