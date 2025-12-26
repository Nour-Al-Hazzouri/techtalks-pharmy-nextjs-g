import { VerificationContent } from "@/components/features/pharmacy"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "verification - ASTER PHARMACY",
    description: "Manage your pharmacy verification documents.",
}

export default function VerificationPage() {
    return <VerificationContent />
}
