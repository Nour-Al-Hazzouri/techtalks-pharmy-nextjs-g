import { PharmacySidebar } from "@/components/features/pharmacy/PharmacySidebar"
import { MOCK_CURRENT_PHARMACY } from "@/lib/mock-data"

export default function PharmacyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In a real app, we would fetch the current pharmacy from the backend
    const pharmacy = MOCK_CURRENT_PHARMACY

    return (
        <div className="flex min-h-dvh bg-gray-50">
            <PharmacySidebar
                pharmacyName={pharmacy.name}
                pharmacyLocation={pharmacy.location}
            />
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
