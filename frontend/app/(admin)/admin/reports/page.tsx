import { ReportsContent } from "@/components/features/admin"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "User Reports - Admin Dashboard",
    description: "Manage pharmacy reports and issues.",
}

export default function ReportsPage() {
    return <ReportsContent />
}
