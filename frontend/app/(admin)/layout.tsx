import { AdminSidebar } from "@/components/features/admin"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-dvh bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-hidden flex flex-col min-w-0 min-h-0 pt-[57px] md:pt-0">
                {children}
            </main>
        </div>
    )
}
