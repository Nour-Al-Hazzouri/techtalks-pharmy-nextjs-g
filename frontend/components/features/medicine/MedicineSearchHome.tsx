"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { logout } from "@/lib/api/auth"
import { MedicineSearchBar } from "@/components/features/medicine/MedicineSearchBar"
import { Button } from "@/components/ui/button"

export function MedicineSearchHome() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error("Backend logout failed:", error)
        } finally {
            // Clear auth cookies
            document.cookie = "auth_token=; path=/; max-age=0"
            document.cookie = "user_role=; path=/; max-age=0"

            // Redirect to login
            router.push("/login")
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
            <div className="w-full absolute top-0 left-0 p-4 flex items-center justify-between bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Image
                        src="/pharmy_logo.jpg"
                        alt="Pharmy"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-md object-cover shrink-0"
                        unoptimized
                        priority
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Pharmacy Finder</h2>
                        <p className="text-xs text-gray-500">Find medicine at nearby pharmacies</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>

            <MedicineSearchBar />
        </div>
    )
}
