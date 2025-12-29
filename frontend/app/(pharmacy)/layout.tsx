"use client"

import * as React from "react"
import { PharmacySidebar } from "@/components/features/pharmacy/PharmacySidebar"
import { PharmacyRegistrationForm } from "@/components/features/pharmacy/PharmacyRegistrationForm"
import { getPharmacyProfile, type PharmacyProfile } from "@/lib/api/pharmacy"
import { ApiError } from "@/lib/api/config"
import { Loader2 } from "lucide-react"

export default function PharmacyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [pharmacy, setPharmacy] = React.useState<PharmacyProfile | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [needsRegistration, setNeedsRegistration] = React.useState(false)

    const fetchPharmacy = React.useCallback(async () => {
        try {
            setLoading(true)
            const response = await getPharmacyProfile()
            setPharmacy(response.data)
            setNeedsRegistration(false)
        } catch (error) {
            // Check if it's a 404 (Not Found) or 400 with specific message
            // The backend might return 404 if no pharmacy exists for this user
            const isNotFound = error instanceof ApiError && (error.status === 404 || error.message.includes("not found"));

            if (!isNotFound) {
                console.error("Failed to fetch pharmacy profile:", error)
            }

            if (isNotFound) {
                setNeedsRegistration(true)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchPharmacy()
    }, [fetchPharmacy])

    if (loading) {
        return (
            <div className="h-dvh flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#E91E63]" />
            </div>
        )
    }

    if (needsRegistration) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <PharmacyRegistrationForm onSuccess={fetchPharmacy} />
            </div>
        )
    }

    return (
        <div className="flex h-dvh bg-gray-50 overflow-hidden">
            <PharmacySidebar
                pharmacyName={pharmacy?.name ?? "Loading..."}
                pharmacyLocation={pharmacy?.address ?? ""}
            />
            <main className="flex-1 overflow-hidden flex flex-col min-w-0 min-h-0 pt-[57px] md:pt-0">
                {children}
            </main>
        </div>
    )
}
