import { Metadata } from "next"
import { AdminDashboardContent } from "@/components/features/admin"

export const metadata: Metadata = {
    title: "Admin Dashboard - Pharmy",
    description: "Pharmacy verification and medicine management dashboard",
}

export default function AdminDashboardPage() {
    return <AdminDashboardContent />
}
