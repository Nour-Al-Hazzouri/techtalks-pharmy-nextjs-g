import type { Metadata } from "next"
import { ChangePasswordPanel } from "@/components/features/map/ChangePasswordPanel"

export const metadata: Metadata = {
    title: "Change Password - Pharmacy Dashboard",
    description: "Change your account password.",
}

export default function PharmacyChangePasswordPage() {
    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden w-full md:max-w-xl mx-auto">
                <ChangePasswordPanel />
            </div>
        </div>
    )
}
