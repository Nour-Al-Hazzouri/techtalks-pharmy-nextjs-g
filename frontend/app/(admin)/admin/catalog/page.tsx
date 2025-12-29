import { Metadata } from "next"
import { MedicineCatalogContent } from "@/components/features/admin"

export const metadata: Metadata = {
    title: "Medicine Catalog - Admin Dashboard",
    description: "Manage medicines in the system catalog",
}

export default function MedicineCatalogPage() {
    return <MedicineCatalogContent />
}
