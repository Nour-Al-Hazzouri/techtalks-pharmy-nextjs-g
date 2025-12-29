"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { MapHeader } from "@/components/features/map/MapHeader"
import { ExpandableSearchBar } from "@/components/features/map/ExpandableSearchBar"
import { PharmacyList } from "@/components/features/map/PharmacyList"
import { PharmacyDetails } from "@/components/features/map/PharmacyDetails"
import { Pharmacy } from "@/lib/mock-data" // Keeping type import for now
import { ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSearchParams } from "next/navigation"
import type { DashboardView } from "@/components/features/map/MapHeader"
import { UserProfilePanel } from "./UserProfilePanel"
import { ChangePasswordPanel } from "./ChangePasswordPanel"
import { SettingsPanel } from "./SettingsPanel"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"
import { findNearestPharmaciesWithMedicine, getPharmacies, searchMedicines, PublicPharmacy } from "@/lib/api/public"
import { SelectedLocation } from "@/components/features/map/LocationSearchBar"
import { CustomDialog, AlertConfig } from "@/components/ui/custom-dialog"

const PharmacyMap = dynamic(
    () => import("@/components/features/map/PharmacyMap"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
    }
)

function mapApiToPharmacy(p: PublicPharmacy, medicine?: { name: string, generic_name: string, category: string, description: string }): Pharmacy {
    return {
        id: String(p.id),
        name: p.name,
        address: p.address,
        rating: p.rating ? parseFloat(p.rating) : 4.5,
        phone: p.phone,
        license_number: p.license_number,
        verification_status: p.verification_status,
        total_reports: p.total_reports,
        coordinates: [parseFloat(p.latitude), parseFloat(p.longitude)],
        distance: p.distance ? parseFloat(p.distance) : undefined,
        availability: (medicine && p.pivot) ? [
            {
                name: medicine.name,
                generic_name: medicine.generic_name,
                category: medicine.category,
                description: medicine.description,
                stock: p.pivot.available && p.pivot.quantity > 0 ? "In Stock" : "Out of Stock",
                quantity: p.pivot.quantity > 5 ? "Available" : `${p.pivot.quantity} Left`,
                price: p.pivot.price
            }
        ] : []
    }
}

