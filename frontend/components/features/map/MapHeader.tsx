import { MapPin } from "lucide-react"
import Link from "next/link"

export function MapHeader() {
    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-[#E91E63] p-1.5 rounded-lg">
                    <MapPin className="text-white h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-gray-900">Pharmacy Finder</h1>
                    <p className="text-xs text-gray-500">Searching for: <span className="font-medium text-gray-700">Paracetamol</span></p>
                </div>
            </div>
            <div>
                <Link href="/" className="text-sm font-medium text-[#E91E63] hover:text-[#D81B60] hover:underline">
                    New Search
                </Link>
            </div>
        </header>
    )
}
