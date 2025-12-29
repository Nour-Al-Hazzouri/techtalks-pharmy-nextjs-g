import { MapPageContainer } from "@/components/features/map/MapPageContainer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pharmacy Finder Map - Pharmy",
    description: "Find pharmacies on the interactive map.",
}

import { Suspense } from "react"

export default function MapPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50">Loading Map...</div>}>
            <MapPageContainer />
        </Suspense>
    )
}
