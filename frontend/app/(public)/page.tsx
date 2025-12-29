import { MedicineSearchHome } from "@/components/features/medicine/MedicineSearchHome"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pharmy - Find Medicine Nearby",
    description: "Search for medicine availability at pharmacies near you.",
}

export default function HomePage() {
    return <MedicineSearchHome />
}
