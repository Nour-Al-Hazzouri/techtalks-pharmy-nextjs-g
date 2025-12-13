"use client"

import dynamic from "next/dynamic"
import { MapHeader } from "@/components/features/map/MapHeader"
import { PharmacyList } from "@/components/features/map/PharmacyList"

// Dynamically import Map to prevent SSR issues with Leaflet
const PharmacyMap = dynamic(
    () => import("@/components/features/map/PharmacyMap"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
    }
)

export function MapPageContainer() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <MapHeader />

            <main className="flex-1 flex overflow-hidden">
                {/* Map Section - Takes remaining space */}
                <div className="flex-1 relative border-r border-gray-200">
                    <PharmacyMap />
                </div>

                {/* List Section - Fixed width on desktop */}
                <aside className="w-[400px] h-full hidden md:block overflow-hidden shadow-xl z-10">
                    <PharmacyList />
                </aside>
            </main>
        </div>
    )
}