export function MapPageContainer() {
    const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedPharmacy, setSelectedPharmacy] = React.useState<Pharmacy | null>(null)
    const [isPanelOpen, setIsPanelOpen] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [location, setLocation] = React.useState<SelectedLocation | null>(null)
    const [mapCenter, setMapCenter] = React.useState<[number, number] | undefined>(undefined)
    const [activeView, setActiveView] = React.useState<DashboardView>("map")
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [snap, setSnap] = React.useState<number | string | null>(0.5)
    const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null)
    const [alertConfig, setAlertConfig] = React.useState<AlertConfig>({ isOpen: false, title: "", description: "" })
    const searchParams = useSearchParams()

    // Fetch initial pharmacies (all)
    React.useEffect(() => {
        const q = searchParams.get('q')
        if (q) {
            setSearchQuery(q)
            handleSearch(q)
        } else {
            fetchAllPharmacies()
        }

        // Initial mobile state
        if (window.innerWidth < 768) {
            setIsPanelOpen(false)
        }
    }, []) // Empty deps to run once on mount

    const fetchAllPharmacies = async () => {
        try {
            setLoading(true)
            // Fetch all pharmacies (verified and unverified) so new registrations appear locally
            const res = await getPharmacies()
            const mapped = res.data.data.map(p => mapApiToPharmacy(p))
            setPharmacies(mapped)
        } catch (error) {
            console.error("Failed to fetch pharmacies", error)
        } finally {
            setLoading(false)
        }
    }

    const handlePharmacySelect = (pharmacy: Pharmacy) => {
        setSelectedPharmacy(pharmacy)
        setIsPanelOpen(true)
        if (!isDesktop) setSnap(1)

        // Zoom to pharmacy location
        setMapCenter(pharmacy.coordinates)
    }


    const handleBackToList = () => {
        setSelectedPharmacy(null)
        if (!isDesktop) setSnap(0.5)
    }

    const handleLocateMe = () => {
        // User requested manual location only
        // Do not auto-center the map (let user choose freely)
        setAlertConfig({
            isOpen: true,
            title: "Set Your Location",
            description: "Please click precisely on the map to pin your exact location.",
        })
    }

    const handleMapClick = (coords: [number, number]) => {
        const [lat, lng] = coords
        const newLoc: SelectedLocation = {
            label: "Pinned Location",
            lat,
            lng
        }
        setLocation(newLoc)
        setUserLocation(coords)

        if (searchQuery) {
            handleSearch(searchQuery, newLoc)
        }
    }

    const handleSearch = async (term: string, locationOverride?: SelectedLocation | null) => {
        setSearchQuery(term)
        setSelectedPharmacy(null)

        const effectiveLocation = locationOverride !== undefined ? locationOverride : location

        if (!term.trim()) {
            // If cleared, fetch all again
            fetchAllPharmacies()
            return
        }

        setIsPanelOpen(true)
        if (!isDesktop) setSnap(0.5)

        try {
            setLoading(true)
            const res = await searchMedicines(term)

            let mappedPharmacies: Pharmacy[] = []

            if (effectiveLocation && res.data.length > 0) {
                const primaryMedicine = res.data.find(m => m.name.toLowerCase() === term.toLowerCase()) ?? res.data[0]
                const nearest = await findNearestPharmaciesWithMedicine({ name: primaryMedicine.name, lat: effectiveLocation.lat, lng: effectiveLocation.lng })
                mappedPharmacies = (nearest.data ?? []).map(p => mapApiToPharmacy(p, primaryMedicine))
            } else {
                // The search returns medicines, each with pharmacies.
                const uniquePharmacies = new Map<string, Pharmacy>()

                res.data.forEach(medicine => {
                    medicine.pharmacies.forEach(p => {
                        if (!uniquePharmacies.has(String(p.id))) {
                            uniquePharmacies.set(String(p.id), mapApiToPharmacy(p, medicine))
                        } else {
                            const existing = uniquePharmacies.get(String(p.id))!
                            if (existing.availability) {
                                if (!existing.availability.some(m => m.name === medicine.name)) {
                                    existing.availability.push({
                                        name: medicine.name,
                                        generic_name: medicine.generic_name,
                                        category: medicine.category,
                                        description: medicine.description,
                                        stock: "In Stock",
                                        quantity: "Available",
                                        price: p.pivot?.price
                                    })
                                }
                            }
                        }
                    })
                })
                mappedPharmacies = Array.from(uniquePharmacies.values())
            }

            // Calculate cheapest pharmacy
            if (mappedPharmacies.length > 0) {
                let cheapestPrice = Infinity
                let cheapestId = ""

                mappedPharmacies.forEach(p => {
                    // Check availability for the searched term
                    const stock = p.availability?.find(
                        item => item.name.toLowerCase().includes(term.toLowerCase()) ||
                            (item.generic_name && item.generic_name.toLowerCase().includes(term.toLowerCase()))
                    )

                    if (stock && stock.price !== undefined && stock.price < cheapestPrice) {
                        cheapestPrice = stock.price
                        cheapestId = p.id
                    }
                })

                mappedPharmacies = mappedPharmacies.map(p => ({
                    ...p,
                    isCheapest: p.id === cheapestId
                }))
            }

            setPharmacies(mappedPharmacies)

        } catch (error) {
            console.error("Search failed", error)
            setPharmacies([])
        } finally {
            setLoading(false)
        }
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        fetchAllPharmacies()
        if (!isDesktop) setIsPanelOpen(false)
    }

    const handleViewChange = (view: DashboardView) => {
        setActiveView(view)
        setSelectedPharmacy(null)

        if (view !== "map") {
            setIsPanelOpen(true)
            if (!isDesktop) setSnap(1)
        }
    }

    const handleBackToMap = () => {
        setActiveView("map")
        if (!isDesktop) setSnap(0.5)
    }

    const renderPanelContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-[#E91E63] mb-2" />
                    <p className="text-gray-500 text-sm">Finding pharmacies...</p>
                </div>
            )
        }

        if (selectedPharmacy) {
            return (
                <PharmacyDetails
                    pharmacy={selectedPharmacy}
                    onBack={handleBackToList}
                />
            )
        }

        if (pharmacies.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
                    <div className="bg-pink-50 p-4 rounded-full mb-4">
                        <Search className="h-8 w-8 text-[#E91E63]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No Pharmacies Found</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        {searchQuery
                            ? `We couldn't find any pharmacies with "${searchQuery}"`
                            : "No registered pharmacies found in your area."}
                    </p>
                </div>
            )
        }

        return <PharmacyList pharmacies={pharmacies} onSelect={handlePharmacySelect} />
    }

    // Determine center passed to map
    // If we have a selected location via search bar (SelectedLocation), use that
    // But if we just clicked a pharmacy (mapCenter), override it?
    // Actually, `location` (search bar selected) is a preferred starting point, 
    // but `mapCenter` is an explicit action (clicking a pharmacy).
    // Let's use `mapCenter` if available, otherwise `location`.

    const finalCenter: [number, number] | undefined = mapCenter ?? (location ? [location.lat, location.lng] : undefined)

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <MapHeader
                searchQuery={searchQuery}
                onClear={handleClearSearch}
                location={location}
                onLocationSelect={(loc) => {
                    setLocation(loc)
                    // Reset map center so we jump to new search location
                    setMapCenter(undefined)
                    // Clear precise user location (blue pin) when searching for a general area (city)
                    setUserLocation(null)
                    if (searchQuery) handleSearch(searchQuery, loc)
                }}
                onLocationClear={() => {
                    setLocation(null)
                    setMapCenter(undefined)
                    setUserLocation(null)
                    if (searchQuery) handleSearch(searchQuery, null)
                }}
                activeView={activeView}
                onViewChange={handleViewChange}
                onLocate={handleLocateMe}
            />

            <main className="flex-1 flex overflow-hidden relative">
                {/* Map Section */}
                <div className="flex-1 relative border-r border-gray-200">
                    <PharmacyMap
                        pharmacies={pharmacies}
                        onSelect={handlePharmacySelect}
                        center={finalCenter}
                        userLocation={userLocation}
                        onMapClick={handleMapClick}
                    />

                    {/* Toggle Panel Button (Visible on Map, Desktop Only) */}
                    {activeView === "map" && (
                        <button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            className="hidden md:block absolute top-4 right-4 z-[400] bg-white p-2 rounded-full shadow-md hover:bg-gray-50 border border-gray-200"
                            title={isPanelOpen ? "Close Panel" : "Open Panel"}
                        >
                            {isPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    )}
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
                        {activeView === "map" && (
                            <div className="shrink-0 px-2.5 py-3 border-b border-gray-100">
                                <ExpandableSearchBar
                                    onSearch={(term) => handleSearch(term)}
                                    currentQuery={searchQuery}
                                    onClear={handleClearSearch}
                                />
                            </div>
                        )}
                        {activeView === "profile" ? (
                            <UserProfilePanel onBackToMap={handleBackToMap} />
                        ) : activeView === "settings" ? (
                            <SettingsPanel onViewChange={handleViewChange} onBackToMap={handleBackToMap} />
                        ) : activeView === "password" ? (
                            <ChangePasswordPanel onBackToMap={handleBackToMap} />
                        ) : (
                            renderPanelContent()
                        )}
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
                                <DrawerHeader className="sr-only">
                                    <DrawerTitle>Pharmacy Details</DrawerTitle>
                                    <DrawerDescription>List of available pharmacies</DrawerDescription>
                                </DrawerHeader>
                                {activeView === "map" && (
                                    <ExpandableSearchBar
                                        onSearch={(term) => handleSearch(term)}
                                        currentQuery={searchQuery}
                                        onClear={handleClearSearch}
                                    />
                                )}
                                {activeView === "profile" ? (
                                    <UserProfilePanel onBackToMap={handleBackToMap} />
                                ) : activeView === "settings" ? (
                                    <SettingsPanel onViewChange={handleViewChange} onBackToMap={handleBackToMap} />
                                ) : activeView === "password" ? (
                                    <ChangePasswordPanel onBackToMap={handleBackToMap} />
                                ) : (
                                    renderPanelContent()
                                )}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}
            </main>
            <CustomDialog
                {...alertConfig}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    )
}
