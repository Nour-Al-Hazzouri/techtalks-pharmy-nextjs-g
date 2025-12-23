import { MapPageContainer } from "@/components/features/map/MapPageContainer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pharmacy Finder Map - Pharmy",
    description: "Find pharmacies on the interactive map.",
}

export default function MapPage() {
    return <MapPageContainer />
}
