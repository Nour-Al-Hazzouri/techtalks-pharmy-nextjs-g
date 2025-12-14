import { Metadata } from "next"
import { VerifyPharmaciesContent } from "@/components/features/admin"

export const metadata: Metadata = {
    title: "Verify Pharmacies - Admin Dashboard",
    description: "Review and approve pending pharmacy registrations",
}

export default function VerifyPharmaciesPage() {
    return <VerifyPharmaciesContent />
}
